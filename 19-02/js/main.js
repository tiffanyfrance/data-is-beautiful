let data;
let isLoad = false;


$(function() {
  d3.csv('drugs.csv', function(error, jsonData) {
    let data = jsonData;

    if (!isLoad) {
      $('.g').each(function(i, elem) {
          $(elem).fadeIn("slow");
      });

      isLoad = true;
    }

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

      let id = $(this).data('tab');

      $(this).addClass('active');
      $('#' + id).addClass('active');
    }
  });
});