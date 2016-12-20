import datetime
import pytz

from training import models
from .. import statistics
from .. import goals

from django.test import TestCase, RequestFactory
from django.contrib.auth.models import User


class StatisticsTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='jacob',
                                             email='jacob@…',
                                             password='top_secret')

        self.other_user = User.objects.create_user(username='zysz',
                                                   email='jacob@…',
                                                   password='top_secret')

        self.statistics = statistics.Statistics(self.user)

    def test_weeks(self):
        models.Workout.objects.create(user=self.user,
                                      started=datetime.datetime(2016, 9, 1, 0, 0, 0, tzinfo=pytz.utc),
                                      finished=datetime.datetime(2016, 9, 1, 0, 0, 1, tzinfo=pytz.utc))

        weeks = self.statistics.weeks(start=datetime.datetime(2016, 9, 4, 23, 59, 59))

        self.assertEqual(1, len(weeks))
        self.assertEqual(1, len(weeks[0].workouts))

        days = list(weeks[0].days)
        self.assertEqual(1, len(days[3].workouts)) # thursday

    def test_create_goal(self):
        user_goals = goals.Goals(self.user)
        user_goals.set("push-up", 100)
        user_goals.set("sit-up", 200)
        user_goals.set("push-up", 50)

        other_user_goals = goals.Goals(self.other_user)
        other_user_goals.set("push-up", 1000)

        self.assertEqual([50, 200], [g.volume for g in user_goals.all()])
