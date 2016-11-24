(function() {
    var main = {};
    main.dictionary = '';
    main.dictionaryTree = {};
    main.words = [];
    main.keyMap = {
        2: 'abc',
        3: 'def',
        4: 'ghi',
        5: 'jkl',
        6: 'mno',
        7: 'pqrs',
        8: 'tuv',
        9: 'wxyz'
    };

    main.init = function(dictionary) {
        main.dictionary = dictionary;
        main.words = dictionary.split(/\s+/g);

        var tree = {};

        main.words.forEach(function (word) {
            var letters = word.split('');
            var leaf = tree;

            for (var i = 0; i < letters.length; i++) {
                var letter = letters[i].toLowerCase();
                var existing = leaf[letter];
                var last = (i === letters.length - 1);
                if (typeof(existing) === 'undefined') {
                    leaf = leaf[letter] = last ? 1 : {};
                } else if (typeof(existing) === 'number') {
                    if (last) {
                        leaf[letter]++;
                    } else {
                        leaf = leaf[letter] = { obj: existing };
                    }
                } else if (typeof(existing) === 'object' && last) {
                    if (existing.hasOwnProperty('obj')) {
                        leaf[letter].obj++;
                    } else {
                        leaf[letter] = existing;
                        leaf[letter].obj = 1;
                    }
                } else {
                    leaf = leaf[letter];
                }
            }
        });
        main.dictionaryTree = tree;
    };

    main.predict = function(numericInput) {
        return main.findWords(numericInput, main.dictionaryTree, true);
    };

    main.findWords = function(sequence, tree, exact, words, currentWord, depth) {

        var current = tree;

        sequence = sequence.toString();
        words = words || [];
        currentWord = currentWord || '';
        depth = depth || 0;

        for (var leaf in current) {
            var word = currentWord;
            var value = current[leaf];
            var key;
            if (leaf === 'obj') {
                key = sequence.charAt(depth - 1);
                if (depth >= sequence.length) {
                    words.push(word);
                }
            } else {
                key = sequence.charAt(depth);
                word += leaf;
                if (depth >= (sequence.length - 1) && typeof(value) === 'number' && key && (main.keyMap[key].indexOf(leaf) > -1)) {
                    words.push(word);
                }
            }
            if ((key && main.keyMap.hasOwnProperty(key) && main.keyMap[key].indexOf(leaf) > -1) || (!key && !exact)) {
                main.findWords(sequence, value, exact, words, word, depth + 1);
            }
        }
        return words;
    };

    var currentWord = '';
    var currentPredictions = [];
    var currentPredictionsIndex = 0;

    $(function(){
        $.ajax({
            url: 'dictionary.txt',
            success: function(data, textStatus, jqXHR ) {
                main.init(data);
            }
        });

        $('button.key').on('click', function(event){
            var value = $(this).val();
            currentWord += value;
            currentPredictions = main.predict(currentWord);
            currentPredictionsIndex = 0;
            if(currentPredictions.length > 0){
                $('.current-text').text(currentPredictions[0]);
            }
            else {
                $('.current-text').text($('.current-text').text() + value);
            }
        });

        $('.controller .cycle').on('click', function(event){
            if(currentPredictions.length > 0){
                if (++currentPredictionsIndex >= currentPredictions.length)
                    currentPredictionsIndex = 0;

                $('.current-text').text(currentPredictions[currentPredictionsIndex]);
            }
        });

        $('.controller .delete').on('click', function(event){
            if(currentWord == ''){
                var previousText = $('.prev-text').text();
                previousText = previousText.slice(0, previousText.length-1);
                $('.prev-text').text(previousText);
                return;
            }

            currentWord = currentWord.slice(0, currentWord.length-1);
            currentPredictions = main.predict(currentWord);
            currentPredictionsIndex = 0;
            if(currentPredictions.length > 0){
                $('.current-text').text(currentPredictions[0]);
            }
            else {
                var currentText = $('.current-text').text();
                currentText = currentText.slice(0, currentText.length-1);
                $('.current-text').text(currentText);
            }
        });

        $('body').on('keydown', function(event) {
            if (event.keyCode === 8) {
                event.preventDefault();
            }

            switch (String.fromCharCode(event.keyCode)) {
                case "2":
                    $('button.key-2').focus().click();
                    break;
                case "3":
                    $('button.key-3').focus().click();
                    break;
                case "4":
                    $('button.key-4').focus().click();
                    break;
                case "5":
                    $('button.key-5').focus().click();
                    break;
                case "6":
                    $('button.key-6').focus().click();
                    break;
                case "7":
                    $('button.key-7').focus().click();
                    break;
                case "8":
                    $('button.key-8').focus().click();
                    break;
                case "9":
                    $('button.key-9').focus().click();
                    break;
            }
        });

    });

}).call(this);