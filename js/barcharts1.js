var margin = {top: 40, right: 40, bottom: 60, left: 40};
var width = $("#bar-chart1").width()- margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;
// Load CSV file
d3_v4.csv("data/Collegedata.csv", function(data) {

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

    data.forEach(function (college) {
        var x = college.COST;
        tuition.push(x);

    });

    console.log(tuition);
//bar chart


    data = tuition;

    d3_v4.select("#bar-chart1")
        .datum(data)
        .call(histogramChart()
            .bins(d3_v4.scale.linear().ticks(20))
            .tickFormat(d3_v4.format(".02f")))
})

function histogramChart() {
    var margin = {top: 0, right: 0, bottom: 20, left: 0},
        width = 960,
        height = 500;

    var histogram = d3_v4.layout.histogram(),
        x = d3_v4.scale.linear(),
        y = d3_v4.scale.linear(),
        xAxis = d3_v4.svg.axis().scale(x).orient("bottom").tickSize(6, 0);

    function chart(selection) {
        selection.each(function(data) {

            // Compute the histogram.
            data = histogram(data);

            console.log(histogram(data));
            // Update the x-scale.
            x   .domain(d3_v4.extent(data))
                .range[0, width];

            // Update the y-scale.
            y   .domain([0, d3_v4.max(data, function(d) { return d.y; })])
                .range([height - margin.top - margin.bottom, 0]);

            // Select the svg element, if it exists.
            var svg = d3_v4.select(this).selectAll("svg").data([data]);

            // Otherwise, create the skeletal chart.
            var gEnter = svg.enter().append("svg").append("g");
            gEnter.append("g").attr("class", "bars");
            gEnter.append("g").attr("class", "x axis");

            // Update the outer dimensions.
            svg .attr("width", width)
                .attr("height", height);

            // Update the inner dimensions.
            var g = svg.select("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // Update the bars.
            var bar = svg.select(".bars").selectAll(".bar").data(data);
            bar.enter().append("rect");
            bar.exit().remove();
            bar .attr("width", 10)
                .attr("x", function(d) { return x(d.x); })
                .attr("y", function(d) { return y(d.y); })
                .attr("height", function(d) { return y.range()[0] - y(d.y); })
                .order();

            // Update the x-axis.
            g.select(".x.axis")
                .attr("transform", "translate(0," + y.range()[0] + ")")
                .call(xAxis);
        });
    }

    chart.margin = function(_) {
        if (!arguments.length) return margin;
        margin = _;
        return chart;
    };

    chart.width = function(_) {
        if (!arguments.length) return width;
        width = _;
        return chart;
    };

    chart.height = function(_) {
        if (!arguments.length) return height;
        height = _;
        return chart;
    };

    // Expose the histogram's value, range and bins method.
    d3_v4.rebind(chart, histogram, "value", "range", "bins");

    // Expose the x-axis' tickFormat method.
    d3_v4.rebind(chart, xAxis, "tickFormat");

    return chart;
}






