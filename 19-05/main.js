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
  d.total = Math.log(d.total);
  return d;
})
  .then(data => {
    console.log(data);

    data.sort((a, b) => b.total - a.total);
    // data = data.slice(2);

    let maxTotal = d3.max(data, d => d.total);
    console.log(maxTotal);

    const svg = d3.select('#viz svg')
      .attr('width', fullWidth)
      .attr('height', fullHeight);

    let arc = d3.arc();

    const g = svg.append('g')
      // .attr('transform', `translate(${width * 0.75},${height * 0.25})`);
      .attr('transform', `translate(${width},${height * 0.25})`);

    g.selectAll('path')
      .data(data)
      .enter().append('path')
      .attr('fill', '#ccc')
      .attr('stroke', 'white')
      .attr('d', (d, i) => {
        console.log(d, i);
        return arc({
          innerRadius: 0,
          outerRadius: (d.total / maxTotal) * maxRadius,
          startAngle: startAngle + (i * angle),
          endAngle: startAngle + ((i + 1) * angle)
        });
      })
  });