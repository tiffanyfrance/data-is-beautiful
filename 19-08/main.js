d3.csv('data.csv')
  .then(function(data) {
    for(var i = 0; i < data.length; i++) {
      let d = data[i];

      buildUnits(d);
    }

    d3.select('#viz')
      .append('div')
      .attr('class', 'col legend');
  })
  .catch(function(error){
     // handle error   
  })


function buildChart(bpm, creature, mass) {
  let margin = { top: 0, right: 10, bottom: 0, left: 100 },
    width = 1400 - margin.left - margin.right,
    height = 50 - margin.top - margin.bottom;

  let data = [
    {
      x: 0,
      y: 0.4
    }
  ];

  const halfWidth = 0.00175;
  let count = Math.ceil(bpm / 10);
  let delta = 1 / (Math.floor(bpm / 10) + 1);

  for (let i = 0; i < count; i++) {
    let centerX = delta * (i + 1);

    data.push({
      x: centerX - (halfWidth * 2),
      y: 0.4
    });

    data.push({
      x: centerX - halfWidth,
      y: 0.6
    });

    data.push({
      x: centerX,
      y: 0.4
    });

    data.push({
      x: centerX + halfWidth,
      y: 0.8
    });

    data.push({
      x: centerX + (halfWidth * 2),
      y: 0.2
    });

    data.push({
      x: centerX + (halfWidth * 3),
      y: 0.4
    });
  }

  data.push({
    x: delta * (count + 1),
    y: 0.4
  });

  console.log(data)

  let x = d3.scaleTime().range([0, width]);
  let y = d3.scaleLinear().range([height, 0]);

  let valueline = d3.line()
    .x(d => x(d.x))
    .y(d => y(d.y));

  let svg = d3.select("#heartbeats").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");
  
  svg.append('text')
    .text(creature)
    .attr('class', 'creature')
    .attr('x', -(margin.left))
    .attr('y', (height * .7));

  x.domain([0, 1]);
  y.domain([0, 1]);

  svg.append("path")
    .data([data])
    .attr("class", "line")
    .attr("d", valueline);
    
}

function buildUnits(d) {

  let unit = d3.select('#viz')
    .append('div')
    .attr('class', 'col');
  
  let margin = { top: 0, right: 10, bottom: 0, left: 10 },
    width = 340 - margin.left - margin.right, //TODO get size on resize
    height = 175 - margin.top - margin.bottom;
  
  let svg = unit.append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");
  
  svg.append('text')
    .text(d.Creature)
    .attr('x', 0)
    .attr('y', 20)
    .style('font-family', 'Georgia')
    .style('font-size', '22px');
  
  buildChart(svg, d.BPM, d.Creature, d.Mass);


}