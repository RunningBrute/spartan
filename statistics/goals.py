import collections
from typing import List

from training import units
from statistics import models
from statistics.statistics import Statistics


Goal = collections.namedtuple('Goal', ['name', 'volume', 'progress'])


class Goals:
    def __init__(self, user):
        self.user = user
        self.statistics = Statistics(user)

    def set(self, name, volume):
        models.Goal.objects.update_or_create(user=self.user, name=name, defaults={'volume': volume})

    def all(self) -> List[Goal]:
        volumes = {f['name']: f['volume'] for f in self.statistics.favourites_this_month()}

        def make_goal(goal):
            current = volumes.get(goal.name, units.Volume(0)).number()
            return Goal(name=goal.name, volume=goal.volume, progress=round(current / goal.volume * 100))
        return [make_goal(g) for g in models.Goal.objects.filter(user=self.user)]
