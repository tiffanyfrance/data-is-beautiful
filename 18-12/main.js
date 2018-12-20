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
  for (let d of data) {
    let days = +d.DAYS,
        syear = d['START YEAR'], 
        eyear = d['END YEAR'];

    let elem = d3.select('.container').append('span')
      .on('click', function(d) {
        let $modal = $('#modal');
        let modal = d3.select('#modal');

        $modal.find('svg').remove();

        $modal.modal({
          showClose: false,
          fadeDuration: 500,
          fadeDelay: 0.15
        });

        $modal.empty();
        $modal.html(createCircle(modal, days, syear, eyear))

        d3.event.stopPropagation();
      });

    createCircle(elem, days, syear, eyear);
  }

  /* Create filters */
  for(let i = 0; i < ranges.length; i++) {
    let r = ranges[i];

    let $elem = $(`<div class="col"><label>
      <input type="checkbox" checked class="input-${i}" data-index="${i}">
      <span class="checkmark"></span>${r.min}-${r.max} days
      </label></div>`);

    $('.flex').append($elem);

    let $input = $elem.find('input');

    $input.change(() => {
      let opacity = $input.is(':checked') ? 1 : 0.125;
      d3.selectAll(`.range-${i}`).transition()
        .attr("duration", 300)
        .style('opacity', opacity);

      selectMedian();
    });
  }

  selectMedian();

  addButtons();
});

function createCircle(elem, count, syear, eyear) {
  let width = 80;
  let height = 110;
  let radius = 40;

  let center = elem.append('svg')
    .attr('width', width)
    .attr('height', height)
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
  }

  center.append('circle')
  .attr('cx', 0)
  .attr('cy', 0)
  .attr('r', 15)
  .attr('class', 'count')
  .attr('fill', 'rgba(255, 255, 255, 1)');

  center.append('text')
    .text(count)
    .attr('x', 0)
    .attr('y', 3)
    .attr('class', 'count')
    .attr('text-anchor', 'middle');

  center.append('text')
    .text(syear + ' - ' + eyear)
    .attr('x', 0)
    .attr('y', -height/2 + 3)
    .attr('text-anchor', 'middle');
}

function getRangeClass(count) {
  for (let i = 0; i < ranges.length; i++) {
    let r = ranges[i];

    if(count >= r.min && count <= r.max) {
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

  if(count > 0) {
    let medianIndex = Math.floor($visibleSnowflakes.length / 2);
    $($visibleSnowflakes[medianIndex]).parent().addClass('median-selected');

    // if(count % 2 === 0) {
    //   $($visibleSnowflakes[medianIndex + 1]).parent().addClass('median-selected');
    // }
  }
}

function addButtons() {
  $('.flex').append(`
    <div class="col" style="min-width: 195px;">
    <a href="#" class="zoomin">zoom in</a>
    <a href="#" class="median">show median</a><span class="info">&#9432</span>
    </div>`);

  $('a.zoomin').on('click', function() {
    if ($(this).text() === 'zoom out') {
      $('.container').addClass('zoom');
      $(this).text('zoom in');
    } else {
      $('.container').removeClass('zoom');
      $(this).text('zoom out');
    }

    return false;
  });

  $('a.median').on('click', function() {
    $('body').toggleClass('show-median');

    if($('body').hasClass('show-median')) {
      $(this).text('hide median');
    } else {
      $(this).text('show median');
    }

    return false;
  });

  $('.info').on('click', function() {
    $('#modal').modal({
      showClose: false,
      fadeDuration: 500,
      fadeDelay: 0.15
    });

    $('#modal').html(`<div class="info-modal">
      <p>The median shows the halfway point of filtered years.</p>
      <p>The calculation takes the floor value, when median returns a remainder.</p>
      </div>`);

    selectMedian();
  })
}



