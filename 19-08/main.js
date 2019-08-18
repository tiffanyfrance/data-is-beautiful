let f = d3.format(',');

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
     console.log('There\'s an error');   
  })

function buildUnits(d) {

  let unit = d3.select('#viz')
    .append('div')
    .attr('class', `col ${d.ImageName}`);
  
  let margin = { top: 0, right: 30, bottom: 0, left: 0 },
    width = 300 - margin.left - margin.right, //TODO get size on resize
    height = 175 - margin.top - margin.bottom;
  
  let svg = unit.append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g');
    // .attr('transform',
    //   'translate(' + margin.left + ',' + margin.top + ')');
  
  svg.append('foreignObject')
    .attr('x', 0)
    .attr('y', 5)
    .attr('width', 20)
    .attr('height', 20)
    .append('xhtml:div')
    .append('img')
    .attr('src', `${d.ImageName}.png`)
    .attr('height', 20)
    .attr('width', 20);
  
  svg.append('text')
    .text(d.Creature)
    .attr('x', 30)
    .attr('y', 20)
    .style('font-family', 'Georgia')
    .style('font-size', '18px');
  
  svg.append('text')
    .text(`${f(d.Mass)} lbs`)
    .attr('x', 0)
    .attr('y', 50)
    .style('font-family', '"Source Sans Pro", sans-serif')
    .style('font-size', '12px');
  
  buildHR(svg, d.BPM, d.Creature, d.Mass);

  buildLongevity(svg, d.Longevity);
}


function buildHR(svg, bpm, creature, mass) {
  let margin = { top: 60, right: 30, bottom: 0, left: 0 },
    width = 270 - margin.left - margin.right,
    height = 90 - margin.top - margin.bottom;

  let data = [
    {
      x: 0,
      y: 0.4
    }
  ];

  const halfWidth = 0.007;
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

  let x = d3.scaleTime().range([0, width]);
  let y = d3.scaleLinear().range([height, 0]);

  let valueline = d3.line()
    .x(d => x(d.x))
    .y(d => y(d.y));

  x.domain([0, 1]);
  y.domain([0, 1]);

  svg.append('path')
    .data([data])
    .attr('class', 'line')
    .attr('d', valueline)
    .attr('transform',
      'translate(' + margin.left + ',' + margin.top + ')');
  
  svg.append('text')
    .text(`${bpm} bpm`)
    .attr('x', 250)
    .attr('y', 80)
    .style('font-family', '"Source Sans Pro", sans-serif')
    .style('font-size', '12px');
}

function buildLongevity(svg, longevity) {
  let margin = { top: 60, right: 30, bottom: 0, left: 0 },
    width = 270 - margin.left - margin.right,
    height = 90 - margin.top - margin.bottom;

  let g = svg.append('g')
    .attr('class', 'longevity')
    .attr('width', width)
    .attr('height', height);
  
  let linearScale = d3.scaleLinear()
    .domain([0,80]) //largest longevity value
    .range([0, width])
  
  rect = g.append('rect')
    .attr('x', 0)
    .attr('y', 100)
    .attr('width', d => linearScale(longevity))
    .attr('height', 10)
    .attr('fill', 'red');
  
  svg.append('text')
    .text(`${longevity} years`)
    .attr('x', d => linearScale(longevity) + 10)
    .attr('y', 110)
    .style('font-family', '"Source Sans Pro", sans-serif')
    .style('font-size', '12px');
  
}