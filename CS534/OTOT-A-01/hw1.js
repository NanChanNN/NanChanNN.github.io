const margin = {top:80, right:250, bottom:10, left:50}
const width = 1000
const height = 600
const bounded = {
width : width - margin.left - margin.right,
height : height - margin.top - margin.bottom
}

const sub_svg_height = 250
const sub_svg_margin = {top:10, right:250, bottom:20, left:50}
const sub_svg_width = bounded.width + sub_svg_margin.left + sub_svg_margin.right
const sub_svg_bounded = {
width : sub_svg_width - sub_svg_margin.left - sub_svg_margin.right,
height : sub_svg_height - sub_svg_margin.top - sub_svg_margin.bottom
}
const y_limit = 25

var svg = d3.select("#my_viz")
.append("svg")
.attr("width", width)
.attr("height", height)

var svg_2 = d3.select("#my_viz2")
.append("svg")
.attr("width", width)
.attr("height", sub_svg_height)

var group = svg.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")")

var legend = svg.append("g")
.attr("transform", "translate(" + (margin.left + bounded.width) + "," + margin.top + ")")

var group_2 = svg_2.append("g")
.attr("transform", "translate(" + sub_svg_margin.left + "," + sub_svg_margin.top + ")")

var wrap3 = d3.textwrap()
			.bounds({height: margin.top*0.8, width: bounded.width * 1.0})
			.method('tspans');	
svg.append("text")
	.attr("x", margin.left)
	.attr("y", margin.top*0.9)
	.style("opacity", 0.8)
	.style("font-size", 22)
	.text("Visualization of Annual Revenue of Singapore Government")
	.call(wrap3)

function help()
{
	alert(project_introduction);
}

d3.csv("input_data.csv").then(dataViz)
function dataViz(data)
{	
	// Get the header of the csv files.
	var keys = data.columns.slice(1, -1)

	year_list = []
	data.forEach((d)=>year_list.push(parseInt(d.year)))
	//year_list = year_list.slice(1,-1)

	// Create the X-axis
	var xAxis = d3.scaleLinear()
	.domain(d3.extent(data, (d) => parseInt(d.year)))
	.range([0, bounded.width])
	group.append("g")
	.attr("id", "X-axis")
	.attr("transform", "translate(0" + "," + bounded.height * 0.9 + ")")
	.call(d3.axisBottom(xAxis).tickSize(-bounded.height*0.8).tickValues(year_list))
	.select(".domain").remove()
	group.selectAll(".tick line").attr("stroke", "#b8b8b8")

	// Add label for the X-axis
	group.append("text")
	.attr("id", "X-axis-label")
	.attr("text-anchor", "end")
	.attr("x", bounded.width * 1.05)
	.attr("y", bounded.height * 0.95)
	.text("Time (year)")

	// Add Y axis
	var yAxis = d3.scaleLinear()
	.domain([-80, 80])
	.range([bounded.height, 0])

	// Color palette
	var color = d3.scaleOrdinal()
	.domain(keys)
	.range(d3.schemePaired)

	// Stack the data
	var stackedData = d3.stack()
	.offset(d3.stackOffsetSilhouette)
	.keys(keys)
	(data)

	// Area generator
	var area = d3.area()
	.x(function(d) {return xAxis(d.data.year);})
	.y0(function(d) {return yAxis(d[0]);})
	.y1(function(d) {return yAxis(d[1]);})

	//Create tooltip
	group.append("text")
	.attr("id", "my_tooltip")
	.attr("x", bounded.width + margin.left * 0.3)
	.attr("y", bounded.height * 0.5 + margin.top)
	.style("opacity", 0.0)
	.style("font-size", 18)
	.text("tooltip")

	var mouseover = function(d) {
	group.select("#my_tooltip")
		.style("opacity", 1)
	d3.selectAll(".mylayers").style("opacity", .2)
	d3.select(this)
		.style("stroke", "black")
		.style("stroke-width", 3)
		.style("opacity", 1)
		}

	var mousemove = function(event, d){
		const e = selection.nodes()
		const i = e.indexOf(this);
		//console.log(i)
		group.select("#my_tooltip")
			.text(key_list[i])
			.attr("fill", color(keys[i]))
	}

	 var mouseleave = function(d) {
	group.select("#my_tooltip")
		.style("opacity", 0)
	d3.selectAll(".mylayers")
		.style("opacity", 1)
		.style("stroke", "none")
	}

	// Create the streamgraph
	var selection = group.selectAll(".mylayers")
	.data(stackedData)
	.enter()
	.append("path")
	.attr("class", "mylayers")
	.style("fill", (d) => color(d.key))
	.attr("d", area)
	selection.on("mouseover", mouseover)
	.on("mousemove", mousemove)
	.on("mouseleave", mouseleave)

	//Create legend
	const legend_size = 6
	const legend_interval = legend_size * 2.5
	legend_element = legend.selectAll(".legned")
	.data(keys)
	.enter()
	.append("g")
	.attr("class", "legend")
	legend_element.append("circle")
	.attr("cx", legend_size*1.5)
	.attr("cy", (d,i) => legend_interval*i + bounded.height*0.1)
	.attr("r", legend_size)
	.style("fill", d => color(d))
	legend_element.append("text")
	.attr("x", legend_size*2.8)
	.attr("y", (d,i) => legend_interval*i + bounded.height*0.1)
	.text((d,i)=>key_list[i])
	.style("font-size", "14px").attr("alignment-baseline","middle")

	// Create the subgraph
	// Create the X-axis for the subgraph
	group_2.append("g")
	.attr("id", "X-axis-2")
	.attr("transform", "translate(0" + "," + sub_svg_bounded.height * 1.0 + ")")
	.call(d3.axisBottom(xAxis).tickValues(year_list))
	const lambdaXScale = d => xAxis(d.year)

	// Create the Y-axes for the subgraph	
	var yAxis_2 = d3.scaleLinear()
	.domain([0, y_limit])
	.range([sub_svg_bounded.height, 0])
	var yAxis_3 = d3.scaleLinear()
	.domain([0, 0.5])
	.range([sub_svg_bounded.height, 0])
	group_2.append("g")
	.attr("id", "Y-axis-2")
	.attr("transform", "translate(0,0)")
	.call(d3.axisLeft(yAxis_2))
	//axis label
	group_2.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 0 - sub_svg_margin.left * 0.9)
		.attr("x", 0 - sub_svg_bounded.height * 0.5)
		.attr("dy", "1em")
		.style("text-anchor", "middle")
	    .text("Value ($billion)"); 

	group_2.append("g")
	.attr("id", "Y-axis-3")
	.attr("transform", "translate("+ sub_svg_bounded.width + ",0)")
	.call(d3.axisRight(yAxis_3))

	group_2.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", sub_svg_bounded.width + sub_svg_margin.left * 0.45)
		.attr("x", 0 - sub_svg_bounded.height * 0.5)
		.attr("dy", "1em")
		.style("text-anchor", "middle")
	    .text("Percentage"); 

	// Bine circle points to data
	group_2.selectAll("cricle.specificData")
	.data(data)
	.enter()
	.append("circle")
	.attr("class", "specificData")
	.attr("r", 0)

	group_2.selectAll("circle.spPercentage")
	.data(data)
	.enter()
	.append("circle")
	.attr("class", "spPercentage")

	// Create Title
	group_2.append("text")
	.attr("id", "sub_graph_title")
	.attr("x", 15)
	.attr("y", 15)
	.style("opacity", 0.0)
	.style("font-size", 17)

	// Create tooltip
	var tooltip_2 = group_2.append("text")
	.attr("id", "my_tooltip_2")
	.attr("x", 0)
	.attr("y", 0)
	.style("opacity", 0.0)
	.style("font-size", 14)
	.text("tooltip")

	// Create description backgroup
	group_2.append('rect')
			.attr("id", "description_bg")
			.attr("x", sub_svg_bounded.width+sub_svg_margin.left)
			.attr("y", sub_svg_bounded.height*0.3)
		  	.attr('width',  sub_svg_margin.right*0.8)
		  	.attr('height', sub_svg_bounded.height*0.7)
		  	.style("opacity", 0.0)
		  	.style("fill", "none")


	group_2.append("text")
	.attr("id", "my_description")
	.attr("x", sub_svg_bounded.width+sub_svg_margin.left*1.1)
	.attr("y", sub_svg_bounded.height*0.4)
	.style("opacity", 0.0)
	.style("font-size", 14)
	.text("tooltip")



	// Create sublegend
	sub_legend = group_2.append("g")
	.attr("id", "sub_legend")
	.attr("transform", "translate(" + (sub_svg_margin.left + sub_svg_bounded.width) + "," + sub_svg_margin.top + ")")
	sub_legend.append("circle")
	.attr("id", "sub_legend_circle")
	.attr("cx", 0)
	.attr("cy", 10)
	.attr("r", legend_size)
	.style("fill", "none")
	sub_legend.append("text")
	.attr("id", "sub_legend_text")
	.attr("x", legend_size*2.0)
	.attr("y", 0)
	.style("font-size", "14px").attr("alignment-baseline","middle")

	// Create path
	group_2.append("path")
	.attr("id", "specific_data_path")

	group_2.append("path")
	.attr("id", "specific_percentage")

	var mouseClick = function(event, d){
		const e = selection.nodes();
		const i = e.indexOf(this);
		var key_value = keys[i];
		var lambdaYValue = d => yAxis_2(d[key_value])
		var lambdaYValuePercentage = d => yAxis_3(parseFloat(d[key_value]) / parseFloat(d["TotalRevenue"]))

		// specific value
		// create the line generator
		var tmp_line_gen = d3.line()
			.x(lambdaXScale)
			.y(lambdaYValue)
			.curve(d3.curveCardinal)
		group_2.selectAll(".specificData")
			.attr("r", 5)
			.attr("cx", lambdaXScale)
			.attr("cy", lambdaYValue)
			.style("fill", color(key_value))
			.on("mouseover", function(event, d){
				tooltip_2.transition()
					.duration(0)
					.style("opacity", 1.0);
				tooltip_2.text(parseFloat(d[key_value]).toFixed(2))
					.attr("x", event.offsetX-sub_svg_margin.left*1.7)
				.attr("y", event.offsetY-sub_svg_margin.top*1.7)
			d3.select(this)
					.style("stroke", "black")
					.style("stroke-width", 2)

			})
			.on("mouseout", function(event) {
	        tooltip_2.transition()
	               .duration(300)
	               .style("opacity", 0);
	        d3.selectAll(".specificData")
	        	.style("stroke", "none")
	        	.style("stroke-width", 0)
	      });
		group_2.select("#sub_graph_title")
			.text(key_list[i])
			.style("opacity", 1.0)
			.style('fill', color(key_value))
		group_2.select("#specific_data_path")
			.attr("d", tmp_line_gen(data))
			.attr("fill", "none")
			.attr("stroke", color(key_value))
			.attr("stroke-width", 2)

		// specific percentage
		var tmp_line_gen_per = d3.line()
			.x(lambdaXScale)
			.y(lambdaYValuePercentage)
			.curve(d3.curveStep)
		group_2.selectAll(".spPercentage")
			.attr("r", 5)
			.attr("cx", lambdaXScale)
			.attr("cy", lambdaYValuePercentage)
			.attr("x", lambdaXScale)
			.attr("y", lambdaYValuePercentage)
			.style("fill", "grey")
			.on("mouseover", function(event, d){
				var tmp_value = parseFloat(d[key_value]) / parseFloat(d["TotalRevenue"])
				tooltip_2.transition()
					.duration(0).
					style("opacity", 1.0);
				tooltip_2.text(tmp_value.toFixed(2))
					.attr("x", event.offsetX-sub_svg_margin.left*1.7)
				.attr("y", event.offsetY-sub_svg_margin.top*1.7)
			d3.select(this)
					.style("stroke", "black")
					.style("stroke-width", 2)
			})
			.on("mouseout", function(event) {
	        tooltip_2.transition()
						.duration(300)
						.style("opacity", 0);
				d3.selectAll(".spPercentage")
	        	.style("stroke", "none")
	        	.style("stroke-width", 0)
	      });
	      	
		group_2.select("#specific_percentage")
			.attr("d", tmp_line_gen_per(data))
			.attr("fill", "none")
			.attr("stroke", "grey")
			.attr("stroke-width", 2)

		var wrap1 = d3.textwrap()
			.bounds({height: sub_svg_bounded.height, width: sub_svg_margin.right*0.6})
			.method('tspans');
		group_2.select("#sub_legend_circle")
			.style("fill", "grey")
		group_2.select("#sub_legend_text")
			.text("Percentage of " + key_list[i] + " in The Total Revenue")
			.call(wrap1)

		group_2.select("#description_bg")
			.style('opacity', 0.3)
			.style('fill', color(key_value))
		var wrap2 = d3.textwrap()
			.bounds({height: sub_svg_bounded.height*0.6, width: sub_svg_margin.right*0.75})
			.method('tspans');	
		group_2.select('#my_description')
			.style('opacity', 1)
			.text(key_description[i])
			.call(wrap2)
		}

	selection.on("click", mouseClick)
}
