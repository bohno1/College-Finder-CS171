// --> CREATE SVG DRAWING AREA
var margin = {top: 40, right: 40, bottom: 60, left: 200};
var width = $("#choropleth").width()- margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;


var margin_bar = {top: 40, right: 200, bottom: 60, left: 40};
var width_bar = ($("#bar-chart1").width()- margin.left - margin.right),
    height_bar = 600 - margin.top - margin.bottom;


var choropleth = d3.select("#choropleth").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//projection
var projection = d3.geo.albersUsa()
    .translate([width/2, height/2])    // translate to center of screen
    .scale([1000]);          // scale things down so see entire US

var path = d3.geo.path()
    .projection(projection);

// Path group
var countries = choropleth
    .append("g")
    .attr("id", "countries");

//frequency chart

var svg = d3_v4.select("#bar-chart1").append("svg")
    .attr("width", width_bar + margin_bar.left + margin_bar.right)
    .attr("height", height_bar + margin_bar.top + margin_bar.bottom)
    .append("g")
    .attr("transform", "translate(" + margin_bar.left + "," + margin_bar.top + ")");

//g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3_v4.scaleLinear().rangeRound([0, width-150]);
var y = d3_v4.scaleLinear().range([height, 0]);

svg.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3_v4.axisBottom(x));


//Global variables
var dataAfrica;
var legendlabels;
var textFormat= d3.format ("02.02s");

var college_data, centered, filtered_data;


//initialize sliders
$( function() {
    $( "#slider-range1" ).slider({
        range: true,
        min: 0,
        max: 65000,
        step: 5000,
        values: [ 0, 65000 ],
        slide: function( event, ui ) {
            $( "#amount1" ).val( "$" + ui.values[ 0 ] + "-$" + ui.values[ 1 ] );
        },
        change: function() {
            updateMap();
        }
    });
    $( "#amount1" ).val( "$" + $( "#slider-range1" ).slider( "values", 0 ) +
        " - $" + $( "#slider-range1" ).slider( "values", 1 ) );
    $("#slider-range1 > span").addClass("glyphicon glyphicon-usd");
} );

$( function() {
    $( "#slider-range2" ).slider({
        range: true,
        min: 0,
        max: 1600,
        values: [ 0, 2400],
        slide: function( event, ui ) {
            $( "#amount2" ).val( ui.values[ 0 ] + "-" + ui.values[ 1 ] );
        },
        change: function() {
            updateMap();
        }
    });
    $( "#amount2" ).val(  $( "#slider-range2" ).slider( "values", 0 ) +
        " - " + $( "#slider-range2" ).slider( "values", 1 ) );
    $("#slider-range2 > span").addClass("glyphicon glyphicon-book");
} );

$( function() {
    $( "#slider-range3" ).slider({
        range: true,
        min: 0,
        max: 36,
        values: [ 0, 36 ],
        slide: function( event, ui ) {
            $( "#amount3" ).val(ui.values[ 0 ] + "-" + ui.values[ 1 ] );
        },
        change: function() {
            updateMap();
        }
    });
    $( "#amount3" ).val( $( "#slider-range3" ).slider( "values", 0 ) +
        " - " + $( "#slider-range3" ).slider( "values", 1 ) );
    $("#slider-range3 > span").addClass("glyphicon glyphicon-book");
} );

$( function() {
    $( "#slider-range4" ).slider({
        range: true,
        min: 0,
        max: 100,
        values: [ 0, 100 ],
        slide: function( event, ui ) {
            $( "#amount4" ).val( ui.values[ 0 ] + "% - " + ui.values[ 1 ] +"%" );
        },
        change: function() {
            updateMap();
        }
    });
    $( "#amount4" ).val($( "#slider-range4" ).slider( "values", 0 ) +
        "% - " + $( "#slider-range4" ).slider( "values", 1 ) +"%" );
    $("#slider-range4 > span").addClass("glyphicon glyphicon-education") ;
} );



// Use the Queue.js library to read two files
queue()
    .defer(d3.json, "data/us-states.json")
    .defer(d3.csv, "data/Collegedata.csv")
    .await(function(error, states, college) {

        // --> PROCESS DATA
        college.forEach(function (d) {
            d.LATITUDE = +d.LATITUDE;
            d.LONGITUDE = +d.LONGITUDE;
            d.ADM_RATE = +d.ADM_RATE;
            d.COST = +d.COST;
            d.SAT_AVG_ALL = +d.SAT_AVG_ALL;
            d.ACTCMMID = +d.ACTCMMID;
            d.C100_41 = +d.C100_41;
        });


        college =  college.filter(function(d){
            return projection([d.LONGITUDE, d.LATITUDE]) != null &
                d.SAT_AVG_ALL != null & d.ACTCMMID !=null;
        });

        college_data = college;


        //Set up tooltip
        var tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        countries.selectAll("path")
            .data(states.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("class", "countries")
            .attr("stroke", "white")
            .on("click", clicked);

        //zooming function
        function clicked(d) {
            var x, y, k;
            if (d && centered !== d) {
                var centroid = path.centroid(d);
                x = centroid[0];
                y = centroid[1];
                k = 4;
                centered = d;
            } else {
                x = width / 2;
                y = height / 2;
                k = 1;
                centered = null;
            }

            countries.selectAll("path")
                .classed("active", centered && function (d) {
                        return d === centered;
                    });

            countries.transition()
                .duration(750)
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
                .style("stroke-width", 1.5 / k + "px");
        }



        filtered_data = college;

        var circle = countries.selectAll("circle")
            .data(college);



        // Enter (initialize the newly added elements)
        circle.enter().append("circle")
            .attr("class", "dot")
            .attr("fill", "#707086")
            .on("mouseover", function (d) {
                tooltip.transition()
                    .duration(300)
                    .style("opacity", 1)
                    .style("position", "absolute")
                    .style("border", "1px solid gray")
                    .style("background-color", "white")
                    .style("overflow", "hidden")
                    .style("z-index", "5");


        // Update (set the dynamic properties of the elements)
        circle
            .attr("r", 1)
            .attr("transform", function(d) {
                //console.log(d);
                return "translate(" + projection([d.LONGITUDE, d.LATITUDE]) + ")";
            })
            .attr("fill", "blue");

            // render tooltip
            tooltip.html(
                d.INSTNM + "<br />" +
                "Tuition: $" + d.COST + "<br />" +
                "Average SAT: " + d.SAT_AVG_ALL + "<br />" +
                "Average ACT: " + d.ACTCMMID + "<br />" +
                "Admission Rate: " + Math.round(d.ADM_RATE_ALL * 10000)/100 + "%" + "<br />"+
                "Admission Site: " + '<a href= "'+ "http://" +d.INSTURL +'" target="_blank">'+ d.INSTURL+
                "</a>"
            )


                .style("left", (d3.event.pageX + 5) + "px")
                .style("top", (d3.event.pageY - 55) + "px")
                .style("font-size", "11px")
                .style("padding", "3px");

            d3.select(this)
                .style("cursor", "pointer");

        })
            .on("mouseout", function (d) {
                tooltip.transition()
                    .duration(7000)
                    .style("opacity", 0);

                 d3.select(this)
                     .style("cursor", "normal");

             })

        // Exit
        circle.exit().remove();

        // Update bubble map
        updateMap();
        displayCollegeList();

    });

function returnInt(element){
    return parseInt(element,10);
}

function updateMap() {

    var tuition_range = d3.select("#amount1")[0][0].value.replace(/ /g,"").replace(/\$/g,"").split("-").map(returnInt);

    var SAT_range = d3.select("#amount2")[0][0].value.replace(/ /g,"").split("-").map(returnInt);

    var ACT_range = d3.select("#amount3")[0][0].value.replace(/ /g,"").split("-").map(returnInt);

    var graduation_range = d3.select("#amount4")[0][0].value.replace(/\%/g,"").split("-").map(returnInt);

    filtered_data = college_data.filter(function(college){
        return college.COST < tuition_range[1] & college.COST > tuition_range[0] &
            college.SAT_AVG_ALL < SAT_range[1] & college.SAT_AVG_ALL > SAT_range[0] &
            college.ACTCMMID < ACT_range[1] & college.ACTCMMID > ACT_range[0] &
            college.C100_41 < graduation_range[1] & college.C100_41 > graduation_range[0];

    });


    var circle = countries.selectAll("circle")
        .data(filtered_data);

    circle.enter()
        .append('circle');


    // Update (set the dynamic properties of the elements)
    circle
        .attr("r", 1)
        .attr("transform", function(d) {
            return "translate(" + projection([d.LONGITUDE, d.LATITUDE]) + ")";
        })
        .attr("fill", "blue");


    // Exit
    circle.exit().remove();


    //update histogram

    var tooltip1 = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var selectBox = document.getElementById("ranking-type");
    var yValue = selectBox.options[selectBox.selectedIndex].value;

    var formatCount = d3_v4.format(",.0f");
    var tuition = [];


    filtered_data.forEach(function(college)
    {
        var x = college[yValue];
        tuition.push(x);

    });

    data = tuition;




    x
        .domain([d3.min(data), d3.max(data)]);

    var bins = d3_v4.histogram()
        .domain(x.domain())
        .thresholds(x.ticks(10))
        (data);

    y
        .domain([0, d3.max(bins, function(d) { return d.length; })]);


    // var rect = svg.selectAll("rect").remove();
    var rect = svg.selectAll("rect").data(bins);

// Enter (initialize the newly added elements)

    // Exit
    rect.exit().remove();

    rect.enter().append("rect")
        .attr("x", function(d) {
            return 1;
        })
        .attr("transform", function(d) {
            return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width", (x(bins[0].x1) - x(bins[0].x0)) / 1.25)
        .attr("height", function(d) { return height - y(d.length); })
        .attr("class", "bar")
        .attr("fill", "blue")
        .on("click", function(d){
            console.log(d.x0, d.x1, yValue);
            displayCollege(d.x0, d.x1, "COST")
        })
      ;

    rect.transition()
        .attr("x", function(d) {
            console.log(d.x0);
            return 1;
        })
        .attr("transform", function(d) {
            return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width", (x(bins[0].x1) - x(bins[0].x0)) / 1.25)
        .attr("height", function(d) { return height - y(d.length); });

    rect
        .on("click", function(d){
            console.log(d.x0, d.x1, yValue);
            displayCollege(d.x0, d.x1, yValue)
        });

        // rect.append("text")
        //     .attr("dy", ".75em")
        //     .attr("y", -y(d.length) - 10)
        //     .attr("x", (x(bins[0].x1) - x(bins[0].x0)) / 2)
        //     .attr("text-anchor", "middle")
        //     .text(function(d) { return formatCount(d.length); });


    var text = svg.selectAll(".count").data(bins);

// Enter (initialize the newly added elements)

    // Exit
    text.exit().remove();

    text.enter().append("text")
        .attr("class", "count")
        .attr("x", function(d) {
            return 1;
        })
        .attr("transform", function(d) {
            return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("x", (x(bins[0].x1) - x(bins[0].x0))/ 2.5)
        .attr("text-anchor", "center")
        .text(function(d) {
            return formatCount(d.length); })
        .attr("text-anchor", "middle");


    text.transition()
        .attr("x", (x(bins[0].x1) - x(bins[0].x0))/2.5)
        .attr("transform", function(d) {
            return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .text(function(d) {
            return formatCount(d.length); })
        .attr("text-anchor", "middle");
    text.exit().remove();

    svg.select(".x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3_v4.axisBottom(x));

    display_data = filtered_data.sort(function(a, b){
        return a[yValue] - b[yValue];
    });


    displayCollegeList();
}

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip({
        placement : 'top'
    });
});

//displaying a list of colleges
function displayCollege(x0, x1, yValue) {

    display_data = filtered_data.filter(function(d){
        return d[yValue] >= x0 & d[yValue] <= x1;
    });
    console.log(display_data);

    display_data = display_data.sort(function(a,b) {
        return a[yValue] - b[yValue];
    });

    // printout = "";
    // display_data.forEach(function (d){
    //     printout+= "<h2>" + d.INSTNM + "</h2>";
    // })
    // console.log(display_data);
    printout = "<table>";
    var sym1 ="";
    var sym2 ="";

    if(yValue == "COST"){
        sym1 = " $";
        sym2 ="";
    }
    else if (yValue == "C100_41") {
        sym1 = "";
        sym2 ="% ";
    }
    else{
        sym1 ="";
        sym2 ="";
    }

    display_data.forEach(function(d, i){
        printout+= "<tr><td>" +  +(i+1) +". "+ d.INSTNM +"<br>"+ sym1 + d[yValue] + sym2 + "</td></tr>";

    });

    printout += "</table>";


    document.getElementById("college_list").innerHTML = printout;
    console.log("Display college ran")
}

function displayCollegeList(){ 
    //sort lists  

      //filtered from lowest to highest 

n = 5;

cost_list = filtered_data.sort(function(a, b){ 
     return a.COST - b.COST; 
});

var cost_ranks = cost_list.map(function(obj, i){
    var rObj = {};
    rObj["name"] = obj.INSTNM;
    rObj["rank"] = i;
    return rObj;
});



cost_5 = cost_list.slice(0, n);

var schoolsByCost = "<center><h4>Ranked by Tuition <br>(low to high)</h4><table>";

cost_5.forEach(function(d, i){
    schoolsByCost += "<tr><td>" +  +(i+1) +". "+ d.INSTNM +"<br>"+ "$" + d.COST + "</td></tr>";
});
 
// console.log(cost_list); 
 
//filtered from lowest to highest 
SAT_list = filtered_data.sort(function(a, b){ 
    return a.SAT_AVG_ALL - b.SAT_AVG_ALL; 
});

var SAT_ranks = SAT_list.map(function(obj, i){
    var rObj = {};
    rObj["name"] = obj.INSTNM;
    rObj["rank"] = i;
    return rObj;
});

SAT_5 = SAT_list.slice(0,5);

var schoolsBySAT = "<center><h4>Ranked by SAT Scores <br>(low to high)</h4><table>"; 


SAT_5.forEach(function(d,i){ 
    schoolsBySAT += "<tr><td>" +  +(i+1) +". "+ d.INSTNM +"<br>" + d.SAT_AVG_ALL + "</td></tr>"; 
}); 


ACT_list = filtered_data.sort(function(a, b){
    return a.ACTCMMID - b.ACTCMMID;
});

    var ACT_ranks = ACT_list.map(function(obj, i){
        var rObj = {};
        rObj["name"] = obj.INSTNM;
        rObj["rank"] = i;
        rObj["site"] = obj.INSTURL;
        return rObj;
    });


ACT_5 = ACT_list.slice(0,n);
var schoolsByACT = "<center><h4>Ranked by ACT Scores <br>(low to high)</h4><table>";

ACT_5.forEach(function(d,i){
   schoolsByACT += "<tr><td>" +  +(i+1) +". "+ d.INSTNM +"<br>" + d.ACTCMMID + "</td></tr>";
});

    Grad_list = filtered_data.sort(function(a, b){
        return b.C100_41 - a.C100_41;
    });

    var Grad_ranks = Grad_list.map(function(obj, i){
        var rObj = {};
        rObj["name"] = obj.INSTNM;
        rObj["rank"] = i;
        return rObj;
    });


    Grad_5 = Grad_list.slice(0,n);
    var schoolsByGrad = "<center><h4>Ranked by Graduation Rate <br>(high to low)</h4><table>";

    Grad_5.forEach(function(d,i){
        schoolsByGrad += "<tr><td>" +  +(i+1) +". "+ d.INSTNM +"<br>" + d.C100_41 + "</td></tr>";
    });



    schoolsBySAT += "</table></center>";
    schoolsByCost += "</table></center>";
    schoolsByACT += "</table></center>";
    schoolsByGrad += "</table></center>";






 document.getElementById("top5-cost").innerHTML = schoolsByCost;
 document.getElementById("top5-SAT").innerHTML = schoolsBySAT;
    document.getElementById("top5-ACT").innerHTML = schoolsByACT;
    document.getElementById("top5-Grad").innerHTML = schoolsByGrad;

    var school_list = []

         filtered_data.forEach(function(d){
             school_list.push(d.INSTNM);
         });



    var ranks = ACT_ranks.map(function(obj, i){
        var rObj = {};

        var result = $.grep(cost_ranks, function(e){ return e.name == obj.name; });
        var result1 = $.grep(SAT_ranks, function(e){ return e.name == obj.name; });
        var result2 = $.grep(Grad_ranks, function(e){ return e.name == obj.name; });

        rObj["name"] = obj.name;

        rObj["rank"] = i+ result[0].rank + result1[0].rank + result2[0].rank;
        rObj["site"] = obj.site;
        return rObj;
    });

    ranks = ranks.sort(function(a,b) {
        return a.rank - b.rank;
    });

    console.log(ranks);
    var ranks_10 = ranks.slice(0,10)
    var top_10_schools = "<center><h3>Our Top 10 Ranked Schools for You Based on our Algorithm</h3><table>";


    ranks_10.forEach(function(d,i){
        top_10_schools+= "<tr><td><h4>" +  +(i+1) +". "+ '<a href= "'+ "http://" +  d.site +'" target="_blank">'+
            d.name + "</a></h4></td></tr>";
    });


    top_10_schools += "</table></center>";

    document.getElementById("top10-schools").innerHTML = top_10_schools;

}