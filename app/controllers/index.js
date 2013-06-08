$.index.open();

var LDF =  Ti.Platform.displayCaps.logicalDensityFactor || 1;
var board_def = [
    ["A","B","J","R"],
    ["O","M","N","E"],
    ["P","O","L","T"],
    ["E","B","G","U"],
];

var dictionary = {
    "AMO": 8,
    "EPO": 8,
    "TE" : 5,
    "PONTE" : 25,
    "MOLTE" : 12,
    "MONTE" : 13,
    "BOMBA" : 34
};

var doIfValid = function(row, col, last_move, action){

    if( (row >= 0) &&
        (row < 4) &&
        (col >= 0) &&
        (col < 4) &&
        (
            (_.isUndefined(last_move)) ||
            (
                (Math.abs(last_move.col - col) <= 1) &&
                (Math.abs(last_move.row - row) <= 1)
            )
        )
        ){
        action();
    }
};

var populateBoardWith = function(board){
    [0,1,2,3].forEach(function(row){
        [0,1,2,3].forEach(function(col){
            populate(row,col,board[row][col]);
        });
    });
};

var populate = function(row,col,letter){
    $["letter_"+row+"_"+col].text = letter;
};

var select = function(row, col, last_move){
    doIfValid(row, col, last_move, function(){
        $["letter_"+row+"_"+col].backgroundColor = 'green';
    });
    
};

var clear = function(row,col){
    $["letter_"+row+"_"+col].backgroundColor = 'white';
};

var clearBoard = function(){
    [0,1,2,3].forEach(function(row){
        [0,1,2,3].forEach(function(col){
            clear(row,col);
        });
    });
};

var getCell = function(e){
    var col = e.x/(80*LDF); 
    var row = e.y/(80*LDF);
    if ((col - Math.floor(col) < 0.15) ||
        (col - Math.floor(col) > 0.85) ||
        (row - Math.floor(row) < 0.15) ||
        (row - Math.floor(row) > 0.85))
    {
        return {col:"NO",row:"NO"};
    }
    return {col : Math.floor(col),row : Math.floor(row)};
};

var getWord = function(moves, board_def){
    var word = _.reduce(moves, function(memo,move){
        return memo + board_def[move.row][move.col];
    }, "");
    return word;
};


var moves = [];
var added = [];
var addMove = function(cell, last_move){
    doIfValid(cell.row, cell.col,last_move,function(){
        if (!_.contains(added, cell.col + "_" + cell.row)){
            added.push(cell.col + "_" + cell.row);
            moves.push(cell);
        }
    });
};

var wordExists = function(word, dict){
    if (!_.isUndefined(dict[word])){
        return true;
    }
    return false;
};

var getWordColor = function(exists){
    var color = exists ? 'green' : 'red';
    return color;
}

$.touchTable.addEventListener('touchstart', function(e){
    clearBoard();
    var cell = getCell(e);
    addMove(cell);
    select(cell.row,cell.col);
});

$.touchTable.addEventListener('touchmove', function(e){
    $.debug.text = "(" + e.x +","+e.y+")";
    var cell = getCell(e);
    select(cell.row,cell.col, _.last(moves));
    addMove(cell, _.last(moves));
});


$.touchTable.addEventListener('touchend', function(e){
    clearBoard();
    var word = getWord(moves,board_def);
    $.currentWord.text = word;
    $.currentWord.color = getWordColor(wordExists(word,dictionary));
    moves = [];
    added = [];
});

populateBoardWith(board_def);


