// @TODO: YOUR CODE HERE!
// Step 1: Set up our chart
//= ================================
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// import data
d3.csv("assets/data/data.csv", function(error, healthData) {
    if (error) throw error;

    console.log(healthData)
    // format data
    healthData.forEach(function(data){
        data.abbr = data.abbr
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    })
    
    // create scales
    var yScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d.healthcare),d3.max(healthData, d => d.healthcare)])
        // .domain([4,26])
        .range([chartHeight, 0])
    
    var xScale = d3.scaleLinear()
        // .domain([0,d3.max(healthData, d => d.poverty)])
        .domain([d3.min(healthData, d => d.poverty), d3.max(healthData, d => d.poverty)])
        .range([0, chartWidth])

    // create and append axis
    var xAxis = d3.axisBottom(xScale)
    var yAxis = d3.axisLeft(yScale)

    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(xAxis)
    
    chartGroup.append("g")
        .call(yAxis)

    //   create circles for scatter
    var circle = chartGroup.selectAll("circle")
      .data(healthData)
      .enter()
      .append("circle")
      .attr("cx", d => xScale(d.poverty))
      .attr("cy", d => yScale(d.healthcare))
      .attr("r", "10")
      .classed("stateCircle", true)
    
    // create text elements for inside scatter plot
    var text = chartGroup.selectAll("text")
      .data(healthData, d => d.abbr)
      .enter()
      .append("text")
      .attr("x", d => xScale(d.poverty))
      .attr("y", d => yScale(d.healthcare))
      .text(d => d.abbr)
      .attr("font-size", "10px")
      .classed("stateText", true)


    // y axis title
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "1em")
      .classed("aText", true)
      .text("Lack Healthcare (%)")

    // x axis title
    chartGroup.append("text")
      .attr("text-anchor", "middle")
      .text("In Poverty (%)")
      .attr("transform", `translate(${chartWidth/2}, ${chartHeight + margin.top + 20})`)
      .classed("aText", true)

      // var toolTip = d3.tip()
      //   .attr("class", "tooltip")
      //   // .offset([20, 0])
      //   .attr("font-size", "10px")
      //   // .classed("stateText", true)
      //   .html(d => d.abbr);

      // chartGroup.call(toolTip);

      // circle.on("mouseover", function(d) {
      //   toolTip.show(d, this);
      // })

        // .on("mouseout", function(d) {
        //   toolTip.show(d);
        // })
})