var pmModule = angular.module('pmModule', ['ui.bootstrap', 'screenstructureModule', 'ui.bootstrap.carousel', 'ngSanitize']);

pmModule.controller('homePageCarousalController', ['$scope', function ($scope) {

    $scope.myInterval = 5000;
    var slides = $scope.slides = [
    { text: 'Image1', image: ' Images/Carousel/Carousel1.jpg' },
    { text: 'Image1', image: 'Images/Carousel/Carousel2.jpg' },
    { text: 'Image1', image: 'Images/Carousel/Carousel3.jpg' },
    { text: 'Image1', image: 'Images/Carousel/Carousel4.jpg' },
    { text: 'Image1', image: 'Images/Carousel/Carousel5.jpg' },
    { text: 'Image1', image: 'Images/Carousel/Carousel6.jpg' },
    { text: 'Image1', image: 'Images/Carousel/Carousel7.jpg' },
    { text: 'Image1', image: 'Images/Carousel/Carousel8.jpg' },

    ];

} ]);