let width = 50 * 4;
let height = 65 * 4;
let radius = 30 * 3;
let innerRadius = 8 * 2;
let marginTop = 20;

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
    max: 161
  }
];

d3.csv('data.csv', (data) => {
  let temp = {};

  for (let d of data) {
    let days = +d.DAYS,
      syear = +d['START YEAR'],
      eyear = +d['END YEAR'];

    let key = Math.trunc(eyear / 10);

    let years = temp[key];

    if (!years) {
      years = [];
      temp[key] = years;
    }

    years.push({
      days,
      syear,
      eyear
    });
  }

  let decades = [];

  for (let key in temp) {
    let years = temp[key];
    let syear = years[0].eyear;
    let eyear = years[0].eyear;
    let count = 0;

    for (let y of years) {
      if (y.eyear < syear) {
        syear = y.eyear;
      }

      if (y.eyear > eyear) {
        eyear = y.eyear;
      }

      count += y.days;
    }

    count /= years.length;
    count = Math.round(count);
    console.log(count)

    decades.push({
      syear,
      eyear,
      count,
      years,
      radius: (count / 200) * radius
    });
  }

  console.log(decades);

  for (let decade of decades) {
    let svg = d3.select('.container').append('div').append('svg');

    svg.attr('width', width)
      .attr('height', height - marginTop);

    svg.append('text')
      .text(decade.syear + ' - ' + decade.eyear)
      .attr('x', width / 2)
      .attr('y', marginTop/1.5)
      .attr('text-anchor', 'middle');

    let nodes = [{
      radius: decade.radius,
      data: decade
    }];

    for (let y of decade.years) {
      nodes.push({
        radius: y.days * (18 / 140),
        data: y
      });
    }

    d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(2))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d) => d.radius))
      .on('tick', ticked);

    function ticked() {
      let u = svg
        .selectAll('.force-circle')
        .data(nodes);

      u.enter()
        .append('g')
        .attr('class', 'force-circle')
        .each(function (d) {
          console.log(d);
          let g = d3.select(this);

          if (d.data.years) {
            createCircle(g, decade);
          } else {
            g.append('circle')
              .attr('r', (d) => d.radius)
              .attr('fill', '#369');

              console.log(d)

            if (d.radius > 9) {
              g.append('text')
                .text(d.data.eyear)
                .attr('x', 0)
                .attr('y', 3)
                .attr('text-anchor', 'middle')
                .attr('stroke', '#eee')
                .style('font-size', 8)
                .style('font-weight', 200)
                .style('letter-spacing', 1.15)
                .attr('text-rendering', 'optimizeLegibility');
            }
          }
        })
        .merge(u)
        .attr('transform', (d) => `translate(${d.x},${d.y})`);

      u.exit().remove();
    }
  }

  // /* Create filters */
  for(let i = 0; i < ranges.length; i++) {
    let r = ranges[i];

    let $elem = $(`<button class="input-${i}" data-index="${i}">
      ${r.min}-${r.max}</button>`);

    $('#filters').append($elem);

    // let $input = $elem.find('input');

    // $input.change(() => {
    //   let opacity = $input.is(':checked') ? 1 : 0.125;
    //   d3.selectAll(`.range-${i}`).transition()
    //     .attr("duration", 300)
    //     .style('opacity', opacity);

      // selectMedian();
    // });
  }

  // selectMedian();

  addButtons();
});

function createCircle(center, d) {
  let deltaAngle = (2 * Math.PI) / d.count;

  for (let i = 0; i < d.count; i++) {
    let x = Math.cos(deltaAngle * i) * d.radius;
    let y = Math.sin(deltaAngle * i) * d.radius;

    center.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', x)
      .attr('y2', y)
      .attr('stroke-width', 0.25 * 1)
      .attr('stroke', '#336699');
  }

  center.append('circle')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', innerRadius)
    .attr('class', 'count')
    .attr('fill', 'rgba(255, 255, 255, 1)');

  center.append('text')
    .text(d.count)
    .attr('x', 0)
    .attr('y', 3)
    .attr('class', 'count')
    .attr('text-anchor', 'middle');
}

function getRangeClass(count) {
  for (let i = 0; i < ranges.length; i++) {
    let r = ranges[i];

    if (count >= r.min && count <= r.max) {
      return `range-${i}`;
    }
  }
}

function selectMedian() {
  let visibleRanges = [];

  $('input[type=checkbox]:checked').each((i, elem) => {
    visibleRanges.push(`.range-${$(elem).data('index')}`);
  });

  let $visibleSnowflakes = $(visibleRanges.join(', '));

  $('.median-selected').removeClass('median-selected');

  let count = $visibleSnowflakes.length;

  if (count > 0) {
    let medianIndex = Math.floor($visibleSnowflakes.length / 2);
    $($visibleSnowflakes[medianIndex]).parent().addClass('median-selected');

    // if(count % 2 === 0) {
    //   $($visibleSnowflakes[medianIndex + 1]).parent().addClass('median-selected');
    // }
  }
}

function addButtons() {
  $('#filters').append('<button class="median">show median</button>');

  // $('a.zoomin').on('click', function () {
  //   if ($(this).text() === 'zoom out') {
  //     $('.container').addClass('zoom');
  //     $(this).text('zoom in');
  //   } else {
  //     $('.container').removeClass('zoom');
  //     $(this).text('zoom out');
  //   }

  //   return false;
  // });

  $('a.median').on('click', function () {
    $('body').toggleClass('show-median');

    if ($('body').hasClass('show-median')) {
      $(this).text('hide median');
    } else {
      $(this).text('show median');
    }

    return false;
  });

  $('.info').on('click', function () {
    $('#modal').modal({
      showClose: false,
      fadeDuration: 500,
      fadeDelay: 0.15
    });

    $('#modal').html(`<div class="info-modal">
      <p>The median shows the halfway point of filtered years.</p>
      <p>The calculation takes the floor value, when median contains a remainder.</p>
      <p><a href="#" rel="modal:close">Close</a></p></div>`);

    // selectMedian();
  })
}



