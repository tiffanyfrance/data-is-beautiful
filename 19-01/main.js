/** Data is Beautiful 01/2019
 ** Design and code by Tiffany France
**/

let margin = {top: 0, right: 20, bottom: 0, left: 20},
    width = 1440 - margin.left - margin.right,
    halfHeight = 440 - margin.top - margin.bottom,
    height = 2 * halfHeight;

let tooltip = d3.select('#tooltip');

let parseTime = d3.timeParse('%m/%d/%Y');

let x = d3.scaleTime().range([0, width]);

let svg = d3.select('.container')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform',`translate(${margin.left},${margin.top})`);


d3.csv('data.csv', (data) => {
  console.log(data);

  for (let d of data) {
    d.born = parseTime(d['Born']);
    d.died = parseTime(d['Died']);
    d.daysAlive = (+d['Years'] * 365) + (+d['Days']);
  }

  x.domain([d3.min(data, (d) => d.born), parseTime('12/31/2018')]);

  const youngest = d3.min(data, (d) => d.daysAlive);
  const oldest = d3.max(data, (d) => d.daysAlive);

  for (let d of data) {
    let x1 = x(d.born),
        x2 = x(d.died),
        percent = 1 - ((d.daysAlive - youngest) / (oldest - youngest)),
        topY = (halfHeight / 3) + (1.3 * percent) * (halfHeight / 3),
        bottomY = halfHeight - 5;

    if(d['Sex'] === 'M') {
      topY = height - topY + 15;
      bottomY += 25;
    }

    d.points = [
      [x1, bottomY],
      [(x1 + ((x2 - x1) * 0.25)), topY],
      [(x1 + ((x2 - x1) * 0.75)), topY],
      [x2, bottomY]
    ];
  }

  svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0,' + halfHeight + ')')
    .call(d3.axisBottom(x)
      .ticks(50)
      .tickFormat(d3.timeFormat('%Y'))
      .tickSizeOuter(0))
    .selectAll('text')  
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em');

  svg.append('text')
    .text('6 Males')
    .attr('x', width/2)
    .attr('y', height - 130)
    .style('font-size', 14)
    .attr('text-anchor', 'middle');

  svg.append('text')
    .text('58 Females')
    .attr('x', width/2)
    .attr('y', 60)
    .style('font-size', 14)
    .attr('text-anchor', 'middle');

  svg.append('text')
    .text('Oldest Record: Jeanne Calment (122 years & 164 days)')
    .attr('x', width/2)
    .attr('y', 80)
    .style('font-size', 14)
    .attr('text-anchor', 'middle');

  svg.append('text')
    .text('Oldest Record: Jiroemon Kimura (116 years & 54 days)')
    .attr('x', width/2)
    .attr('y', height - 110)
    .style('font-size', 14)
    .attr('text-anchor', 'middle');

  let lineGenerator = d3.line()
    .curve(d3.curveBasis);

  let g = svg.selectAll('.line')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'person');

  let activePath = null;

  g.append('path')
    .attr('d', (d) => lineGenerator(d.points))
    .attr('class', 'line')
    .attr('stroke', (d) => '#555')
    .attr('stroke', (d) => (d['Sex'] === 'F') ? '#e1b74c' : 'teal')
    // .attr('stroke', (d) => {
    //   if (d['Deathplace'] === 'USA') {
    //     return '#de2d26';
    //   } else if (d['Deathplace'] === 'UK') {
    //     return 'cyan';
    //   } else if (d['Deathplace'] === 'Japan') {
    //     return 'magenta';
    //   } else if (d['Deathplace'] === 'France') {
    //     return 'yellow';
    //   } else {
    //     return 'green';
    //   }
    // })
    .attr('stroke-width', 2.5)
    .style('opacity', '0.25')
    .on('mouseover', function(d) {
      activePath = d;

      $('.line').css('opacity', 0.25);
      // $('.line').attr('stroke', '#555');

      let color = 'green';

      if (d['Deathplace'] === 'USA') {
          color = '#de2d26';
      } else if (d['Deathplace'] === 'UK') {
        color = 'cyan';
      } else if (d['Deathplace'] === 'Japan') {
        color = 'magenta';
      } else if (d['Deathplace'] === 'France') {
        color = 'yellow';
      }

      let race = 'White';

      if (d.Race === 'B') 
        race = 'Black'
      if (d.Race === 'EA') 
        race = 'East Asian'
      if (d.Race === 'M') 
        race = 'Multiracial'
      if (d.Race === 'H') 
        race = 'Hispanic'

      $(this).css('opacity', 0.7);
      $(this).attr('stroke', color);

      tooltip
        .style('left', (d3.event.pageX + 10) + 'px')
        .style('top', (d3.event.pageY + 10) + 'px');

      tooltip
        .select('#name')
        .text(d.Name);

      tooltip
        .select('#country')
        .style('background-color', color)

      tooltip
        .select('#deathplace')
        .text(d.Deathplace);

      tooltip
        .select('#born')
        .text(d.Born);
        
      tooltip.select('#died')
        .text(d.Died);

      tooltip.select('#years')
        .text(d.Years)

      tooltip.select('#days')
        .text(d.Days)

      tooltip.select('#race')
        .text(race)

      tooltip
        .interrupt()
        .transition()
        .duration(500)
        .style('display', 'block')
        .style('opacity', 1);
    })
    .on('mouseout', function(d) {
      if(activePath === d) {
        activePath = null;
        $('.line').css('opacity', 0.25);
        $('.line').attr('stroke', '#555');
        d3.selectAll('.line').attr('stroke', (d) => (d['Sex'] === 'F') ? '#e1b74c' : 'teal')
      }

      tooltip
        .interrupt()
        .transition()
        .duration(200)
        .style('opacity', 0)
        .style('display', 'none');
    });
    
  // g.append('circle')
  //   .attr('class', 'start-circle')
  //   .attr('cx', (d) => d.points[0][0])
  //   .attr('cy', (d) => d['Sex'] === 'F' ? halfHeight - 5 : halfHeight + 20)
  //   .attr('r', 3)
  //   .attr('fill', 'none')
  //   .attr('fill', (d) => {
  //     if (d['Deathplace'] === 'USA') {
  //       return '#de2d26';
  //     } else if (d['Deathplace'] === 'UK') {
  //       return 'cyan';
  //     } else if (d['Deathplace'] === 'Japan') {
  //       return 'magenta';
  //     } else if (d['Deathplace'] === 'France') {
  //       return 'yellow';
  //     } else {
  //       return 'green'
  //     }
  //   });

  // g.append('circle')
  //   .attr('class', 'end-circle')
  //   .attr('cx', (d) => d.points[3][0])
  //   .attr('cy', (d) => d['Sex'] === 'F' ? halfHeight - 5 : halfHeight + 20)
  //   .attr('r', 3)
  //   .attr('fill', 'none')
  //   .attr('fill', (d) => {
  //     if (d['Deathplace'] === 'USA') {
  //       return '#de2d26';
  //     } else if (d['Deathplace'] === 'UK') {
  //       return 'cyan';
  //     } else if (d['Deathplace'] === 'Japan') {
  //       return 'magenta';
  //     } else if (d['Deathplace'] === 'France') {
  //       return 'yellow';
  //     } else {
  //       return 'green'
  //     }
  //   });

  g.append('circle')
    .attr('class', 'start-circle')
    .attr('cx', (d) => d.points[0][0])
    .attr('cy', (d) => d['Sex'] === 'F' ? halfHeight - 5 : halfHeight + 20)
    .attr('r', 3)
    .attr('fill', 'none')
    .attr('fill', (d) => {
      if (d['Deathplace'] === 'USA') {
        return '#de2d26';
      } else if (d['Deathplace'] === 'UK') {
        return 'cyan';
      } else if (d['Deathplace'] === 'Japan') {
        return 'magenta';
      } else if (d['Deathplace'] === 'France') {
        return 'yellow';
      } else {
        return 'green';
      }
    })
    .attr('opacity', 0.6)
    .on('mouseover', function(d) {
      activePath = d;

      $('.line').css('opacity', 0.25);
      // $('.line').attr('stroke', '#555');

      let color = 'green';

      if (d['Deathplace'] === 'USA') {
          color = '#de2d26';
      } else if (d['Deathplace'] === 'UK') {
        color = 'cyan';
      } else if (d['Deathplace'] === 'Japan') {
        color = 'magenta';
      } else if (d['Deathplace'] === 'France') {
        color = 'yellow';
      }

      let race = 'White';

      if (d.Race === 'B') 
        race = 'Black'
      if (d.Race === 'EA') 
        race = 'East Asian'
      if (d.Race === 'M') 
        race = 'Multiracial'
      if (d.Race === 'H') 
        race = 'Hispanic'

      $(this).siblings('.line').css('opacity', 0.7);
      $(this).siblings('.line').attr('stroke', color);

      tooltip
        .style('left', (d3.event.pageX + 10) + 'px')
        .style('top', (d3.event.pageY + 10) + 'px');

      tooltip
        .select('#name')
        .text(d.Name);

      tooltip
        .select('#country')
        .style('background-color', color)

      tooltip
        .select('#deathplace')
        .text(d.Deathplace);

      tooltip
        .select('#born')
        .text(d.Born);
        
      tooltip.select('#died')
        .text(d.Died);

      tooltip.select('#years')
        .text(d.Years)

      tooltip.select('#days')
        .text(d.Days)

      tooltip.select('#race')
        .text(race)

      tooltip
        .interrupt()
        .transition()
        .duration(500)
        .style('display', 'block')
        .style('opacity', 1);
    })
    .on('mouseout', function(d) {
      if(activePath === d) {
        activePath = null;
        $('.line').css('opacity', 0.25);
        $('.line').attr('stroke', '#555');
        d3.selectAll('.line').attr('stroke', (d) => (d['Sex'] === 'F') ? '#e1b74c' : 'teal')
      }

      tooltip
        .interrupt()
        .transition()
        .duration(200)
        .style('opacity', 0)
        .style('display', 'none');
    });

  g.append('circle')
    .attr('class', 'end-circle')
    .attr('cx', (d) => d.points[3][0])
    .attr('cy', (d) => d['Sex'] === 'F' ? halfHeight - 5 : halfHeight + 20)
    .attr('r', 3)
    .attr('fill', 'none')
    .attr('fill', (d) => {
      if (d['Deathplace'] === 'USA') {
        return '#de2d26';
      } else if (d['Deathplace'] === 'UK') {
        return 'cyan';
      } else if (d['Deathplace'] === 'Japan') {
        return 'magenta';
      } else if (d['Deathplace'] === 'France') {
        return 'yellow';
      } else {
        return 'green';
      }
    })
    .attr('opacity', 0.6)
    .on('mouseover', function(d) {
      activePath = d;

      $('.line').css('opacity', 0.25);
      // $('.line').attr('stroke', '#555');

      let color = 'green';

      if (d['Deathplace'] === 'USA') {
          color = '#de2d26';
      } else if (d['Deathplace'] === 'UK') {
        color = 'cyan';
      } else if (d['Deathplace'] === 'Japan') {
        color = 'magenta';
      } else if (d['Deathplace'] === 'France') {
        color = 'yellow';
      }

      let race = 'White';

      if (d.Race === 'B') 
        race = 'Black'
      if (d.Race === 'EA') 
        race = 'East Asian'
      if (d.Race === 'M') 
        race = 'Multiracial'
      if (d.Race === 'H') 
        race = 'Hispanic'

      $(this).siblings('.line').css('opacity', 0.7);
      $(this).siblings('.line').attr('stroke', color);

      tooltip
        .style('left', (d3.event.pageX + 10) + 'px')
        .style('top', (d3.event.pageY + 10) + 'px');

      tooltip
        .select('#name')
        .text(d.Name);

      tooltip
        .select('#country')
        .style('background-color', color)

      tooltip
        .select('#deathplace')
        .text(d.Deathplace);

      tooltip
        .select('#born')
        .text(d.Born);
        
      tooltip.select('#died')
        .text(d.Died);

      tooltip.select('#years')
        .text(d.Years)

      tooltip.select('#days')
        .text(d.Days)

      tooltip.select('#race')
        .text(race)

      tooltip
        .interrupt()
        .transition()
        .duration(500)
        .style('display', 'block')
        .style('opacity', 1);
    })
    .on('mouseout', function(d) {
      if(activePath === d) {
        activePath = null;
        $('.line').css('opacity', 0.25);
        $('.line').attr('stroke', '#555');
        d3.selectAll('.line').attr('stroke', (d) => (d['Sex'] === 'F') ? '#e1b74c' : 'teal')
      }

      tooltip
        .interrupt()
        .transition()
        .duration(200)
        .style('opacity', 0)
        .style('display', 'none');
    });

});

$('svg').on('click', function(d) {
  $('.line').css('opacity', 0.25);
  // $('.line').attr('stroke', '#555')
});