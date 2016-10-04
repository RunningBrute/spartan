function render_activity_map(map_id, points)
{
    var map = L.map(map_id).setView([0, 0], 13);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var polyline_points = points.map(function (point){ return [point.lat, point.lon]; });

    var polyline = L.polyline(polyline_points, {color: 'red'}).addTo(map);
    map.fitBounds(polyline.getBounds());
}
