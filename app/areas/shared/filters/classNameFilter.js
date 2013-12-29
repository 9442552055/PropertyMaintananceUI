sharedModule.filter('classNameFilter', function () {
    return function (input) {
        var stringToReturn = input.replace('.', '-') + "-color";
        return stringToReturn;
    };
});