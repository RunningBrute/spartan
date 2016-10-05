function distance(lat1, lon1, lat2, lon2)
{
    var lat1_in_rad = Math.PI * lat1 / 180;
    var lat2_in_rad = Math.PI * lat2 / 180;
    var theta = lon1 - lon2;
    var theta_in_rad = Math.PI * theta / 180;
    var dist = Math.sin(lat1_in_rad) * Math.sin(lat2_in_rad) + Math.cos(lat1_in_rad) * Math.cos(lat2_in_rad) * Math.cos(theta_in_rad);

	dist = Math.acos(dist);
	dist = dist * 180 / Math.PI;
	dist = dist * 60 * 1.1515;
	dist = dist * 1.609344 * 1000;

	return dist;
}

function min_max(array)
{
    var max = -1;
    var min = 10000;

	for (i = 0; i < array.length; i++)
	{
	    if (array[i] > max) max = array[i];
	    if (array[i] < min) min = array[i];
	}

	return [min, max];
}

function get_single_intervals_time(points, time_data, interval_length_in_m)
{
    var coordinates = points.map(function (point){ return [point.lat, point.lon]; });
    var distt = 0;
    var time = 0.0;
    var intervals_time = [];

    for (i = 1; i < coordinates.length; i++)
    {
        lat1 = coordinates[i-1][0];
        lon1 = coordinates[i-1][1];
        lat2 = coordinates[i][0];
        lon2 = coordinates[i][1];

	    if (distt < interval_length_in_m)
	    {
	        distt = distt + distance(lat2, lon2, lat1, lon1);
	        time = time + (time_data[i] - time_data[i-1]);
	    }
	    else
	    {
            intervals_time.push(time);
	        distt = 0;
	        time = 0;
	    }
    }

    return intervals_time;
}

function set_chart_globals()
{
    Chart.defaults.global.elements.rectangle.borderColor = 'rgba(207, 74, 8, 0.8)';
    Chart.defaults.global.elements.rectangle.backgroundColor = 'rgba(207, 74, 8, 0.1)';

    Chart.defaults.bar.scales.xAxes[0].categoryPercentage = 0.9;
    Chart.defaults.bar.scales.xAxes[0].barPercentage = 1;

    Chart.defaults.global.elements.line.borderColor = 'rgba(207, 74, 8, 0.8)';
    Chart.defaults.global.elements.line.backgroundColor = 'rgba(207, 74, 8, 0.05)';
    Chart.defaults.global.legend.display = true;
    Chart.defaults.global.legend.position = "top";

    Chart.defaults.global.defaultFontColor = 'rgba(160, 160, 160, 0.8)';
    Chart.defaults.global.defaultFontFamily = 'Helvetica';
    Chart.defaults.global.defaultFontSize = 12;
    Chart.defaults.global.defaultFontStyle = "Bold";
}

function render_charts(charts_id, pace1_id, pace2_id, points, average_hr, average_cad)
{
    set_chart_globals();

    var hr_data = points.map(function (point){ return point.hr; });
    var cad_data = points.map(function (point){ return point.cad; });
    var time_data = points.map(function (point)
            {
                var started_time = new Date(points[0].time).getTime();
			    var actual_time = new Date(point.time).getTime();
			    var delta_time_in_ms = actual_time - started_time;
			    const one_minute_in_ms = 1000;

			    return delta_time_in_ms / one_minute_in_ms;
		    });

    avg_hr_data = [];
    avg_cad_data = [];

    var single_km_times = get_single_intervals_time(points, time_data, 1000);

    if (average_hr)
    {
        avg_hr_data = new Array(hr_data.length);
        avg_hr_data.fill(average_hr);
    }

    if (average_cad)
    {
        avg_cad_data = new Array(cad_data.length);
        avg_cad_data.fill(average_cad);
    }

    if (average_hr)
    {
        ctx = $(charts_id);
        chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: time_data,
                datasets: [{
                    borderColor: "rgba(153, 0, 0, 0.8)",
                    backgroundColor: "rgba(153, 0, 0, 0.1)",
                    label: "Heart rate",
                    fill: true,
                    cubicInterpolationMode: "monotone",
                    pointRadius: 0,
                    data: hr_data
                },
                {
                    borderColor: "rgba(153, 0, 0, 0.4)",
                    backgroundColor: "rgba(153, 0, 0, 0)",
                    label: "Avg HR",
                    fill: false,
                    pointRadius: 0,
                    data: avg_hr_data
                },
                {
                    borderColor: "rgba(0, 76, 153, 0.8)",
                    backgroundColor: "rgba(0, 76, 153, 0.1)",
                    label: "Cadence",
                    fill: true,
                    pointRadius: 0,
                    data: cad_data
                },
                {
                    borderColor: "rgba(0, 76, 153, 0.4)",
                    backgroundColor: "rgba(0, 76, 153, 0)",
                    label: "Avg cad",
                    fill: false,
                    pointRadius: 0,
                    data: avg_cad_data
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        gridLines: {
                            color: "rgba(207, 74, 8, 0.1)"
                        },
                        ticks: {
                            beginAtZero: false
                        }
                    }],
                    xAxes: [{
                        gridLines: {
                            color: "rgba(207, 74, 8, 0.1)"
                        },
                        ticks: {
                            maxTicksLimit: 10,
                            minRotation: 0,
                            maxRotation: 0
                        }
                    }]
                }
            }
        });

    }

    single_km_times = single_km_times.map(function (time){ return time / 60; });

    km_ids = [];

    for (i = 0; i < single_km_times.length; i++)
    {
        km_ids.push (i + 1);
    }

    var min_y = min_max(single_km_times)[0];
    var max_y = min_max(single_km_times)[1];

    scale = 0.05;

    min_y = min_y - scale * min_y;
    max_y = max_y + scale * max_y;

    var pace_options =
    {
        scales:
        {
            yAxes:
            [{
                gridLines: { color: "rgba(207, 74, 8, 0.1)" },
                ticks: { max: max_y, min: min_y }
            }],
            xAxes:
            [{
                gridLines: { color: "rgba(207, 74, 8, 0.1)" },
			    ticks: { maxTicksLimit: 15, minRotation: 0, maxRotation: 0 }
            }]
        }
    };

    ctx = $(pace1_id);
    pace1_chart = new Chart(ctx,
    {
        type: "bar",
        data:
        {
            labels: km_ids,
            datasets:
            [{
                borderWidth: 1,
                label: "Pace",
                fill: true,
                data: single_km_times
            }]
		},
		options: pace_options
    });

    var points_num = 1;
    var single_km_times_2 = get_single_intervals_time(points, time_data, 500);

    single_km_times_2 = single_km_times_2.map(function (time){ return time / 60; });
    km_ids_2 = [];

    for (i = 0; i < single_km_times_2.length; i++)
    {
        km_ids_2.push (i + 1);
    }

    var min_y = min_max(single_km_times_2)[0];
    var max_y = min_max(single_km_times_2)[1];

    min_y = min_y - scale * min_y;
    max_y = max_y + scale * max_y;

    pace_options.scales.yAxes[0].ticks.max = max_y;
    pace_options.scales.yAxes[0].ticks.min = min_y;

    ctx = $(pace2_id);
    pace2_chart = new Chart(ctx,
    {
        type: "line",
        data:
        {
            labels: km_ids_2,
            datasets:
            [{
                label: "Pace",
                fill: true,
                data: single_km_times_2
            }]
		},
		options: pace_options
    });
}
