require.config({
    paths: {
        jquery: '../bower_components/jquery/jquery',
        markov: 'markov.min'
    }
});

require(['app', 'jquery', 'markov'], function (app, $, Markov) {
    'use strict';
    // use app here
    console.log(app);
    console.log('Running jQuery %s', $().jquery);
    console.log('Markov Lib: ', Markov);
});
