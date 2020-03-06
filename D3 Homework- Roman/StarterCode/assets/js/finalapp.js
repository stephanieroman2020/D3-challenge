
var svgWidth = window.innerWidth;
var svgHeight = window.innerHeight;

var margin = {
	top: 60,
	right: 40,
	bottom: 100,
	left: 100
};

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

var svg = d3
	.select('.chart')
	.append("svg")
	.attr("width", svgWidth)
	.attr("height", svgHeight)
	.append("g")


	var chart = svg.append("g")
	.attr("transform", `translate(${margin.left}, ${margin.top})`);

  d3.select("body")
	 .append("div")
	 .attr("class", "tooltip")
	 .style("opacity", 1)


  d3.csv("../data/data.csv", function(error, healthData) {
	if (error) throw error;


  healthData.forEach(function(data) {
	  data.poverty = +data.poverty;
	  data.healthcare = +data.healthcare;
  });


	var x = d3.scaleLinear().range([0, chartWidth]);
	var y = d3.scaleLinear().range([chartHeight, 0]);

	var bottomAxis = d3.axisBottom(x);
	var leftAxis = d3.axisLeft(y);


	x.domain([0,d3.max(healthData, function(data){
		return +data.poverty;
	})]);

	y.domain([0,d3.max(healthData, function(data){
		return +data.healthcare;
	})]);


	var toolTip = d3.tip()
		.attr("class", "toolTip")
		.offset([80,-60])
		.html(function(data){
			var state = data.state;
			var povertyRate = +data.poverty;
			var healthcare = +data.healthcare;
			return(state + "<br> Poverty Rate (%): " + povertyRate + "<br> Health Rate (%): " + healthcare)
		});

	chart.call(toolTip);


	chart.selectAll("circle")
		.data(healthData)
		.enter().append("circle")
			.attr("cx", function(data, index){
				console.log(data.poverty);
				return x(data.poverty);
			})
			.attr("cy", function(data, index){
				console.log(data.healthcare);
				return y(data.healthcare);
			})
			.attr('r', "10")
			.attr("fill", "blue")
			.style("opacity", 0.5)
			.on("click", function(data){
				toolTip.show(data);
			});


	chart.append("g")
		.attr("transform", `translate(0, ${chartHeight})`)
		.call(bottomAxis);


	chart.append('g')
		.call(leftAxis);

	chart.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 0 - margin.left + 40)
		.attr("x", 0 - (chartHeight))
		.attr("dy", "1em")
		.attr("class", "axisText")
		.style("text-anchor", "margintop")
		.text("Population in Fair or Poor Health (%)")


	chart.append("text")
		.attr("transform", "translate(" + (chartWidth/2) + ", " + (chartHeight + margin.top + 20) + ")")
		.attr("class", "axisText")
		.style("text-anchor", "middle")
		.text("Population Below the Poverty Line (%)");


 	chart.append("text")
		.style("text-anchor", "center")
		.attr("class", "axisText")
		.text("Correlation of Health vs. Poverty in USA");
})