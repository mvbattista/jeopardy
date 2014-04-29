$(function(){
    $.ajax({//ajax method to load the board.json and call the loadBoard() function on success 
        'async': false,
        'global': false,
        type:'GET',
        dataType:'json',
        url:'board.json',
        success:function(data){
            map = data;
            loadBoard();
        }
    });
    $('.unanswered').click(function(){
        //event bound to clicking on a tile. it grabs the data from the click event, populates the modal, fires the modal, and binds the answer method
        var category = $(this).parent().data('category');
        var question = $(this).data('question');
        var value = map[category].questions[question].value;
        var answers = $('#answers');
        $('.modal-title').empty().text(map[category].name);
        $('#question').empty().text(map[category].questions[question].question);
        answers.empty();
        $.each(map[category].questions[question].answers, function(i, answer){//loop over the answers and make buttons for each
            answers.append(
                '<button class="btn btn-danger answer" ' +
                    'data-category="'+category+'"' +
                    'data-question="'+question+'"' +
                    'data-value="'+value+'"' +
                    'data-correct="'+answer.correct+'"' +
                    '>'+ answer.text+'</button><br><br>'
            )
        });
        $('#question-modal').modal('show');//fire modal
        console.log(category, question);
        console.log(map[category].questions[question]);
        handleAnswer(); //bind answer onclick to newly created buttons
    });

});
var score_player_1 = 0;
var score_player_2 = 0;
var score_player_3 = 0;
var map;
function loadBoard() {
    //function that turns the board.json (loaded in the the map variable) into a jeopardy board
    var board = $('#main-board');
    var columns = map.length;
    var column_width = parseInt(12/columns); //get the width/12 rounded down, to use the bootstrap column width appropriate for the number of categories
    console.log(columns);
    $.each(map, function(i,category){
        //load category name
        var header_class = 'text-center col-md-' + column_width; 
        if (i === 0 && columns % 2 != 0){ //if the number of columns is odd, offset the first one by one to center them

            header_class += ' col-md-offset-1';
        }
        $('.panel-heading').append(
            '<div class="'+header_class+'"><h4>'+category.name+'</h4></div>'
        );
        //add column
        var div_class = 'category col-md-' + column_width;
        if (i === 0 && columns % 2 != 0){
            div_class += ' col-md-offset-1';
        }
        board.append('<div class="'+div_class+'" id="cat-'+i+'" data-category="'+i+'"></div>');
        var column = $('#cat-'+i);
        $.each(category.questions, function(n,question){
            //add questions
            column.append('<div class="well question unanswered text-center" data-question="'+n+'">$'+question.value+'</div>')
        });
    });
    $('.panel-heading').append('<div class="clearfix"></div>')

}

function updateScore(){
    $('#score').empty().text(score);
}

function handleAnswer(){
    $('.answer').click(function(){// hide empty the tile, make it unclickable, update the score if correct, and hide the modal
        var tile= $('div[data-category="'+$(this).data('category')+'"]>[data-question="'+$(this).data('question')+'"]')[0];
        $(tile).empty().removeClass('unanswered').unbind().css('cursor','not-allowed');
        if ($(this).data('correct')){
            score += parseInt($(this).data('value'));
        }
        $('#question-modal').modal('hide');
        updateScore();
    })
}