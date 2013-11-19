require.config({
  paths: {
    jquery: '../bower_components/jquery/jquery'
  }
});

require(['app', 'jquery'], function(app, $) {
  'use strict';

  var designerSelector = {list: [], selected: null};
  var $output, designers, randomWords, json;

  $output = $('article');

  json = getJson('scripts/designer-text.json');
  designers = createMarkov(json);

  randomDesigner();
  generateText();

  $('.add-button').on('click', function(event) {
    event.preventDefault();
    generateText();
    $(window).scrollTop($(document).height());
  });

  $('.designer-changer').on('click', function(event) {
    event.preventDefault();
    randomDesigner();
  });

  function randomDesigner() {
    var selected;

    do {
      selected = Math.floor(Math.random()*designerSelector.list.length);
    } while (selected === designerSelector.selected) 

    designerSelector.selected = selected;
    $('.designer-changer')
      .text(' ' + designerSelector.list[designerSelector.selected].lastName + ' »');
  }

  function generateText() {
    var numWords = 30 + Math.floor(Math.random() * 50),
        selected = designerSelector.list[designerSelector.selected].index,
        newText; console.log(selected);

    if (selected === 'random') {
      newText = '<p>' + randomParagraph(numWords) + '</p>';
    } else {
      newText = '<p>' + designers[selected].generate(numWords) + '</p>';
    }

    $output.append(newText);
    
  }

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

  function randomParagraph(numWords) {
    var sentenceLength,
        paragraph = '';

    while (numWords > 0) {
      sentenceLength = Math.floor(Math.random()*2) + 3;
      paragraph += addSentence(sentenceLength) + ' ';
      numWords -= sentenceLength;
    }

    function addSentence(words) {
      var sentence = '';

      for (var i = 0; i < words; i++) {
        sentence += randomWords[
          Math.floor(Math.random()*randomWords.length)
        ];
        sentence += ' ';
      }

      return sentence.charAt(0).toUpperCase() + sentence.slice(1, -1) + '.';
    }

    return paragraph;
  }

  function createMarkov(designerJson) {
    var markov = {},
      allDesignerQuotes = [],
      quotes, designer;

    // Seperate generators for each designer
    for (designer in designerJson) {
      if (designer === 'random') {
        designerSelector.list.push({
          lastName: 'Random',
          index: 'random'
        });

        randomWords = designerJson['random'].words;

        continue;
      }

      quotes = designerJson[designer].quotes;
      allDesignerQuotes.concat(quotes);

      markov[designer] = new Markov({
        inputText: quotes.join(' '),
        endWithCompleteSentence: true
      });

      designerSelector.list.push({
        lastName: designerJson[designer].name.split(' ')[1],
        index: designer
      });
    }

    // Mix of all designers
    /*designerSelector.list.push({
      lastName: 'All',
      index: 'all'
    });*/

    markov['all'] = new Markov({
      inputText: allDesignerQuotes.join(' '),
      endWithCompleteSentence: true
    });

    return markov;
  }

});