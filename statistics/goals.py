import collections

from . import models


class Goals:
    def __init__(self, user):
        self.user = user

    def set(self, name, volume):
        models.Goal.objects.update_or_create(user=self.user, name=name, defaults={'volume': volume})

    def all(self):
        return models.Goal.objects.filter(user=self.user)
