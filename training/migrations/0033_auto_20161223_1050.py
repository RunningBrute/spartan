# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2016-12-23 10:50
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('training', '0032_auto_20161013_0445'),
    ]

    operations = [
        migrations.RenameField(
            model_name='gpx',
            old_name='activity_type',
            new_name='name',
        ),
    ]
