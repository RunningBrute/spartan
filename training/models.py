from django.db import models


class TrainingSession(models.Model):
    def utd(self):
        """ userfriendly training data string """
        return '\n'.join(map(lambda x: x.utd(), self.excercise_set.all()))


class Excercise(models.Model):
    def utd(self):
        """ userfriendly training data string """
        return ': '.join([self.name, self.sets])

    training_session = models.ForeignKey(TrainingSession)
    name = models.CharField(max_length=200)
    sets = models.CharField(max_length=200)
