﻿var pmModule = angular.module('pmModule', ['ui.bootstrap.carousel']);

pmModule.controller('homePageCarousalController', ['$scope',function ($scope) {

    $scope.myInterval = 5000;
    var slides = $scope.slides = [];
    $scope.addSlide = function () {
        var newWidth = 600 + slides.length;
        slides.push({
            image: 'http://placekitten.com/1200/300',
            text: ['More', 'Extra', 'Lots of', 'Surplus'][slides.length % 4] + ' ' +
              ['Cats', 'Kittys', 'Felines', 'Cutes'][slides.length % 4]
        });
    };
    for (var i = 0; i < 4; i++) {
        $scope.addSlide();
    }

}]);