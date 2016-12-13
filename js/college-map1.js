/*
 *  StationMap - Object constructor function
 *  @param _parentElement   -- HTML element in which to draw the visualization
 *  @param _data            -- Array with all stations of the bike-sharing network
 */

StationMap = function(_parentElement, _data, _mapPosition) {

    this.parentElement = _parentElement;
    this.data = _data;
    this.mapPosition = _mapPosition;
    this.initVis();
}


/*
 *  Initialize station map
 */

StationMap.prototype.initVis = function() {
    var vis = this;

    L.Icon.Default.imagePath = 'images/';

    vis.map = L.map(vis.parentElement).setView(vis.mapPosition, 13);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'}).addTo(vis.map);
    console.log("yo");
    vis.wrangleData();


//trian data
    path = "js/MTBA-lines.json";
    $.getJSON(path, function(data) {
        console.log(data);

        L.geoJson(data, {
            style: styleBorough,
            weight: 5,
            fillOpacity: 0.7}).addTo(vis.map);
    });

    function styleBorough(feature) {
        //Style the train line colors
        return { color: feature.properties['LINE'] };

    }


}


/*
 *  Data wrangling
 */

StationMap.prototype.wrangleData = function() {
    var vis = this;
    console.log(vis.data);

    var marker = L.marker([42.378774, -71.117303]).addTo(vis.map);

    var markers = [];

    vis.data.forEach(function(d){


        markers.push(L.marker([d.lat, d.long]).bindPopup(d.name + "<br> Bikes Availabile: " + d.nbBikes + "<br>Empty Docks: " + d.nbEmptyDocks));

    });

    var group = L.featureGroup(markers).addTo(vis.map);


    // Currently no data wrangling/filtering needed
    // vis.displayData = vis.data;

    // Update the visualization
    vis.updateVis();

}


/*
 *  The drawing function
 */

StationMap.prototype.updateVis = function() {



}