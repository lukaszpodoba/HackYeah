# route_service.py
from __future__ import annotations
import math
import heapq
from typing import Dict, List, Optional, Tuple
from collections import defaultdict
from sqlalchemy.orm import Session

from src.app.models.items import Stop, Departure
from src.app.schemas.form import RouteResponse, RouteStop, RouteSegment


def euclid_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    KM_PER_DEG = 111.32
    lat_avg_rad = math.radians((lat1 + lat2) / 2.0)
    dx = (lon2 - lon1) * KM_PER_DEG * math.cos(lat_avg_rad)
    dy = (lat2 - lat1) * KM_PER_DEG
    return math.hypot(dx, dy)


def build_graph(session: Session) -> Tuple[
    Dict[int, dict],               # stops
    Dict[int, int],                # stop_by_code
    Dict[int, List[Tuple[int,float,int]]]  # graph: sid -> [(sid2, dist_km, line_id)]
]:
    stops: Dict[int, dict] = {}
    stop_by_code: Dict[int, int] = {}
    for s in session.query(Stop).all():
        stops[s.id] = {
            "code": s.stop_code,
            "name": s.stop_name,
            "lat": float(s.latitude),
            "lon": float(s.longitude),
        }
        stop_by_code[s.stop_code] = s.id

    line_to_stops = defaultdict(set)
    for line_id, stop_id in session.query(Departure.line_id, Departure.stop_id).distinct():
        if stop_id in stops:
            line_to_stops[line_id].add(stop_id)

    graph: Dict[int, List[Tuple[int,float,int]]] = defaultdict(list)
    for line_id, sset in line_to_stops.items():
        s_list = list(sset)
        n = len(s_list)
        for i in range(n):
            for j in range(i + 1, n):
                a, b = s_list[i], s_list[j]
                d = euclid_km(stops[a]["lat"], stops[a]["lon"], stops[b]["lat"], stops[b]["lon"])
                graph[a].append((b, d, line_id))
                graph[b].append((a, d, line_id))
    return stops, stop_by_code, graph


def astar_route(
    stops: Dict[int, dict],
    graph: Dict[int, List[Tuple[int, float, int]]],
    start_sid: int,
    goal_sid: int,
    transfer_penalty_km: float = 2.0
) -> Tuple[Optional[List[Tuple[int, Optional[int]]]], float]:
    def h(sid: int) -> float:
        return euclid_km(stops[sid]["lat"], stops[sid]["lon"], stops[goal_sid]["lat"], stops[goal_sid]["lon"])

    pq: List[Tuple[float, float, int, Optional[int]]] = []
    heapq.heappush(pq, (h(start_sid), 0.0, start_sid, None))
    best_g = {start_sid: 0.0}
    parent: Dict[int, Tuple[Optional[int], Optional[int]]] = {start_sid: (None, None)}  # node -> (prev_node, line_id)

    while pq:
        f, g, u, prev_line = heapq.heappop(pq)
        if u == goal_sid:
            path: List[Tuple[int, Optional[int]]] = []
            cur = u
            while cur is not None:
                p_node, p_line = parent[cur]
                path.append((cur, p_line))
                cur = p_node
            path.reverse()
            return path, g

        for v, dist, line_on_edge in graph.get(u, []):
            add = dist + (transfer_penalty_km if (prev_line is not None and prev_line != line_on_edge) else 0.0)
            ng = g + add
            if ng < best_g.get(v, float("inf")):
                best_g[v] = ng
                parent[v] = (u, line_on_edge)
                heapq.heappush(pq, (ng + h(v), ng, v, line_on_edge))

    return None, float("inf")


def find_route(
    session: Session,
    start_stop_code: int,
    end_stop_code: int,
    transfer_penalty_km: float = 2.0
) -> RouteResponse:
    stops, stop_by_code, graph = build_graph(session)

    if start_stop_code not in stop_by_code or end_stop_code not in stop_by_code:

        return RouteResponse(total_cost_km=None, stops=[], segments=[])

    start_sid = stop_by_code[start_stop_code]
    goal_sid  = stop_by_code[end_stop_code]

    path, cost = astar_route(stops, graph, start_sid, goal_sid, transfer_penalty_km)
    if not path:
        return RouteResponse(total_cost_km=None, stops=[], segments=[])

    out_stops: List[RouteStop] = []
    last_line = None
    for idx, (sid, used_line) in enumerate(path):
        change = None
        if idx > 0 and used_line != last_line:
            change = used_line
        out_stops.append(RouteStop(
            stop_code=stops[sid]["code"],
            stop_name=stops[sid]["name"],
            line_id_change_here=change
        ))
        last_line = used_line

    segments: List[RouteSegment] = []
    if len(path) == 1:
        code = stops[path[0][0]]["code"]
        segments.append(RouteSegment(line_id=-1, start_stop_code=code, end_stop_code=code))
    else:
        seg_start_code = stops[path[0][0]]["code"]
        current_line = path[1][1]

        for i in range(1, len(path)):
            node_code = stops[path[i][0]]["code"]
            line_here = path[i][1]
            next_line = path[i + 1][1] if i + 1 < len(path) else None

            if next_line != current_line:
                segments.append(RouteSegment(
                    line_id=current_line if current_line is not None else -1,
                    start_stop_code=seg_start_code,
                    end_stop_code=node_code
                ))
                seg_start_code = node_code
                current_line = next_line

    return RouteResponse(
        total_cost_km=round(cost, 3),
        stops=out_stops,
        segments=segments
    )
