# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-09-28 10:28
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('training', '0026_remove_gpx_length_3d'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='reps',
            options={'ordering': ['pk']},
        ),
        migrations.RemoveField(
            model_name='workout',
            name='workout_type',
        ),
    ]