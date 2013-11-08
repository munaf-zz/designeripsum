require.config({
  paths: {
    jquery: '../bower_components/jquery/jquery',
    markov: 'markov.min'
  }
});

require(['app', 'jquery', 'markov'], function(app, $) {
  'use strict';

  var designers, json;
  var $designerList, $output;

  $designerList = $('.designer-list');
  $output = $('article');

  json = getJson('scripts/designer-text.json');
  designers = createMarkov(json);

  $('.designer-link').on('click', function(event) {
    var designer = $(this).attr('id');

    $output.append('<p>' + designers[designer].generate(100) + '</p>');

  });

  function getJson(url) {
    var designerJson = {};

    $.ajax({
      url: url,
      dataType: 'json',
      async: false
    }).done(function(data) {
      designerJson = data;
    });

    return designerJson;
  }

  function createMarkov(designerJson) {
    var markov = {},
      allDesignerQuotes = [],
      quotes, designer;

    // Seperate generators for each designer
    for (designer in designerJson) {
      quotes = designerJson[designer]['quotes'];

      markov[designer] = new Markov({
        inputText: quotes.join(' '),
        endWithCompleteSentence: true
      });

      $designerList.append(
        '<li><a href="#" class="designer-link" id="' + designer + '">' + designerJson[designer]['name'] + '</a></li>'
      );

      console.log($designerList);

      allDesignerQuotes.concat(quotes);
    }

    // Mix of all designers
    markov['all'] = new Markov({
      inputText: allDesignerQuotes.join(' '),
      endsWithCompleteSentence: true
    });

    return markov;
  }

});