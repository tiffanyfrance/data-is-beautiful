

// let colors = d3.schemeCategory20;
let colors = [
  '#FF0000',
  '#FF3F00',
  '#FF8E00',
  '#FFAE00',
  '#FFDF00',
  '#C2FF00',
  '#3EFF00',
  '#00FF99',
  '#00FCFF',
  '#00B0FF',
  '#0085FF',
  '#004DFF',
  '#000BFF',
  '#6A00FF',
  '#8500FF',
  '#B700FF',
  '#F600FF',
  '#FF00CE',
  '#FF00A1',
  '#FF0065',
];

let tooltip = d3.select("#tooltip");

const circleSizes = [
  {
    hours: 250,
    radius: 3
  },
  {
    hours: 100,
    radius: 2
  },
  {
    hours: 50,
    radius: 1
  },
  {
    hours: 10,
    radius: 0.5
  },
  {
    hours: 1,
    radius: 0.5
  }
];

d3.csv("nasa.csv", function(d, i, columns) {
  return {
    hours: +d['Cumulative hours of space flight time'],
    group: (+d[' Group'] - 1),
    name: d['Astronaut'],
    year: d['Selection Year'],
  }
}, function(error, data) {
  console.log(data);


  var yearCount = [];

  var unique = [...new Set(data.map(data => data.year))];

  let years = Array.from(unique);
  
  for (var i = 0; i < years.length; i++) {
    var count = 0;
    
    for (var j = 0; j < data.length; j++) { 
        if(data[j].year === years[i]) count++;
    }

    yearCount.push({
      year: +years[i],
      count: count
    })
  }

  // svg.append('text')
  //   .text(yearCount[0].year)
  //   .attr('x', 500)
  //   .attr('y', 500)
  //   .style('fill', 'white');

  buildBurst(data);
  
  buildLine(yearCount, years);

});


function buildBurst(data) {

  let svg = d3.select("#burst svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height")
    baseRadius = 350;

  let base = svg.append('g')
    .attr('class','base-group')
    .attr('transform',`translate(${(width / 2)}, ${(height / 2) - 90})`);

  /* theta is the letter for angle in math */
  let theta = (2 * Math.PI) / data.length;
  let startAngle = -1 * Math.PI / 2;
  const distBetween = 6;

  for(let i = 0; i < data.length; i++) {
    let d = data[i];
    d.newData = [];

    let angle = startAngle + (i * theta);
    let hours = d.hours;
    let dist = baseRadius;

    if(hours === 0) {
      d.newData.push({
        angle,
        dist: dist,
        radius: 1.5,
        circleHours: 0,
        ...d
      });
    } else {
      for(let cs of circleSizes) {
        if(hours >= cs.hours) {
          let count = Math.floor(hours / cs.hours);

          for(let j = 0; j < count; j++) {
            d.newData.push({
              angle,
              dist: dist + (j * distBetween),
              radius: cs.radius,
              circleHours: cs.hours,
              ...d
            });
          }

          hours -= count * cs.hours;
          dist += count * distBetween;
        }
      }
    }
  }

  base.append('circle')
    .attr("fill", "none")
    .attr("stroke", "none")
    .attr("r", baseRadius);

  let dataCircles = base.append('g')
    .attr('class', 'data-circles');

  let astronaut = dataCircles.selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .attr('class', (d) => `group group-${d.year}`);

  // astronaut
  //   .append('text')
  //   .text((d) => d.year)
  //   .attr('fill','#fff')
  //   /* cosine * radius of base circle  */
  //   .attr('x', (d,i) => {
  //     return 10 + (20 * i);
  //   })
  //   /* sine * radius of base circle  */
  //   .attr('y', (d) => {
  //     return Math.sin(d.angle) * d.dist;
  //   });

  astronaut
    .selectAll('circle')
    .data((d) => {
      return d.newData;
    })
    .enter()
    .append('circle')
    /* cosine * radius of base circle  */
    .attr('cx', (d, i) => {
      return Math.cos(d.angle) * d.dist;
    })
    /* sine * radius of base circle  */
    .attr('cy', (d, i) => {
      return Math.sin(d.angle) * d.dist;
    })
    .attr('r', (d) => d.radius)
    .attr('fill', (d) => (d.hours > 0) ? colors[d.group] : '#333')
    .attr('stroke', (d) => colors[d.group])
    .attr('stroke-width', 1)
    .on('mouseover', function(d) {
      tooltip
        .style("left", (d3.event.pageX + 10) + "px")
        .style("top", (d3.event.pageY + 10) + "px");

      tooltip
        .select("#group")
        .text("#" + (d.group + 1) + " - " + d.year);

      tooltip
        .select("#hours")
        .text(d.hours);
        
      tooltip.select("#name")
        .text(d.name);

      tooltip
        .transition()
        .duration(500)
        .style('opacity', 1);
    })
    .on("mouseout", function(d) {
      tooltip
        .transition()
        .duration(500)
        .style('opacity', 0);
    })

}

function buildLine(data, years) {
  var margin = {top: 20, right: 20, bottom: 30, left: 20},
      width = 1460 - margin.left - margin.right,
      height = 250 - margin.top - margin.bottom;

  var x = d3.scaleBand()
            .range([0, width])
            .padding(0.1);
  var y = d3.scaleLinear()
            .range([height, 0]);
            
  var svg = d3.select("#bar svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");

    x.domain(d3.range(1958, 2011));
    y.domain([0, d3.max(data, function(d) { return d.count; })]);

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.year); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.count); })
        .attr("height", function(d) { return height - y(d.count); });
        
    svg.selectAll("text")
        .data(data)
      .enter().append('text')
        .text(function(d) { return d.count;})
        .attr("x", function(d) { return x(d.year) + 11; })
        .attr("y", function(d) { return y(d.count) + 15; })
        .style("text-anchor", "middle")
        .style("fill", "white")
        .attr('font-size', '10px');

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).tickValues(years).tickSizeOuter(0));
}
