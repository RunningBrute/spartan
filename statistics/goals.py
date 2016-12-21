import collections
from typing import List

from django.contrib.auth.models import User

from training import units
from statistics import models
from statistics.statistics import Statistics


Goal = collections.namedtuple('Goal', ['name', 'volume', 'progress', 'percent', 'left'])


class Goals:
    def __init__(self, user: User) -> None:
        self.user = user
        self.statistics = Statistics(user)

    def set(self, name: str, volume: int) -> None:
        models.Goal.objects.update_or_create(user=self.user, name=name, defaults={'volume': volume})

    def delete(self, name: str) -> None:
        models.Goal.objects.filter(user=self.user, name=name).delete()

    def all(self) -> List[Goal]:
        volumes = {f['name']: f['volume'] for f in self.statistics.favourites_this_month()}

        def make_goal(goal):
            current = volumes.get(goal.name, units.Volume(0))
            return Goal(name=goal.name,
                        volume=goal.volume,
                        progress=current,
                        percent=round(current.number() / goal.volume * 100),
                        left=current.left_to(goal.volume))

        return [make_goal(g) for g in models.Goal.objects.filter(user=self.user)]
