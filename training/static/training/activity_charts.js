var activityChart = {};

activityChart.distance = function(lat1, lon1, lat2, lon2) {
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
};

activityChart.minMax = function(array) {
    var max = -1;
    var min = 10000;

    for (i = 0; i < array.length; i++) {
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
        lat1 = points[i-1].lat;
        lon1 = points[i-1].lon;
        lat2 = points[i].lat;
        lon2 = points[i].lon;

        distance = activityChart.distance(lat2, lon2, lat1, lon1);
        time = points[i].time - points[i-1].time;
    }

    return intervals_time;
}

function setGlobalSettings()
{
    Chart.defaults.global.elements.rectangle.borderColor = 'rgba(207, 74, 8, 0.8)';
    Chart.defaults.global.elements.rectangle.backgroundColor = 'rgba(207, 74, 8, 0.1)';

    Chart.defaults.bar.scales.xAxes[0].categoryPercentage = 0.9;
    Chart.defaults.bar.scales.xAxes[0].barPercentage = 1;

    Chart.defaults.global.elements.line.borderColor = 'rgba(207, 74, 8, 0.8)';
    Chart.defaults.global.elements.line.backgroundColor = 'rgba(207, 74, 8, 0.05)';
    Chart.defaults.global.legend.display = true;
    Chart.defaults.global.legend.position = "right";
}

function render_charts(charts_id, pace1_id, pace2_id, points, average_hr, average_cad)
{
    setGlobalSettings();

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

    var datasets = [];

    if (average_hr)
    {
        datasets = datasets.concat(
            [
            {
                borderColor: "rgba(153, 0, 0, 0.8)",
                backgroundColor: "rgba(153, 0, 0, 0.1)",
                label: "HR",
                fill: false,
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
            }
            ]);

        avg_hr_data = new Array(hr_data.length);
        avg_hr_data.fill(average_hr);
    }

    if (average_cad)
    {
        avg_cad_data = new Array(cad_data.length);
        avg_cad_data.fill(average_cad);

        datasets = datasets.concat(
            [
                {
                    borderColor: "rgba(0, 76, 153, 0.8)",
                    label: "Cadence",
                    fill: false,
                    pointRadius: 0,
                    data: cad_data
                },
                {
                    borderColor: "rgba(0, 76, 153, 0.4)",
                    label: "Avg cadence",
                    fill: false,
                    pointRadius: 0,
                    data: avg_cad_data
                },
            ]);
    }

        ctx = $(charts_id);
        chart = new Chart(ctx, {
            type: "line",
            data: {
                labels: time_data,
                datasets: datasets
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
