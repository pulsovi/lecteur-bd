(function() {
    var app = angular.module("lecteur", []);
    app.controller("BD", function($scope) {
        $scope.img = {};
        $scope.img.widthTypes = {
            "max-width": "limitée à",
            "width": "forcée à"
        };
        $scope.img.widthType = "width";
        $scope.img.widthVal = 85;
        $scope.img.height100 = "";
        $scope.$watch(function(){
        	return $scope.img.widthType + ($scope.img.widthType?(":"+$scope.img.widthVal+"%;"):"") + $scope.img.height100;
        }, function(oldV, newV){
        	$scope.img.style = newV;
        	$scope.img.widthAuto = !$scope.img.widthType;
        });


        document.getElementById("fichier").onchange = function extractFile(event) {
            var file = event.target.files[0],
                reader = new zip.BlobReader(file);
            zip.createReader(reader, zipCreateReaderCallback);
        };

        function zipCreateReaderCallback(zipReader) {
            zipReader.getEntries(getEntriesCallback);
        }

        function getEntriesCallback(entriesArray) {
            entriesArray.sort(entriesSort);
            $scope.images = entriesArray;
            extractNext({ arr: entriesArray, current: 0, loaded: 0, max: 8 });
        }

        function entriesSort(a, b) {
            return a.filename < b.filename ? -1 : a.filename > b.filename ? 1 : 0;
        }

        function extractNext(options) {
            if ((options.loaded >= options.max) || (options.current >= options.arr.length)) return;
            var i = options.current,
                cb = function(blob) {
                    --options.loaded;
                    options.arr[i].url = URL.createObjectURL(blob);
                    $scope.$digest();
                    extractNext(options);
                };
            entryExtract(options.arr[i], cb);
            ++options.current;
        }

        function entryExtract(entry, callback) {
            var blobWriter = new zip.BlobWriter();
            entry.getData(blobWriter, callback);
        }

        window.a = $scope;
    });
})();
