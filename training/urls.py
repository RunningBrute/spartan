from django.views.generic.edit import CreateView
from django.contrib.auth.forms import UserCreationForm
from django.conf.urls import url, include

from . import views

urlpatterns = [
    url('^', include('django.contrib.auth.urls')),
    url('^$', views.index, name='index'),

    url('^register/$',
        CreateView.as_view(
            template_name='registration/register.html',
            form_class=UserCreationForm,
            success_url='/'
        ), name='register'),

    url('^user_profile$', views.user_profile, name='user_profile'),

    url('^dashboard$', views.dashboard, name='dashboard'),

    url('^statistics/', include('statistics.urls')),

    url('^strength/', include('strength.urls')),

    url('^delete_workout/(?P<workout_id>[0-9]+)/$', views.delete_workout, name='delete_workout'),
    url('^workout/(?P<training_session_id>[0-9]+)/$', views.workout, name='workout'),

    url('^upload_gpx/$', views.upload_gpx, name='upload_gpx'),
    url('^endomondo/$', views.endomondo, name='endomondo'),
    url('^disconnect_endomondo/$', views.disconnect_endomondo , name='disconnect_endomondo'),
    url('^synchronize_endomondo/$', views.synchronize_endomondo, name='synchronize_endomondo'),
    url('^synchronize_endomondo_ajax/$', views.synchronize_endomondo_ajax, name='synchronize_endomondo_ajax'),
    url('^purge_endomondo/$', views.purge_endomondo, name='purge_endomondo'),

    url('^explorer/$', views.explorer, name='explorer'),
]
