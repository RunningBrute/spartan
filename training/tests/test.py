from django.test import TestCase, RequestFactory
from django.contrib.auth.models import AnonymousUser, User

from training.models import Workout, Excercise
from training import views


class ViewsTestCase(TestCase):
    def setUp(self):
        self.request_factory = RequestFactory()
        self.user = User.objects.create_user(username='jacob', email='jacob@…', password='top_secret')

    def _start_workout(self):
        request = self.request_factory.get('')
        request.user = self.user

        views.start_workout(request)

        # workout gets started when first excercise starts
        workout = Workout.objects.get()
        self.assertFalse(workout.live())

        return workout

    def _finish_workout(self, workout):
        request = self.request_factory.get('')
        request.user = self.user

        views.finish_workout(request, workout.pk)
        workout.refresh_from_db()
        self.assertFalse(workout.live())
        self.assertIsNotNone(workout.started)
        self.assertIsNotNone(workout.finished)

    def _start_excercise(self, workout):
        request = self.request_factory.post('', {'name': "push-up"})
        request.user = self.user
        views.add_excercise(request, workout.pk)
        excercise = Excercise.objects.latest('pk')
        return excercise

    def _add_reps(self, excercise, reps):
        request = self.request_factory.post('', {'reps': reps})
        request.user = self.user
        views.add_reps(request, excercise.pk)
        excercise.refresh_from_db()

    def test_full_session(self):
        workout = self._start_workout()

        push_ups = self._start_excercise(workout)

        workout.refresh_from_db()
        self.assertTrue(workout.live())

        self._add_reps(push_ups, "10")
        self._add_reps(push_ups, "10")

        self.assertEqual(20, sum(map(lambda x: x.reps, push_ups.reps_set.all())))

        crunches = self._start_excercise(workout)
        self._add_reps(crunches, "20")

        self._finish_workout(workout)


import os
from training import gpx
from django.core.files.uploadedfile import SimpleUploadedFile


class GpxTestCase(TestCase):
    def setUp(self):
        self.request_factory = RequestFactory()
        self.user = User.objects.create_user(username='jacob', email='jacob@…', password='top_secret')

    def test_gpx_should_be_properly_imported(self):
        request = self.request_factory.get('')
        request.user = self.user

        BASE_DIR = os.path.dirname(os.path.abspath(__file__))
        GPX_FILE = os.path.join(BASE_DIR, "3p_simplest.gpx")
        request.FILES['gpxfile'] = SimpleUploadedFile('workout.gpx', open(GPX_FILE, 'rb').read())

        gpx.save_gpx(request)
