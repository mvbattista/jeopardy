var app = angular.module('jeopardy',[]);
    app.controller('MainCtrl', function($scope){
        $scope.game = { "jeopardy":[], "double-jeopardy":[], "final-jeopardy":{} };
        $scope.load = function(){
            $scope.game = JSON.parse($scope.pre);
        };
        $scope.addCategory = function(){
            $scope.game.push({
                name:$scope.categoryName,
                questions:[]
            });
            $scope.categoryName = "";
        };
        $scope.addQuestion = function(category){
            category.questions.push({
                question:$scope.questionText,
                value:0,
                answers:[]
            });
            $scope.questionText = "";
        };
        $scope.addAnswer = function(question){
            question.answers.push({
                text:$scope.answerText,
                correct:false
            });
            $scope.answerText = "";
        };
    });