let width = 50 * 4;
let height = 65 * 4;
let radius = 30 * 3;
let innerRadius = 8 * 2;
let marginTop = 20;
// let o = [0.7,0.75,0.8,0.85,0.9,0.95,1];
let o = [0.4,0.5,0.6,0.7,0.8,0.9,1];

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

let svgs = [];
let decadeNodes = [];
let decadeTexts = [];
let simulations = [];

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
      eyear,
      range: +getRangeClass(days).substr(6)
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
    // console.log(count)

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
      .attr('y', marginTop / 1.5)
      .attr('text-anchor', 'middle')
      .style('font-weight', 'bold');

    svgs.push(svg);

    let decadeNode = {
      radius: decade.radius,
      data: decade,
      x: width / 2,
      y: height / 2,
      scale: 1
    };

    let nodes = [decadeNode];
    decadeNodes.push(decadeNode);

    for (let y of decade.years) {
      let radius = y.days * (21 / 140);
      radius = Math.max(8, radius);

      nodes.push({
        radius,
        data: y,
        x: (width / 2),
        y: (height / 2),
        scale: 1
      });
    }

    shuffle(nodes);

    let fs = d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength((d) => (d.data.years) ? 100 : 1))
      .force("x", d3.forceX((d) => {
        let delta = (d.data.years) ? -20 : 20;
        return (width / 2) + delta;
      }).strength(0.1))
      .force("y", d3.forceY((d) => {
        let delta = (d.data.years) ? 0 : -20;
        return height / 2 + delta;
      }))
      .force('collision', d3.forceCollide().radius((d) => d.radius))
      .on('tick', ticked);
    
    simulations.push(fs);

    function ticked() {
      let u = svg
        .selectAll('.force-circle')
        .data(nodes);

      u.enter()
        .append('g')
        .each(function (d) {
          // console.log(d);
          let g = d3.select(this);

          if (d.data.years) {
            g.attr('class', 'force-circle line-circle');

            createCircle(g, decade);
          } else {
            g.attr('class', 'force-circle ' + getRangeClass(d.data.days));

            g.append('circle')
              .attr('r', (d) => d.radius - 2)
              .attr('fill', '#369')
              .style('opacity', (d) => {
                let num = d.data.days;

                console.log(num)
                if (num < 80) {
                  return o[0];
                } else if (num >= 80 && num < 90) {
                  return o[1];
                } else if (num >= 90 && num < 100) {
                  return o[2];
                } else if (num >= 100 && num < 110) {
                  return o[3];
                } else if (num >= 110 && num < 120) {
                  return o[4];
                } else if (num >= 120 && num < 130) {
                  return o[5];
                } else {
                  return o[6];
                }
              });

            // console.log(d)

            if (d.radius > 12) {
              g.append('text')
                .text(d.data.eyear)
                .attr('x', 0)
                .attr('y', 3)
                .attr('text-anchor', 'middle')
                .style('fill', '#fff')
                .style('font-size', 9)
                .style('font-weight', 300);
            }
          }
        })
        .merge(u)
        .attr('transform', (d) => `translate(${d.x},${d.y}) scale(${d.scale})`);

      u.exit().remove();
    }
  }

  /* Create filters */
  for (let i = 0; i < ranges.length; i++) {
    let r = ranges[i];

    let $elem = $(`<button class="input-${i} checked" data-index="${i}"
      style="opacity: ${o[i]}">
      ${r.min}-${r.max}</button>`);

    $elem.click(() => {
      $elem.toggleClass('checked');
      $elem.toggleClass('unchecked');

      let opacity = $elem.hasClass('checked') ? 1 : 0.05;
      d3.selectAll(`.range-${i}`).transition()
        .attr("duration", 300)
        .style('opacity', opacity);

      selectMedian();

      /* Update decade average. */
      let activeRanges = $('button.checked').map((i, elem) => $(elem).data('index')).get();

      for(let j = 0; j < decadeNodes.length; j++) {
        let total = 0;
        let count = 0;

        for(let y of decadeNodes[j].data.years) {
          if(activeRanges.includes(y.range)) {
            total += y.days;
            count++;
          }
        }

        let average = Math.round(total / count);
        if(isNaN(average)) {
          decadeTexts[j].text(0);
          svgs[j].classed('no-value', true);
        } else {
          decadeTexts[j].text(average);
          svgs[j].classed('no-value', false);
        }

        let isFiltered = (count != decadeNodes[j].data.years.length);
        svgs[j].classed('is-filtered', isFiltered);
      }
    });

    $('#filters').append($elem);
  }

  addButtons();

  setTimeout(selectMedian, 100);
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

  let text = center.append('text')
    .text(d.count)
    .attr('x', 0)
    .attr('y', 3)
    .attr('class', 'count')
    .attr('text-anchor', 'middle');
  
  decadeTexts.push(text);
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

  $('button.checked').each((i, elem) => {
    visibleRanges.push(`.range-${$(elem).data('index')}`);
  });

  let $visibleSnowflakes = $(visibleRanges.join(', '));

  $('.median-selected').removeClass('median-selected');

  let count = $visibleSnowflakes.length;

  if (count > 0) {
    let medianIndex = Math.floor($visibleSnowflakes.length / 2);
    $($visibleSnowflakes[medianIndex]).find('circle').addClass('median-selected');

    // if(count % 2 === 0) {
    //   $($visibleSnowflakes[medianIndex + 1]).find('circle').addClass('median-selected');
    // }
  }
}

function addButtons() {
  $('#filters').append('<button class="median">hide median</button> <span class="info">&#9432;</span>');

  $('button.median').on('click', function () {
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
  })
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

