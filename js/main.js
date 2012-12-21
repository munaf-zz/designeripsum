$(document).ready(function() {

    var words=["dieter rams","IDEO","classical conditioning","rule of thirds","iteration","photoshop","illustrator","type","sketch","pattern","sketches","script","monospace","mobile","pixel-perfect","slab serif","drawer menu","pencil","iconography","typography","ascenders","coach marks","fireworks","splash screen","typesetting","leading","responsive","omnigraffle","walkthrough","oblique","66-character line","measure","sidebar","header","footer","tabs","navigation","wireframe","the","mockup","modern","balsamiq","prototype","CSS","rounded corners","headroom","serif","sans-serif","helvetica","comic sans","complementary","design by committee","interstitial","affordance","user experience","user interface","interaction design","resolution","hover state","skeuomorphism","jony ive","icon","italic","aesthetic","archetype","mental model","artifact","aspect ratio","bauhaus","bevel","branding","front-end","contour","pixel","contrast","design","design language","design thinking","cognitive dissonance","ethnography","usability","usability testing","usable","hero message","figure-ground","from","focus group","heuristic","jakob nielsen","alan cooper","golden ratio","steve jobs","modular scale","gestalt","prägnanz","dropdown","kitsch","dribbble","portfolio","kerning","card-sorting","eye tracking","color theory","from","adobe","balance","user","constraints","user-centered","information architecture","palette","gradient","ligature","descender","narrative","baseline","grid","typeface","contextual inquiry","keep it simple","sitemap","post-its","brainstorm","braindump","visuals","innovate","behavior change","hierarchy","simplicity","grouping","glyph","lightbox","modal","delightful","interactive","composition","visualization","abstraction","urbanized","objectified","paper prototype","persona","scenario","storyboard","workflow","stakeholder","vector","retina","accessibility","clarity"]

    function capitalize(word) {
        return '' + word.charAt(0).toUpperCase() + word.slice(1);
    }

    function makeSentence(length) {
        var sentence = '', indexes = {},
            word, index, lastWord, i;

        if ( !length ) length = 3;

        for ( i = 0; i < length; i++ ) {
            do {
                index = Math.floor( Math.random() * words.length );
            } while( indexes.hasOwnProperty(index + '') );

            word = words[index];
            indexes[index + ''] = true;

            if ( i == 0 ) {
                word = capitalize(word);
            }

            sentence += ' ' + word;
            lastWord = word;
        }

        return sentence + '.';
    }

    function randomBetween(max, min) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function makeParagraph() {
        var min = 3,
            max = 10,
            output = '',
            len, numWords;

        numWords = randomBetween(15, 50);

        while(numWords > 0) {
            if ( numWords >= min && numWords <= max ) {
                len = numWords;
            } else {
                len = randomBetween(min, max);
            }

            output += makeSentence(len) + ' ';
            numWords -= len;
        }

        return output;
    }

    var $div = $('.container div'),
        $help = $('small'),
        $add = $('button.plus'),
        $remove = $('button.minus'),
        $copy = $('button.copy');

    $div.append('<p>' + makeParagraph() + '</p>');

    $('button').on('mouseout', function() {
        $help.removeClass('success').empty();
    });

    $add.on('click', function() {
        $div.prepend('<p>' + makeParagraph() + '</p>');
    });

    $add.on('mouseover', function() {
        $div.addClass('insertParagraph');
        $help.html('add');
    });

    $add.on('mouseout', function() {
        $div.removeClass('insertParagraph');
    });

    $remove.on('click', function() {
        $div.find('p:first-child').remove();

        if ( $(this).is(':hover') === true ) {
            $div.find('p:first-child').addClass('selectedDelete');
        }
    });

    $remove.on('mouseover', function() {
        $div.find('p:first-child').addClass('selectedDelete');
        $help.html('delete');
    });

    $remove.on('mouseout', function() {
        $div.find('p:first-child').removeClass('selectedDelete');
    });

    $copy.on('mouseover', function() {
        $div.addClass('selectedCopy');
        $help.html('copy');
    });

    $copy.on('mouseout', function() {
        $div.removeClass('selectedCopy copySuccess');
    });

    $copy.zclip({
        //path: 'js/vendor/ZeroClipboard.swf',
        path: 'http://www.designeripsum.com/ZeroClipboard.swf',
        copy: function() {
            //return $('p').text();
            //return $div.text();
            var output = '';
            $div.find('p').each(function(i, el) {
                output += $(this).text().trim().replace('. ', '.') + '\n\n';
            });

            return output;
        },
        afterCopy: function() {
            $div.addClass('copySuccess');
            $help.addClass('success').html('&#10003; copied');
        }
    });
});
