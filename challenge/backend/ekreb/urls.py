from django.contrib import admin
from django.urls import path
from rest_framework import routers
from ekreb import views

urlpatterns = [
    path('admin/', admin.site.urls, name='admin'),
    path('api/populate-words/', views.PopulateWords.as_view(), name='populate_word'),
    path('api/retrieve-word/', views.RetrieveWords.as_view(), name='retrieve_word'),
    path('stats/update-stats/', views.UpdateStats.as_view(), name='update_stats'),
    path('stats/retrieve-stats/', views.RetrieveStats.as_view(), name='retrieve_stats'),
    path('reset-stats/', views.ResetStats.as_view(), name='reset-stats'),

]
