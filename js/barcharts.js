
//######################################################
var margin = {top: 40, right: 40, bottom: 60, left: 40};
var width = $("#bar-chart1").width()- margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;
// Load CSV file
d3_v4.csv("data/Collegedata1.csv", function(data){

    // Analyze the dataset in the web console
    console.log(data[1]);

    data.forEach(function (d) {
        d.LATITUDE = +d.LATITUDE;
        d.LONGITUDE = +d.LONGITUDE;
        d.ADM_RATE = +d.ADM_RATE;
        d.COST = +d.COST;
    });

    var tuition = [];
    var ACT_score = [];

    data.forEach( function (college)
    {
        var x = college.COST;
        tuition.push(x);

    });

    console.log(tuition);
//bar chart


    data = tuition;
    //var data = d3_v4.range(1000).map(d3_v4.randomBates(10));

    var formatCount = d3_v4.format(",.0f");

    var svg = d3_v4.select("#bar-chart1").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x = d3_v4.scaleLinear()
        .domain(d3_v4.extent(tuition))
        .rangeRound([0, width]);

    var bins = d3_v4.histogram()
        .domain(x.domain())
        .thresholds(x.ticks(20))
        (data);

    console.log(bins);
    var y = d3_v4.scaleLinear()
        .domain([0, d3_v4.max(bins, function(d) { return d.length; })])
        .range([height, 0]);

    var bar = g.selectAll(".bar")
        .data(bins)
        .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; });

    bar.append("rect")
        .attr("x", 1)
        .attr("width", x(bins[0].x1) - x(bins[0].x0) - 1)
        .attr("height", function(d) { return height - y(d.length); });

    bar.append("text")
        .attr("dy", ".75em")
        .attr("y", -15)
        .attr("x", (x(bins[0].x1) - x(bins[0].x0)) / 2)
        .attr("text-anchor", "middle")
        .text(function(d) { return formatCount(d.length); });

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3_v4.axisBottom(x));
});
