// Usage:
// 1. Put <sa-photoupload></sa-photoupload> in any html file
// 2. A photo upload widget will appear in place of the <sa-photoupload> html tag, with html generated from sa-sa-photoupload.html
// 3. The logic for the sa-photoupload directive is contained in the controller below
//
// This code is largely borrowed from https://github.com/nukulb/s3-angular-file-upload and https://github.com/danialfarid/angular-file-upload,
// so look at those repos for specifics about the below directive.


angular.module('thesisApp')
  .directive('saPhotoupload', function() {
    return {
      templateUrl: 'app/sa-photoupload/sa-photoupload.html',
      restrict: 'EA',
      controller: function($scope, $http, $upload, $rootScope, Auth) {
        $scope.imageUploads = [];
        $scope.abort = function(index) {
          $scope.upload[index].abort();
          $scope.upload[index] = null;
        };

        $scope.onFileSelect = function($files) {
          $scope.files = $files;
          $scope.upload = [];
          for(var i = 0; i < $files.length; i++) {
            var file = $files[i];
            file.progress = parseInt(0);
            (function(file, i) {
              $http.get('/api/s3Policy?mimeType=' + file.type).success(function(response) {
                var s3Params = response;
                $scope.upload[i] = $upload.upload({
                  url: 'https://' + $rootScope.config.awsConfig.bucket + '.s3.amazonaws.com/',
                  method: 'POST',
                  transformRequest: function(data, headersGetter) {
                    //Headers change here
                    var headers = headersGetter();
                    delete headers['Authorization'];
                    return data;
                  },
                  data: {
                    'key': 'ihammer/' + Math.round(Math.random() * 10000) + '$$' + file.name,
                    'acl': 'public-read',
                    'Content-Type': file.type,
                    'AWSAccessKeyId': s3Params.AWSAccessKeyId,
                    'success_action_status': '201',
                    'Policy': s3Params.s3Policy,
                    'Signature': s3Params.s3Signature
                  },
                  file: file
                });
                $scope.upload[i]
                  .then(function(response) {
                    file.progress = parseInt(100);
                    if(response.status === 201) {
                      var data = xml2json.parser(response.data);
                      var parsedData = {
                        location: data.postresponse.location,
                        bucket: data.postresponse.bucket,
                        key: data.postresponse.key,
                        etag: data.postresponse.etag
                      };

                      $scope.imageUploads.push(parsedData);

                      //save image urls to workers / clients
                      var imageUrls = [];
                      $scope.imageUploads.forEach(function(user){
                        imageUrls.push(user.location);
                      });

                      Auth.setImages(imageUrls);
                    } else {
                      alert('Upload Failed');
                    }
                  }, null, function(evt) {
                    file.progress = parseInt(100.0 * evt.loaded / evt.total);
                  });
              });
            }(file, i));
          }
        };
      }
    };
  });
