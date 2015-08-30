/*Image Uploader Module

Create a REST API for saving image and label, image must be stored in DB(base64 or
binary), listing of all images with labels, and on front­end create a single page AngularJS app
which will consume APIs, ie functionality for uploading image and label, and a list view for
diplsaying all images with associated labels. REST API must be done with Node.js/Express or
with Laravel framework
    
*/

(function () {

    "use strict";

    var app = angular.module("ImageUploader", ["ngRoute"]);
        
    //Performing routing for SPA.    
    app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider.when('/', {
            controller:  "GalleryContoller",
            templateUrl: "/views/GalleryView.html" 
        });
        $routeProvider.when('/Gallery', {
            controller:  "GalleryContoller",
            templateUrl: "/views/GalleryView.html" 
        });
        $routeProvider.when('/UploadImage', {
            controller: "UploaderController",
            templateUrl:"/views/UploaderView.html"
        });
        $routeProvider.otherwise({
            redirectTo: "/"
        });

        $locationProvider.html5Mode({
            enabled: true
        });
    }]);

    //Responsible for Ajax request.
    app.service("UploaderService", ["$http", function ($http) {
        this.getImages = function () {
            var promise = $http({
                url: "/GetImages",
                method: 'GET'
            }).success(function (data, status, header, config) {
                return data;
            }).error(function (data, status, header, config) {
                return data;
            });
            return promise;
        };

        this.uploadImageData = function (imageObj) {
             var promise = $http.post('/UploadImageData', imageObj).success(function (data, status, header, config) {
                return data;
            }).error(function (data, status, header, config) {
                return data;
            });
            return promise;
        };
    }]);

    //Responsible to generate data.
    app.factory("AppDataFactory", ["UploaderService", "$q", function (UploaderService, $q) {
        
        var factory = {};
        var imageData = [];
        factory.getImageData = function () {
            var deferred = $q.defer();
            UploaderService.getImages().then(function(data){
                imageData = [];
                imageData.push.apply(imageData, data.data);
                deferred.resolve(imageData);

            }, function(errorData){
                deferred.reject("Failed");
            });
            return deferred.promise;
        }

        factory.uploadImage = function(newImg){
            var deferred = $q.defer();
            UploaderService.uploadImageData(newImg).then(function(data){
                deferred.resolve("Done");
                imageData.push(newImg);

            }, function(errorData){
                deferred.reject("Failed");
            });
            
            return deferred.promise;
        }

        return factory;
    }]);

    //It updates gallery.
    app.controller("GalleryContoller", ['$scope', 'AppDataFactory', function ($scope, AppDataFactory) {
        var promise = AppDataFactory.getImageData();
        promise.then(function(data){
            $scope.images = data;
        }, function(errorData){
            alert("Something went wrong while getting the data. Please try agian..");

        });
    }]);

    //Responsible for image uploading.
    app.controller("UploaderController", ['$scope', 'AppDataFactory', function ($scope, AppDataFactory) {
        $scope.url = "";
        $scope.label = "";
        var isUploadingInProgress = false;
        $scope.handleActiion = function(eventInfo){

                switch (eventInfo.target.id){

                    case "UploadBtn":
                    if(isUploadingInProgress){
                        alert("Uploading is in progress. Please wait for sometime");
                        break;
                    }
                    if(!processUploading()){
                        return;
                    }
                    isUploadingInProgress = true;
                    var promise = AppDataFactory.uploadImage({url:$scope.url, label:$scope.label});
                    promise.then(function(data){
                        isUploadingInProgress = false;
                        alert("Image uploaded successfully. Please check gallery");
                    }, function(errorData){
                        isUploadingInProgress = false;
                        alert("Something went wrong. Please try agian..");
                    });
                    break;
                    case "ResetBtn":
                    $scope.url = "";
                    $scope.label = "";
                    break;
                }

        }

        //It checks if all input given by user or
        function processUploading () {
            var message = "";
            if($scope.url.length === 0){
                message = "Please select image.";
            }
            if($scope.label.length === 0){
                message += " Please update the label";   
            }
            if(message.length > 0){
                alert(message);
                return false;
            }
            return true;
        }


    }]);

    /*It picks the file from client machine and convert it in base64 format
      There is no validation of file type assuming the user will only pick image file.
    */
    app.directive("fileUploader", [function () {
        var dirInfo = {
            restrict: "A",
            replace: true,
            scope: "=",
            link: function (scope, ele, attrs) {       
                ele.bind("change", function (eventInfo) {
                    var reader = new FileReader();
                    var file = ele[0].files[0];
                    reader.onloadend = function (eventInfo) {
                        document.getElementById('PreviewImage').src = eventInfo.srcElement.result;
                        scope.url = eventInfo.srcElement.result;
                        scope.$digest();
                    };
                    reader.readAsDataURL(file);
                });
                scope.$on("$destroy", function () {
                    ele.unbind("change");
                });
            }
        }
        return dirInfo;
    }])
})();