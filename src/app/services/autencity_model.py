import time
import math



def calculate_new_post_autencity(as_field: float, delay_on_last_stop_in_minutes: float):
    if delay_on_last_stop_in_minutes is None:
        delay_on_last_stop_in_minutes = 1

    return max(as_field + delay_on_last_stop_in_minutes * 0.1, 1)

# do tej metody wchodza zgloszenia ktre maja >0 as_score
# metoda wywolywana co 5 min
def recalculate_post_autencity(current_as, report_time, like_count, dislike_count):

    time_decay = 2 ** (report_time - time.time()) ## kolejnosc ???

    if like_count > 0 or dislike_count > 0:
        current_as = (like_count - dislike_count)  / (like_count + dislike_count)

    current_as*=time_decay

    return current_as

# metoda wyowlywana raz na dzien
# dodac updaty bazki
def update_user_as(user_id, declarated_delay, real_delay, approved_by_admin):
    if approved_by_admin:
# do as_history dla danego user dajemy 1
    else:
        as_score = max(0, 1 - abs(real_delay - declarated_delay) / real_delay)

#












