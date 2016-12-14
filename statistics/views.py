from django.contrib.auth.decorators import login_required
from django.shortcuts import *

from training.statistics import Statistics


@login_required
def statistics(request):
    return render(request, 'statistics/statistics.html', {'statistics': Statistics(request.user)})


@login_required
def statistics_this_month(request):
    return render(request, 'statistics/statistics_this_month.html', {'statistics': Statistics(request.user)})
