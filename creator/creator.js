var app = angular.module('jeopardy-creator',[]);
    app.controller('CreatorCtrl', function($scope){
        $scope.main = {};
        
        $scope.board = {
          "jeopardy": [
          ],
          "double-jeopardy": [
          ],
          "final-jeopardy": {
              "answer": "Who is some guy in Normandy But I just won $75,000!",
              "category": "MILITARY MEN",
              "question": "On June 6, 1944 he said, \"The eyes of the world are upon you\""
          }
        };

        $scope.load = function(){
            $scope.board = JSON.parse($scope.pre);
        };
        $scope.addCategory = function(round){
            round.push({
                name:"AN ALBUM COVER",
                questions:[]
            });
        };
        $scope.addQuestion = function(category){
            category.questions.push({
                question:"THE BEATLES WHITE ALBUM IS THIS COLOR.",
                value:0,
                answer:"Who are the Beatles?"
            });
        };
        $scope.addImage = function(question) {
          question.image = "";
        };
        $scope.removeImage = function(question) {
          delete question.image;
        };
    });