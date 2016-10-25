$(function(){
    $('#game-load-modal').modal('show');
    //openingTheme.play();
    $('#game-load-input-button').click(function(){
        var file = $('#input-file').prop('files')[0];
        if ($('#input-file').val() != '') {
            var reader = new FileReader();
            reader.readAsText(file);
            reader.onload = function(){
                var fileText = reader.result;
                var data = $.parseJSON(fileText);
                jsonData = data;
                currentBoard = jsonData[rounds[currentRound]];
                loadBoard();
                openingTheme.pause();
                openingTheme.currentTime = 0;
                var boardFillSound = new Audio('./sounds/board_fill.mp3');
                //boardFillSound.play();
                $('#game-load-modal').modal('hide');
            }
            reader.onerror = function(e){
                $('#game-load-error').text("Error: "+ e).show();
            };

        }
    });

    $('#next-round').unbind('click').click(function(e){
        e.stopPropagation();
        currentRound++;
        if (currentRound == rounds.length) {
            $(this).prop('disabled', true);
            window.location.reload();
        }
        else if (currentRound >= rounds.length - 1) {
            $(this).text('New Game');
        }
        currentBoard = jsonData[rounds[currentRound]];
        $('.panel-heading').empty();
        $('#main-board').empty();
        loadBoard();
    });

    $('#end-round').unbind('click').click(function(e){
        e.stopPropagation();
        var endRoundSound = new Audio('./sounds/end_of_round.mp3');
        endRoundSound.play();
        $('.unanswered').removeClass('unanswered').unbind().css('cursor','not-allowed');
    });
    $(document).on('click', '.unanswered', function(){
        //event bound to clicking on a tile. it grabs the data from the click event, populates the modal, fires the modal, and binds the answer method
        /*
        var category = $(this).parent().data('category');
        var question = $(this).data('question');
        var answer = currentBoard[category].questions[question].answer;
        var value = currentBoard[category].questions[question].value;
        var questionImage = currentBoard[category].questions[question].image;
        var isDailyDouble = 'daily-double' in currentBoard[category].questions[question] ?
            currentBoard[category].questions[question]['daily-double'] : false;

        if (isDailyDouble) {
            var dailyDoubleSound = new Audio('./sounds/daily_double.mp3');
            dailyDoubleSound.play();
            $('#daily-double-modal-title').empty().text(currentBoard[category].name + ' - $' + value);
            $('#daily-double-wager-input').val('');
            $('#daily-double-modal').modal('show');
        }
        else {
            // Candidate for refactoring.
            $('#modal-answer-title').empty().text(currentBoard[category].name + ' - $' + value);
            $('#question').empty().text(currentBoard[category].questions[question].question);
            if (questionImage){
                $('#question-image').empty().append("<img src=./" + questionImage + ">").show();
            }
            else {
                $('#question-image').empty().hide();
            }
            $('#answer-text').text(answer).hide();
            $('#question-modal').modal('show');
            //resizeAnswerModal();
            //$('#answer-close-button').hide().data('question', question).data('category', category);
            $('#answer-close-button').data('question', question).data('category', category);
            $('#answer-show-button').show();
            $('#question-modal .score-button').data('value', value);
            $('#question-modal .score-button').prop('disabled', false);
            $('#question-modal .score-button.btn-success').data('question', question).data('category', category);

        }
        $('#daily-double-wager').click(function(){
            var inputDailyDoubleValue = $('#daily-double-wager-input').val();
            var maxRoundWager = Math.max.apply(Math, currentBoard[0]['questions'].map(function(o){return o.value}));
            var scoreVariable = 'score_player_' + control;

            //get max of maxRoundWager and controlling user score.
            if ( !(isNaN(inputDailyDoubleValue)) && inputDailyDoubleValue != '' && parseInt(inputDailyDoubleValue) >= 5
            	&& Math.max(maxRoundWager, window[scoreVariable]) >= parseInt(inputDailyDoubleValue) ) {

                value = parseInt(inputDailyDoubleValue);
                $('#modal-answer-title').empty().text(currentBoard[category].name + ' - $' + value);
                $('#question-modal .score-button').data('value', value).data('question', question).data('category', category);
                $('#daily-double-modal').modal('hide');

                $('#question').empty().text(currentBoard[category].questions[question].question);
                if (questionImage){
                    $('#question-image').empty().append("<img src=./" + questionImage + ">").show();
                }
                else {
                    $('#question-image').empty().hide();
                }
                $('#answer-text').text(answer).hide();
                $('#question-modal').modal('show');
                //resizeAnswerModal();
                //$('#answer-close-button').hide().data('question', question).data('category', category);
                $('#answer-close-button').data('question', question).data('category', category);
                $('#answer-show-button').show();
                $('#question-modal .score-button').prop('disabled', true);
                $('#p' + control.toString() + '-wrong-button').prop('disabled', false);
                $('#p' + control.toString() + '-right-button').prop('disabled', false);
                $('#question-modal .score-button.btn-success').data('question', question).data('category', category);

            }
			//$(this).empty().append('&nbsp;<div class="clearfix"></div>').removeClass('unanswered').unbind().css('cursor','not-allowed');
            //$('#question-modal').modal('hide');

        });
		//$('#question-modal').on('loaded.bs.modal', resizeAnswerModal());
		$('#question-modal').on('shown.bs.modal', function (e) {
		  resizeAnswerModal();
		})
        handleAnswer();
        */
        $(this).empty().append('&nbsp;<div class="clearfix"></div>').removeClass('unanswered').unbind().css('cursor','not-allowed');
        $('#question-modal').modal('hide');

    });
    $('#score-adjust').click(function(){
        $('#score-adjust-modal').modal('show');
        $('#score-player-1-input').val(score_player_1);
        $('#score-player-2-input').val(score_player_2);
        $('#score-player-3-input').val(score_player_3);
        $("input[name=control-input][value=" + control + "]").attr('checked', 'checked');
        adjustScores();
    });
    $(document).on('click', '#final-jeopardy-question-button', function(){
        $(this).hide();
        $('#final-jeopardy-question').show();
        var revealSound = new Audio('./sounds/final_jeopardy.mp3');
        //revealSound.play();
        $('final-jeopardy-logo-img').hide();
        //$('#final-jeopardy-music-button').show();
        // console.log('30 seconds, good luck'); Cue music
    });
    $(document).on('click', '#final-jeopardy-music-button',function(){
        $(this).hide();
        //var thinkMusicSound = new Audio('./sounds/think_music.mp3');
        //thinkMusicSound.play();
        //setTimeout(function(){
        //    $('#final-jeopardy-answer-button').show();
        //}, 30000);
    });
    $(document).on('click', '#final-jeopardy-answer-button',function(){
        $(this).hide();
        $('#final-jeopardy-modal-answer').text(currentBoard['answer']);
        $('#final-jeopardy-modal-answer').hide();
        $('#final-jeopardy-modal').modal('show');
        handleFinalAnswer();
    });
    $(window).resize(function(){
	    var textHeight = Math.max.apply(null, ($('.category-title').map(function(){return $(this).height();})));
	    var width = Math.max.apply(null, ($('.category-title').map(function(){return $(this).parent().width();})));
	    // If possible to keep aspect ratio, switch to it.
	    //var aspectRatioHeight = width * .75;
	    var aspectRatioHeight = width * (9 / 16);
	    var height = Math.max(textHeight, aspectRatioHeight);
	    $('.category-title').height(height).width(width);
    });

});

var score_player_1 = 0;
var score_player_2 = 0;
var score_player_3 = 0;
var control = 1;
var rounds = ['jeopardy', 'double-jeopardy', 'final-jeopardy'];
var playerTranslation = {1: 'Red', 2: 'Blue', 3: 'Green'}
var currentBoard;
var currentRound = 0;
var isTimerActive = false;
var timerMaxCount = 5;
var timerObject;
var timerCount;
var gameDataFile;
var openingTheme = new Audio('./sounds/theme.mp3');


function runTimer() {
    timerObject = setTimeout(function(){
        timerCount++;
        $('.timer-set-' + timerCount).css('background-color', 'black');
        if (timerCount < timerMaxCount) {
            runTimer();
        }
        else {
            var timeUpAudio = new Audio('./sounds/time_up.mp3')
            timeUpAudio.play();
            // Doo doo doo
            resetTimer();
        }
    }, 1000);
}

function resetTimer() {
    clearTimeout(timerObject);
    isTimerActive = false;
    timerCount = 0;
    $('.timer-square').css('background-color', 'black');
}

function adjustScores(){
    $('#score-adjust-save').click(function(){
        for (var i = 1; i < 4; i++) {
            var scoreVariableName = 'score_player_' + i;
            var inputName = '#score-player-' + i + '-input';
            var newScoreValue = $(inputName).val();
            if (!(isNaN(newScoreValue))) {
                window[scoreVariableName] = parseInt(newScoreValue);
            }
        };
		control = $("input[name=control-input]:checked").val();

        updateScore();
    });
}

function updateScore(){
	var score_text = '';
	score_player_1 < 0 ? score_text = '-$' + Math.abs(score_player_1).toString() : score_text = "$" + score_player_1.toString();
	score_player_1 < 0 ? $('#player-1-score').css('color', 'red') : $('#player-1-score').css('color', 'white');
    $('#player-1-score').empty().text(score_text);

	score_player_2 < 0 ? score_text = '-$' + Math.abs(score_player_2).toString() : score_text = "$" + score_player_2.toString();
	score_player_2 < 0 ? $('#player-2-score').css('color', 'red') : $('#player-2-score').css('color', 'white');
    $('#player-2-score').empty().text(score_text);

	score_player_3 < 0 ? score_text = '-$' + Math.abs(score_player_3).toString() : score_text = "$" + score_player_3.toString();
	score_player_3 < 0 ? $('#player-3-score').css('color', 'red') : $('#player-3-score').css('color', 'white');
    $('#player-3-score').empty().text(score_text);

	$('#control-player').empty().text(playerTranslation[control]);
    //$('#player-2-score').empty().text(score_player_2);
    //$('#player-3-score').empty().text(score_player_3);
}

function loadBoard() {
    //function that turns the board.json (loaded in the the currentBoard variable) into a jeopardy board
    var board = $('#main-board');
    if (rounds[currentRound] === "final-jeopardy") {
        $('#end-round').hide();
        $('#control-info').hide();
        $('#main-board-categories').append('<div class="text-center col-md-6 col-md-offset-3"><h2 class="category-text">' +
            currentBoard['category'] + '</h2></div>').css('background-color', 'navy');
        board.append('<div class="text-center col-md-6 col-md-offset-3"><h2><img src="./images/final_jeopardy.png" id="final-jeopardy-logo-img"></h2>'+
        	'<h2 id="final-jeopardy-question" class="question-text">' +
            currentBoard['answer'] + '</h2><button class="btn btn-primary" id="final-jeopardy-question-button">Show Question</button>' +
            '<button class="btn btn-primary" id="final-jeopardy-music-button">30 Seconds, Good Luck</button>' +
            '<button class="btn btn-primary" id="final-jeopardy-answer-button">Show Answer</button></div>').css('background-color', 'navy');
        $('#final-jeopardy-question').hide();
        $('#final-jeopardy-music-button').hide();
        $('#final-jeopardy-answer-button').hide();
    }
    else {
	    if (rounds[currentRound] === "double-jeopardy") {
		    if (score_player_1 <= score_player_2 && score_player_1 <= score_player_3) {
			    control = 1;
		    }
		    else if (score_player_2 <= score_player_3) {
			    control = 2;
		    }
		    else {
			    control = 3;
		    }
	    }
        $('#control-player').empty().text(playerTranslation[control]);
        $('#end-round').show();
        board.css('background-color', 'black');
        var columns = currentBoard.length;

        // Floor of width/12, for Bootstrap column width appropriate for the number of categories
        var column_width = parseInt(12/columns);
        $.each(currentBoard, function(i,category){
            // Category
            var header_class = 'col-md-' + column_width;
            if (i === 0 && columns % 2 != 0){ //if the number of columns is odd, offset the first one by one to center them
                header_class += ' col-md-offset-1';
            }
            $('#main-board-categories').append('<div class="category ' + header_class
                + '"><div class="text-center well"><div class="category-title category-text text-center">' + category.name
                 + '</div></div><div class="clearfix"></div></div>').css('background-color', 'black');

            // Column
            var div_class = 'category col-md-' + column_width;
            if (i === 0 && columns % 2 != 0){
                div_class += ' col-md-offset-1';
            }
            board.append('<div class="' + div_class + '" id="cat-' +
                i + '" data-category="' + i + '"></div>');
            var column = $('#cat-'+i);

            $.each(category.questions, function(n,question){
                // Questions
                column.append('<div class="well unanswered host-question text-center" data-question="' +
                    n + '">$' + question.value + ': ' + question.question + ' - <i>' + question.answer + '</i></div>');
            });
        });
    }
    $('#main-board-categories').append('<div class="clearfix"></div>');
    var textHeight = Math.max.apply(null, ($('.category-title').map(function(){return $(this).height();})));
    var width = Math.max.apply(null, ($('.category-title').map(function(){return $(this).parent().width();})));
    // If possible to keep aspect ratio, switch to it.
    //var aspectRatioHeight = width * .75;
    var aspectRatioHeight = width * (9 / 16);
    var height = Math.max(textHeight, aspectRatioHeight);
    $('.category-title').height(height).width(width);
    var maxAnswerHeight = Math.max.apply(null, $(".host-question").map(function (){return $(this).height();}).get());
    $('.host-question').height(maxAnswerHeight);

    /*
    var questionTextHeight = Math.max.apply(null, ($('.question').map(function(){return $(this).height();})));
    var questionWidth = Math.max.apply(null, ($('.question').map(function(){return $(this).parent().width();})));
    var questionAspectRatioHeight = questionWidth * (9/16);
    var questionFinalHeight = Math.max(questionTextHeight, questionAspectRatioHeight);
    $('.question').height(questionFinalHeight);
    */
}

function resizeAnswerModal() {
    var otherHeights = ($('#question-modal-content .modal-header, #question-modal-content .modal-footer').map(function(){return $(this).outerHeight();}));
    var totalModalHeight = $('#question-modal-content').height();
    for(var i=0; i < otherHeights.length; i++) { totalModalHeight -= otherHeights[i]; }
    var modalBodyObj = $('#question-modal-content .modal-body');
    var modalBodyPadding = modalBodyObj.innerHeight() - modalBodyObj.height();
    //modalBodyObj.outerHeight(totalModalHeight);
    modalBodyObj.css('height',(totalModalHeight - modalBodyPadding)); // Adjust again for padding

    questionCenterPadding = ($('#question-modal-body').height() - ($('#question-image').height() + $('#question').height()))/2;
    $('#question').css('padding-top', questionCenterPadding);

}

function handleAnswer(){
    $('.score-button').unbind("click").click(function(e){
        e.stopPropagation();
        var buttonID = $(this).attr("id");
        var answerValue = parseInt($(this).data('value'));
        var buttonAction = buttonID.substr(3, 5);
        var playerNumber = buttonID.charAt(1);
        var scoreVariable = 'score_player_' + playerNumber;

        buttonAction === 'right' ? window[scoreVariable] += answerValue
            : window[scoreVariable] -= answerValue;
        $(this).prop('disabled', true);
        var otherButtonID = '#p' + playerNumber + '-' + (buttonAction === 'right' ? 'wrong' : 'right') + '-button';
        $(otherButtonID).prop('disabled', true);
        resetTimer();

        // Possible behavior of disabling all scoring after a right answer?
        if (buttonAction === 'right') {
            var tile = $('div[data-category="' + $(this).data('category') + '"]>[data-question="' +
                $(this).data('question') + '"]')[0];
            //console.log(tile);
            $('#question-modal .score-button').prop('disabled', true);
            control = playerNumber;

            $(tile).empty().append('&nbsp;<div class="clearfix"></div>').removeClass('unanswered').unbind().css('cursor','not-allowed');
            $('#question-modal').modal('hide');

        }
        updateScore();
    });

    $('#answer-show-button').click(function(){
        $(this).hide();
        $('#answer-text').show();
        resizeAnswerModal();
        //$('#answer-close-button').show();
    });
    $('#answer-close-button').click(function(){
        var tile = $('div[data-category="' + $(this).data('category') + '"]>[data-question="' +
            $(this).data('question') + '"]')[0];
        $(tile).empty().append('&nbsp;<div class="clearfix"></div>').removeClass('unanswered').unbind().css('cursor','not-allowed');
        $('#question-modal').modal('hide');
    });

    $('#timer-grid').unbind("click").click(function(e){
        e.stopPropagation();
        if (isTimerActive) {
            resetTimer();
        }
        else {
            $('.timer-square').css('background-color', 'red');
            isTimerActive = true;
            timerCount = 0;
            runTimer();
        }
        //isTimerActive = isTimerActive ? false : true;
    });
}

function handleFinalAnswer(){
    $('.final-score-button').unbind('click').click(function(e){
        e.stopPropagation();
        var buttonID = $(this).attr("id");
        var buttonAction = buttonID.substr(9,5);
        var playerNumber = buttonID.charAt(7);
        var wagerID = '#wager-player-' + playerNumber + '-input';
        var wager = $(wagerID).val() == '' ? 0 : parseInt($(wagerID).val());
        var scoreVariable = 'score_player_' + playerNumber;
        var otherButtonID = '#final-p' + playerNumber + '-' +
            (buttonAction === 'right' ? 'wrong' : 'right') + '-button';

        buttonAction === 'right' ? window[scoreVariable] += wager : window[scoreVariable] -= wager;

        $(this).prop('disabled', true);
        $(otherButtonID).prop('disabled', true);
        $(wagerID).prop('disabled', true).val('$' + window[scoreVariable]);

        updateScore();

    });


    $('#final-answer-show-button').click(function(){
        $(this).hide();
        $('#final-jeopardy-modal-answer').show();
        //resizeAnswerModal();
        //$('#answer-close-button').show();
    });

}
