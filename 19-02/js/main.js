var data;
var isLoad = false;


$(function() {
  d3.csv('../drugs.csv', function(error, jsonData) {
    let data = jsonData;

    if (!isLoad) {
      $('.g').each(function(i, elem) {
        // setTimeout(function() {
          $(elem).fadeIn("slow");
        // }, 100 + Math.random() * (Math.random() * 1000));
      });

      isLoad = true;
    }

    // barChart(data, 'Mean Physical Harm And Mean Dependence', '#all .bar', 500);

    barChart(data, 'Acute Harm', '#physical-harm .bar');
    barChart(data, 'Chronic Harm', '#physical-harm .bar');
    barChart(data, 'Intravenous Harm', '#physical-harm .bar');

    barChart(data, 'Pleasure', '#dependence .bar');
    barChart(data, 'Psychological', '#dependence .bar');
    barChart(data, 'Physical', '#dependence .bar');

    barChart(data, 'Intoxication', '#social-harm .bar');
    barChart(data, 'Social Harm', '#social-harm .bar');
    barChart(data, 'Health Care Costs', '#social-harm .bar');

  });

  $('.tabs').on('click', function() {
    if (!$(this).hasClass('active')) {
      $('*').removeClass('active');

      var id = $(this).data('tab');

      $(this).addClass('active');
      $('#' + id).addClass('active');
    }
  });
});