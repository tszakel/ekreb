# Generated by Django 4.2.5 on 2023-09-20 03:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ekreb', '0004_stats'),
    ]

    operations = [
        migrations.AddField(
            model_name='stats',
            name='playerID',
            field=models.CharField(default='player1', max_length=50, unique=True),
        ),
    ]
