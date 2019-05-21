const fullWidth = 640;
const fullHeight = 800;

const margin = { top: 10, right: 10, bottom: 20, left: 50 },
  width = fullWidth - margin.left - margin.right,
  height = fullHeight - margin.top - margin.bottom;

const maxRadius = 700;
const degreeToRadian = Math.PI / 180;
const startAngle = 210 * degreeToRadian;
const angle = (90 / 7.5) * degreeToRadian;

d3.csv('data.csv', d => {
  d.Journeys = +d.Journeys;
  d.Hours = +d.Hours;
  d.km = +d.km;
  d.total = d.Journeys + d.Hours + d.km;
  d.originalTotal = d.total;
  d.total = Math.log(d.total);

  d.segments = [
    {
      color: '#A5CDC9',
      amount: d.Journeys
    },
    {
      color: '#E2C168',
      amount: d.Hours
    },
    {
      color: '#DB655C',
      amount: d.km
    }
  ];

  d.segments.sort((a, b) => a.amount - b.amount);

  for (let i = d.segments.length - 1; i >= 0; i--) {
    let total = 0;

    for (let j = 0; j <= i; j++) {
      total += d.segments[j].amount;
    }

    d.segments[i].percent = total / d.originalTotal;
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
  });