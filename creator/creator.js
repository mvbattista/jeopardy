var app = angular.module('jeopardy',[]);
    app.controller('MainCtrl', function($scope){
        $scope.main = {};
        
        $scope.board = {
          "jeopardy": [
          ],
          "double-jeopardy": [
          ],
          "final-jeopardy": {
              "answer": "",
              "category": "",
              "question": ""
          },
        };
        
        $scope.load = function(){
            $scope.board = JSON.parse($scope.pre);
        };
        $scope.addCategory = function(round){
            round.push({
                name:"Category",
                questions:[]
            });
        };
        $scope.addQuestion = function(category){
            category.questions.push({
                question:"WHAT ALEX SAYS",
                value:0,
                answer:"What is a ...?"
            });
        };
        $scope.addImage = function(question) {
          question.image = "";          
        };
        $scope.removeImage = function(question) {
          delete question.image;          
        };
    });