require.config({
  paths: {
    jquery: '../bower_components/jquery/jquery'
  }
});

require(['app', 'jquery'], function(app, $) {
  'use strict';

  var $output, $selection, $list, designers, randomWords, json;
  var Markov = window.Markov;
  var designerSelector = {
    list: {},
    selected: 0
  };

  function selectDesigner(name) {
    designerSelector.selected = name;
    $('.selected').removeClass('selected');
    $('.' + name).addClass('selected');
  }

  function removeText() {
    $output.find('p:first-of-type').remove();
  }

  function generateText() {
    var numWords = 30 + Math.floor(Math.random() * 30),
      selected = designerSelector.selected,
      newText;

    if (selected === 'buzzwords') {
      newText = '<p>' + randomParagraph(numWords) + '</p>';
    } else {
      newText = '<p>' + designers[selected].generate(numWords) + '</p>';
    }

    $output.prepend(newText);

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

    function addSentence(words) {
      var sentence = '';

      for (var i = 0; i < words; i++) {
        sentence += randomWords[
          Math.floor(Math.random() * randomWords.length)
        ];
        sentence += ' ';
      }

      return sentence.charAt(0).toUpperCase() + sentence.slice(1, -1) + '.';
    }

    while (numWords > 0) {
      sentenceLength = Math.floor(Math.random() * 4) + 2;
      paragraph += addSentence(sentenceLength) + ' ';
      numWords -= sentenceLength + 1;
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
        designerSelector.list.buzzwords = {
          lastName: 'Buzzwords'
        };

        randomWords = designerJson.random.words;

        continue;
      }

      quotes = designerJson[designer].quotes;
      allDesignerQuotes = allDesignerQuotes.concat(quotes);

      markov[designer] = new Markov({
        inputText: quotes.join(' '),
        endWithCompleteSentence: true
      });

      designerSelector.list[designer] = {
        lastName: designerJson[designer].name.split(' ')[1],
      };

      $list.append([
        '<li>',
        '<a href="#" class="select-designer ' + designer + '">',
        designerJson[designer].name.split(' ')[1],
        '</a>',
        '</li>'
      ].join(''));
    }

    // Mix of all designers
    designerSelector.list.mix = {
      lastName: 'Mix'
    };

    markov.all = new Markov({
      inputText: allDesignerQuotes.join(' '),
      endWithCompleteSentence: true
    });

    $('<li><a href="#" class="select-designer all">Mix</a></li>').insertAfter('.remove-button');
    $list.append('<li><a href="#" class="select-designer buzzwords">Misc.</a></li>');

    return markov;
  }

  // Code adapted from: http://stackoverflow.com/a/987376
  // And from downtonipsum.com :-)

  function selectText(element) {

    var doc = document,
      text = doc.getElementsByTagName(element)[0],
      range,
      selection;

    if (doc.body.createTextRange) { //ms
      range = doc.body.createTextRange();
      range.moveToElementText(text);
      range.select();
    } else if (window.getSelection) { //all others
      selection = window.getSelection();
      range = doc.createRange();
      range.selectNodeContents(text);
      selection.removeAllRanges();
      selection.addRange(range);
    }

  }

  // Code adapted from: http://help.dottoro.com/ljigixkc.php
  // And from downtonipsum.com :-)

  function deselectText() {
    $output.find('p:first-of-type').removeClass('insert-above');
    $output.find('p:first-of-type').removeClass('selected-for-removal');

    if (window.getSelection) { // All browsers, except <= IE8
      var selection = window.getSelection();
      selection.removeAllRanges();
    } else {
      if (document.selection.createRange) { // <= IE8
        var range = document.selection.createRange();
        document.selection.empty();
      }
    }
  }

  $output = $('article');
  $list = $('.nav-list');
  $selection = $('.select-designer');

  json = getJson('designer-text.json');
  designers = createMarkov(json);

  selectDesigner('all');
  generateText();

  $output.on('click', function(event) {
    event.preventDefault();
    selectText('article');
  });

  $('.add-button').on('mouseover', function(event) {
    event.preventDefault();
    deselectText();
    $output.find('p:first-of-type').addClass('insert-above');
  });

  $('.add-button').on('mouseout', function(event) {
    event.preventDefault();
    deselectText();
    $output.find('p:first-of-type').removeClass('insert-above');
  });

  $('.add-button').on('click', function(event) {
    event.preventDefault();
    deselectText();
    generateText();
  });

  $('.remove-button').on('mouseover', function(event) {
    event.preventDefault();
    $output.find('p:first-of-type').addClass('selected-for-removal');
  });

  $('.remove-button').on('mouseout', function(event) {
    event.preventDefault();
    $output.find('p:first-of-type').removeClass('selected-for-removal');
  });

  $('.remove-button').on('click', function(event) {
    event.preventDefault();
    deselectText();
    removeText();
  });

  $('.select-designer').on('click', function(event) {
    event.preventDefault();

    var name = $(this).attr('class').split(' ')[1];

    selectDesigner(name);
    $('.selected').removeClass('selected');
    $(this).addClass('selected');
    deselectText();
  });

});