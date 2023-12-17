# Generated by Django 4.2.5 on 2023-09-20 04:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ekreb', '0006_alter_stats_playerid'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='stats',
            name='playerID',
        ),
        migrations.AlterField(
            model_name='stats',
            name='accuracy',
            field=models.FloatField(),
        ),
        migrations.AlterField(
            model_name='stats',
            name='score',
            field=models.IntegerField(),
        ),
    ]