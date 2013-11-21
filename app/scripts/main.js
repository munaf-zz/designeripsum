require.config({
  paths: {
    jquery: '../bower_components/jquery/jquery'
  }
});

require(['app', 'jquery'], function(app, $) {
  'use strict';

  var designerSelector = {list: {}, selected: 0};
  var $output, $selection, $list, designers, randomWords, json, data;

  $output = $('article');
  $list = $('.designer-list');
  $selection = $('.select-designer');

  json = getJson('scripts/designer-text.json');
  designers = createMarkov(json);

  selectDesigner('all');
  generateText();

  $output.on('click', function(event) {
    selectText('article');
  });

  $('.add-button').on('click', function(event) {
    event.preventDefault();
    deselectText();
    generateText();
    //$(window).scrollTop($(document).height());
  });

  $('.select-designer').on('click', function(event) {
    event.preventDefault();

    var name = $(this).attr('class').split(' ')[1];console.log( name);

    selectDesigner(name);
    $('.selected').removeClass('selected');
    $(this).addClass('selected');
    deselectText();
  });

  function selectDesigner(name) {
    designerSelector.selected = name;
    $('.selected').removeClass('selected');
    $(this).addClass('selected');
  }

  function generateText() {
    var numWords = 30 + Math.floor(Math.random() * 50),
        selected = designerSelector.selected, 
        newText; console.log(designers);

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
        designerSelector.list['buzzwords'] = {
          lastName: 'Buzzwords'
        };

        randomWords = designerJson['random'].words;

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
    designerSelector.list['all'] = {
      lastName: 'All'
    };

    markov['all'] = new Markov({
      inputText: allDesignerQuotes.join(' '),
      endWithCompleteSentence: true
    });

    $list.prepend('<li><a href="#" class="select-designer all">All</a></li>');

    return markov;
  }

  // Code adapted from: http://stackoverflow.com/a/987376
  // Stolen from downtonipsum.com :-)
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
    
  };

  // Code adapted from: http://help.dottoro.com/ljigixkc.php
  // Stolen from downtonipsum.com :-)
  function deselectText() {
    if (window.getSelection) {  // All browsers, except <= IE8
      var selection = window.getSelection();                                        
      selection.removeAllRanges();
    } else {
      if (document.selection.createRange) { // <= IE8
        var range = document.selection.createRange ();
        document.selection.empty ();
      }
    }
  };
});