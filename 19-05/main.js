const fullWidth = 640;
const fullHeight = 800;

const margin = { top: 10, right: 10, bottom: 20, left: 50 },
  width = fullWidth - margin.left - margin.right,
  height = fullHeight - margin.top - margin.bottom;

const maxRadius = 700;
const degreeToRadian = Math.PI / 180;
const startAngle = 210 * degreeToRadian;
const angle = (90 / 7.5) * degreeToRadian;

let tooltip = d3.select('#tooltip');

d3.csv('data.csv', d => {
  d.Journeys = +d.Journeys;
  d.Hours = +d.Hours;
  d.km = +d.km;
  d.total = d.Journeys + d.Hours + d.km;
  d.originalTotal = d.total;
  d.total = Math.log(d.total);

  d.segments = [
    {
      color: '#E2C168',
      amount: d.Journeys,
      key: 'trips',
      type: d.Type
    },
    {
      color: '#A5CDC9',
      amount: d.Hours,
      key: 'hours',
      type: d.Type
    },
    {
      color: '#DB655C',
      amount: d.km,
      key: 'kilometers',
      type: d.Type
    }
  ];

  d.segments.sort((a, b) => a.amount - b.amount);

  for (let i = d.segments.length - 1; i >= 0; i--) {
    let total = 0;

    for (let j = 0; j <= i; j++) {
      total += d.segments[j].amount;
    }

    d.segments[i].percent = Math.max(0.04, total / d.originalTotal);
  }

  d.segments.reverse();

  return d;
})
  .then(data => {
    console.log(data);

    data.sort((a, b) => b.total - a.total);

    let maxTotal = d3.max(data, d => d.total);

    let arcData = [];

    for (let i = 0; i < data.length; i++) {
      let totalRadius = (data[i].total / maxTotal) * maxRadius;

      data[i].radius = totalRadius + 20;
      data[i].angle = -(Math.PI / 2) + startAngle + ((i + 0.5) * angle);

      for (let d of data[i].segments) {
        d.innerRadius = 0;
        d.outerRadius = d.percent * totalRadius;
        d.startAngle = startAngle + (i * angle);
        d.endAngle = startAngle + ((i + 1) * angle);
        arcData.push(d);
      }
    }

    const svg = d3.select('#viz svg')
      .attr('width', fullWidth)
      .attr('height', fullHeight);

    let arc = d3.arc();

    const g = svg.append('g')
      // .attr('transform', `translate(${width * 0.75},${height * 0.25})`);
      .attr('transform', `translate(${width},${height * 0.25})`);

    g.selectAll('path')
      .data(arcData)
      .enter().append('path')
      .attr('fill', d => d.color)
      .attr('stroke', 'white')
      .attr('d', d => arc(d))
      .on('mouseover', function(d) {
        tooltip
          .style('left', (d3.event.pageX + 10) + 'px')
          .style('top', (d3.event.pageY + 10) + 'px');
  
        tooltip
          .select('#type')
          .text(d.type);
        
        tooltip
          .select('#amount')
          .text(d.amount);
        
        tooltip
          .select('#key')
          .text(d.key);
  
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

    g.selectAll('text')
      .data(data)
      .enter().append('text')
      .style('font-size', '12px')
      .text(d => d.Type)
      .attr('text-anchor', 'middle')
      .attr('transform', function (d) {
        let x = Math.cos(d.angle) * d.radius;
        let y = Math.sin(d.angle) * d.radius;
        let rotate = (d.angle * (180 / Math.PI)) + 90;
        return `translate(${x},${y})rotate(${rotate})`;
      })
      .attr('dy', '0.9em')
  });

// const fullWidth = 640;
// const fullHeight = 800;

// const margin = { top: 10, right: 10, bottom: 20, left: 50 },
//   width = fullWidth - margin.left - margin.right,
//   height = fullHeight - margin.top - margin.bottom;

// const maxRadius = 700;
// const degreeToRadian = Math.PI / 180;
// const startAngle = 210 * degreeToRadian;
// const angle = (90 / 7.5) * degreeToRadian;

// d3.csv('data.csv', d => {
//   d.Journeys = +d.Journeys;
//   d.Hours = +d.Hours;
//   d.km = +d.km;
//   d.total = d.Journeys + d.Hours + d.km;
//   // d.total = Math.log(d.total);
//   return d;
// })
//   .then(data => {
//     console.log(data);

//     data.sort((a, b) => b.total - a.total);
//     // data = data.slice(2);

//     let maxTotal = d3.max(data, d => d.total);
//     // console.log(maxTotal);

//     const svg = d3.select('#viz svg')
//       .attr('width', fullWidth)
//       .attr('height', fullHeight);

//     let arc = d3.arc();

//     const g = svg.append('g')
//       // .attr('transform', `translate(${width * 0.75},${height * 0.25})`);
//       .attr('transform', `translate(${width},${height * 0.25})`);

//     g.selectAll('path')
//       .data(data)
//       .enter().append('path')
//       .attr('fill', '#ccc')
//       .attr('stroke', 'white')
//       .attr('d', (d, i) => {
//         console.log(d, i);
//         return arc({
//           innerRadius: 0,
//           outerRadius: (d.total / maxTotal) * maxRadius,
//           startAngle: startAngle + (i * angle),
//           endAngle: startAngle + ((i + 1) * angle)
//         });
//       })
//   });