from django.conf.urls import url, include

from . import views


urlpatterns = [
    url('^statistics$', views.statistics, name='statistics'),
    url('^statistics_this_month$', views.statistics_this_month, name='statistics_this_month'),
]
