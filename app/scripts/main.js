require.config({
    paths: {
        jquery: '../bower_components/jquery/jquery',
        markov: 'markov.min'
    }
});

require(['app', 'jquery', 'markov'], function (app, $) {
    'use strict';

    var designerQuotes;
    var markov = {}, designer;

    $.ajax({
    	url: 'scripts/designer-text.json',
    	dataType: 'json',
    	async: false
    }).done(function(data) {
    	console.log("got here!");
    	designerQuotes = data;
    });

    console.log("designer quotes here: ", designerQuotes);

    for (designer in designerQuotes) {
    	markov[designer] = new Markov({
    		inputText: designerQuotes[designer]['quotes'].join(' '),
    		endsWithCompleteSentence: true
    	});
    }

    console.log(markov['edwardtufte'].generate(100));
});
