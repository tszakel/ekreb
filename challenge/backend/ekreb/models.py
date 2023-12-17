from django.db import models

class Word(models.Model):
    word = models.CharField(max_length=200, unique=True)

class Stats(models.Model):
    score = models.IntegerField()
    accuracy = models.FloatField()
