

// Function to convert date objects to strings or reverse
var dateFormatter = d3.time.format("%Y-%m-%d");

//slideshow

$("#slideshow > div:gt(0)").hide();

setInterval(function() {
	$('#slideshow > div:first')
		.fadeOut(1000)
		.next()
		.fadeIn(1000)
		.end()
		.appendTo('#slideshow');
},  5500);



// schoolsByCost += "</table>"; 
// schoolsBySAT += "</table>"; 
// schoolsByACT += "</table>";  

//
// document.getElementById("top5-cost").innerHTML = schoolsByCost; 
// document.getElementById("top5-SAT").innerHTML = schoolsBySAT; 
// document.getElementById("top5-ACT").innerHTML = schoolsByACT; 


