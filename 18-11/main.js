/* Astronauts in Space
 * Author: Tiffany France
 *
*/

// $(document).ready(function() {
//   let hint = `<div style="font-family: 'roboto',sans-serif;font-size: 11px;position: relative;left: -50%;
//     top: 340px;color: #fff;">
//     hover circles of burst for specific astronaut data</div>`;

//   $('.burst-text').append(hint).fadeIn(2000);

// });

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

let tooltip = d3.select('#tooltip');

let totalHours = 0;

var selectedGroup = null;

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

d3.csv('nasa.csv', function(d, i, columns) {
  return {
    hours: +d['Cumulative hours of space flight time'],
    group: (+d[' Group'] - 1),
    name: d['Astronaut'],
    year: d['Selection Year'],
    status: d['Status'],
    gender: d['Gender'],
    dob: d['Date of birth'],
    missions: d['Missions flown'],
  }
}, function(error, data) {
  var yearCount = [];

  let years = [...new Set(data.map(data => data.year))];

  let sumAstronuats = 0;
  let totalAstronauts = data.length;
  
  for (var i = 0; i < years.length; i++) {
    var count = 0;
    var hours = 0;
    
    for (var j = 0; j < data.length; j++) { 
        if(data[j].year === years[i]) {
          count++;
          hours += data[j].hours;
          totalHours += data[j].hours;
        }
    }

    yearCount.push({
      year: +years[i],
      count: count,
      color: colors[i],
      hours: hours,
      angle: ((sumAstronuats + (count / 2)) / totalAstronauts) * 2 * Math.PI
    });

    sumAstronuats += count;
  }

  $('#flightTime').html(totalHours.toLocaleString() + ' hrs');

  buildBurst(data, yearCount);
  
  buildBar(yearCount, years);

  buildRank(data, yearCount);

});


function buildRank(data, yearCount) {

  let sortedData = data.sort(function(a, b) {
    return b.hours - a.hours;
  });

  let topResults = sortedData.slice(0, 6);

  for (var i = 0; i < topResults.length; i++) {

    var elem = $('#a-' + i),
      t = topResults[i],
      w = ((t.hours / topResults[0].hours) * 100) * 0.8,
      c = yearCount[t.group].color;

      $(elem).find('.hours').text(t.hours.toLocaleString());
      $(elem).find('.num-bar').css('width', w + '%');
      $(elem).find('.num-bar').css('background', c);
      $(elem).find('.name').text(t.name);
      $(elem).find('.year').text(t.year);
      $(elem).find('.group').text(t.group);
      $(elem).find('.status').text(t.status);
      $(elem).find('.gender').text(t.gender);
      $(elem).find('.dob').text(t.dob);
      $(elem).find('.missions').text(t.missions);
  }

}


function buildBurst(data, yearCount) {

  let svg = d3.select('#burst svg'),
    width = +svg.attr('width'),
    height = +svg.attr('height')
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
    .attr('fill', 'none')
    .attr('stroke', 'none')
    .attr('r', baseRadius);

  let dataCircles = base.append('g')
    .attr('class', 'data-circles');

  let astronaut = dataCircles.selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .attr('class', (d) => `group group-${d.year}`);

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
        .style('left', (d3.event.pageX + 10) + 'px')
        .style('top', (d3.event.pageY + 10) + 'px');

      tooltip
        .select('#group')
        .text('#' + (d.group + 1) + ' - ' + d.year);

      tooltip
        .select('#hours')
        .text(d.hours);
        
      tooltip.select('#name')
        .text(d.name);

      tooltip.select('#status')
        .text(d.status)

      tooltip
        .transition()
        .duration(500)
        .style('opacity', 1);
    })
    .on('mouseout', function(d) {
      tooltip
        .transition()
        .duration(500)
        .style('opacity', 0);
    });

  const labelRadius = baseRadius * 0.94;

  let groupLabels = base.append('g')
    .attr('class', 'group-labels');

  groupLabels.selectAll('g')
    .data(yearCount)
    .enter()
    .append('text')
    .text((d) => d.year)
    .attr('text-anchor', 'middle')
    .attr('transform', function(d) {
      let angle = startAngle + d.angle;
      let x = Math.cos(angle) * labelRadius;
      let y = Math.sin(angle) * labelRadius;
      let rotate = (angle * (180 / Math.PI)) + 90;
      return `translate(${x},${y})rotate(${rotate})`;
    })
    .attr('fill', '#ccc')
    .style('font-size', '12px')
    .attr('class', (d) => `group group-${d.year}`);
}

function buildBar(data, years) {
  var margin = {top: 100, right: 35, bottom: 60, left: 33},
      width = 260 - margin.left - margin.right,
      height = 920 - margin.top - margin.bottom;

  var y = d3.scaleBand()
            .range([0, height])
            .padding(0.35);
  var x = d3.scaleLinear()
            .range([0, width]);
            
  var svg = d3.select('#bar svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    .append('g')
      .attr('transform', 
            'translate(' + margin.left + ',' + margin.top + ')');

    y.domain(d3.range(1958, 2011));
    x.domain([0, d3.max(data, function(d) { return d.count; })]);

    svg.selectAll('.bar')
        .data(data)
      .enter().append('rect')
        .attr('class', 'bar')
        .attr('width', function(d) {return x(d.count); } )
        .attr('y', function(d) { return y(d.year); })
        .attr('height', y.bandwidth())
        .attr('fill', (d) => d.color)
        .on('click', function(d) {
          if (selectedGroup === d) {
            selectedGroup = null;
            hideGroup(d);
          } else {
            selectedGroup = d;
            showGroup(d);
          }
          d3.event.stopPropagation();
        })
        .on('mouseover', showGroup)
        .on('mouseout', (d) => {
          hideGroup(d);

          if (selectedGroup !== null) {
            showGroup(selectedGroup);
          }
        });
        
    svg.selectAll('text')
        .data(data)
      .enter().append('text')
        .text(function(d) { return d.count;})
        .attr('y', function(d) { return y(d.year) + 8; })
        .attr('x', function(d) { return x(d.count) + 10; })
        .style('text-anchor', 'middle')
        .style('fill', 'white')
        .attr('font-size', '10px');

    svg.append('g')
        .call(d3.axisLeft(y).tickValues(years).tickSizeOuter(0));

    svg.append('text')
      .text('year')
      .attr('x',-33)
      .attr('y',-5)
      .style('font-size', '10px');

    svg.append('text')
      .text('# of astronauts selected')
      .attr('x',3)
      .attr('y',-5)
      .style('font-size', '10px');
}

function showGroup(d) {
  $('.group').hide();

  let groupClass = `.group-${d.year}`;

  $(groupClass).show();
  $('#flightTime').text(d.hours.toLocaleString() + ' hrs');
}

function hideGroup(d) {
  $('.group').show();
  $('#flightTime').text(totalHours.toLocaleString() + ' hrs');
}

$('body').click(() => {
  hideGroup(selectedGroup);
});