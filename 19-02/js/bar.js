  
function barChart(data, value, selector) {
  // let svg = d3.select('#bar svg')
  //     .attr('width', width + margin.left + margin.right)
  //     .attr('height', height + margin.top + margin.bottom)
  //   .append('g')
  //     .attr('transform', 
  //           'translate(' + margin.left + ',' + margin.top + ')');

    //sort bars based on value
  data = data.sort(function (a, b) {
      return d3.ascending(a[value], b[value]);
  })
  //set up svg using margin conventions - we'll need plenty of room on the left for labels
  
console.log(data)
  var margin = {
      top: 35,
      right: 20,
      bottom: 15,
      left: 100
  };
  var width = 280 - margin.left - margin.right,
      height = 350 - margin.top - margin.bottom;

  var svg = d3.select(selector).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append('text')
    .text(value)
    .style('font-size', '12px');

  var colors = d3.scale.linear()
    .domain([0, d3.max(data, (d)=>d[value])/2, d3.max(data, (d)=>d[value])])
    .range(['#49AFFF', '#00FFC6', '#00FF4A']);
    // .domain([0, 1.5, 3])
    // .range(['yellow', 'orange', 'red']);

  var x = d3.scale.linear()
      .range([0, width])
      .domain([0, d3.max(data, function (d) {
          return d[value];
      })]);
  var y = d3.scale.ordinal()
      .rangeRoundBands([height, 0], .35)
      .domain(data.map(function (d) {
          return d.Drug;
      }));
  //make y axis to show bar Drugs
  var yAxis = d3.svg.axis()
      .scale(y)
      //no tick marks
      .tickSize(0)
      .orient("left");
  var gy = svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
  var bars = svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("g")
  //append rects
  bars.append("rect")
      .attr("class", "bar")
      .attr("y", function (d) {
          return y(d.Drug);
      })
      // .attr("height", y.rangeBand())
      .attr("height", 8)
      .attr('fill', function(d,i) {
        return colors(d[value]);
      })
      .style('opacity', 0.4)
      .attr("x", 0)
      .attr("width", function (d) {
          return x(d[value]);
      });
  //add a[value] label to the right of each bar
  bars.append("text")
      .attr("class", "label")
      //y position of the label is halfway down the bar
      .attr("y", function (d) {
          return y(d.Drug) + y.rangeBand() / 2 + 4;
      })
      //x position is 3 pixels to the right of the bar
      .attr("x", function (d) {
          return x(d[value]) + 3;
      })
      .text(function (d) {
          return d[value];
      });
}
