import time
from datetime import datetime
from typing import Optional

from sqlalchemy.orm import Session

from src.app.models.items import Form, User, As_history

RT_W = 0.4
CONFIRM_W = 0.4
FRESH_W = 0.2
HALF_LIFE_S = 120 * 60


def now_ts() -> int:
    """Return current UNIX timestamp in seconds."""
    return int(time.time())


def time_decay_factor(last_ts: Optional[int]) -> float:
    """Compute 2^(-Δt/t_half) with Δt since last_ts."""
    if not last_ts:
        return 1.0
    dt = max(0, now_ts() - int(last_ts))
    return 2 ** (-(dt / float(HALF_LIFE_S)))


def rt_match_from_delays(reported_delay_min: float, official_delay_min: Optional[float]) -> float:
    """Return RT match in [0,1]; 0 at 15-min diff; None -> 0.5."""
    if official_delay_min is None:
        return 0.75
    diff = abs(float(reported_delay_min) - float(official_delay_min))
    return max(0.0, 1.0 - (diff / 15.0))


def confirmations_ratio(like_total: Optional[int], dislike_total: Optional[int]) -> float:
    """Return likes/(likes+dislikes) or 0 if no reactions."""
    likes = int(like_total or 0)
    dislikes = int(dislike_total or 0)
    total = likes + dislikes
    return 0.0 if total == 0 else likes / total


def freshness_factor(created_ts: int) -> float:
    """Linearly decay to 0 within 60 minutes from created_ts."""
    age_s = max(0, now_ts() - int(created_ts))
    return max(0.0, 1.0 - (age_s / 3600.0))


def initial_authenticity_score(
    reported_delay_min: float, official_delay_min: Optional[float]
) -> float:
    """Compute initial authenticity: 0.5*rt + 0.3*0 + 0.2*1."""
    rt = rt_match_from_delays(reported_delay_min, official_delay_min)
    base = RT_W * rt + CONFIRM_W * 0.0 + FRESH_W * 1.0
    return max(0.0, min(1.0, base))


def _to_timestamp(dt_or_str) -> int:
    """Convert datetime or 'YYYY-MM-DD HH:MM:SS' string to UNIX timestamp."""
    if isinstance(dt_or_str, str):
        tstruct = time.strptime(dt_or_str, "%Y-%m-%d %H:%M:%S")
        return int(time.mktime(tstruct))
    return int(dt_or_str.timestamp())


def create_form_with_initial_score(
    session: Session,
    *,
    user_id: int,
    departure_id: int,
    stop_id: int,
    line_id: int,
    category: str,
    reported_delay_min: int,
    official_delay_min: Optional[int] = None,
    confirmed_by_admin: bool = False,
) -> Form:
    """Insert Form with initial as_form and current report_time."""
    ts = now_ts()
    form = Form(
        user_id=user_id,
        departure_id=departure_id,
        stop_id=stop_id,
        line_id=line_id,
        category=category,
        report_time=datetime.fromtimestamp(ts),
        as_form=0.75,
        confirmed_by_admin=confirmed_by_admin,
        like_total=0,
        dislike_total=0,
        delay=reported_delay_min,
    )
    form.as_form = int(
        round(initial_authenticity_score(reported_delay_min, official_delay_min) * 100)
    )
    session.add(form)
    session.commit()
    session.refresh(form)
    return form


def refresh_form_score(
    session: Session, *, form_id: int, official_delay_min: Optional[int] = None
) -> Form:
    """Recompute as_form using confirmations, freshness, and time-decay."""
    form = session.get(Form, form_id)
    if not form:
        raise ValueError("Form not found")

    report_ts = _to_timestamp(form.report_time)
    rt = rt_match_from_delays(float(form.delay or 0), official_delay_min)
    conf = confirmations_ratio(form.like_total, form.dislike_total)
    fresh = freshness_factor(report_ts)
    base = RT_W * rt + CONFIRM_W * conf + FRESH_W * fresh
    decay = max(0.1, time_decay_factor(report_ts))
    score = max(0.0, min(1.0, base * decay))
    form.as_form = int(round(score * 100))
    session.commit()
    session.refresh(form)
    return form


def apply_like_dislike(
    session: Session, *, form_id: int, like_delta: int = 0, dislike_delta: int = 0
) -> Form:
    """Adjust like/dislike counters and refresh authenticity."""
    form = session.get(Form, form_id)
    if not form:
        raise ValueError("Form not found")
    form.like_total = max(0, (form.like_total or 0) + int(like_delta))
    form.dislike_total = max(0, (form.dislike_total or 0) + int(dislike_delta))
    session.commit()
    session.refresh(form)
    return refresh_form_score(session, form_id=form_id, official_delay_min=None)


def daily_update_user_as(
    session: Session,
    *,
    user_id: int,
    declarated_delay_min: Optional[int],
    real_delay_min: Optional[int],
    approved_by_admin: bool,
) -> int:
    """Append daily AS value (0..100) to As_history for a user."""
    user = session.get(User, user_id)
    if not user:
        raise ValueError("User not found")

    if approved_by_admin:
        val = 100
    else:
        if real_delay_min is None or declarated_delay_min is None:
            val = 0
        else:
            real = float(real_delay_min)
            declared = float(declarated_delay_min)
            denom = max(1.0, abs(real))
            agreement = max(0.0, 1.0 - abs(real - declared) / denom)
            val = int(max(0.0, min(1.0, agreement)) * 100)

    hist = As_history(as_user=val, user_id=user_id)
    session.add(hist)
    session.commit()
    return val
