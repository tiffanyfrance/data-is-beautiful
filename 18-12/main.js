let ranges = [
  {
    min: 0,
    max: 79
  },
  {
    min: 80,
    max: 89
  },
  {
    min: 90,
    max: 99
  },
  {
    min: 100,
    max: 109
  },
  {
    min: 110,
    max: 119
  },
  {
    min: 120,
    max: 129
  },
  {
    min: 130,
    max: 200
  }
];

d3.csv('data.csv', (data) => {
  for (let d of data) {
    createCircle(+d.DAYS, d['START YEAR'],d['END YEAR']);
  }

  /* Create filters */
  for(let i = 0; i < ranges.length; i++) {
    let r = ranges[i];
    let $elem = $(`<div class="col"><label><input type="checkbox" checked><span class="checkmark"></span>${r.min}-${r.max}</label></div>`);
    $('.flex').append($elem);

    let $input = $elem.find('input');
    $input.change(() => {
      let opacity = $input.is(':checked') ? 1 : 0.125;
      d3.selectAll(`.range-${i}`).style('opacity', opacity);
    });
  }
});

function createCircle(count, syear, eyear) {
  let width = 80;
  let height = 110;
  let radius = 40;

  let center = d3.select('.container').append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('class', 'year')
    .append('g')
    .attr('class', getRangeClass(count))
    //makes 0,0 center of circle for easier math
    .attr('transform', `translate(${(width / 2)}, ${(height / 2) + 10})`);

  let deltaAngle = (2 * Math.PI) / count;

  for (let i = 0; i < count; i++) {
    let x = Math.cos(deltaAngle * i) * radius;
    let y = Math.sin(deltaAngle * i) * radius;

    center.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', x)
      .attr('y2', y)
      .attr('stroke-width', 0.25)
      .attr('stroke', '#336699');

    center.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 10)
      .attr('fill', 'rgba(255, 255, 255, 0.7)');

    center.append('text')
      .text(count)
      .attr('x', 0)
      .attr('y', 3)
      .attr('text-anchor', 'middle');

    center.append('text')
      .text(syear + ' - ' + eyear)
      .attr('x', 0)
      .attr('y', -height/2 + 3)
      .attr('text-anchor', 'middle');
  }
}

function getRangeClass(count) {
  for (let i = 0; i < ranges.length; i++) {
    let r = ranges[i];

    if(count >= r.min && count <= r.max) {
      return `range-${i}`;
    }
  }
}