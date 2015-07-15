(function (angular) {
var app = angular.module('geniuses', ["firebase", "ui.bootstrap"]);

app.controller('GetAllGeniuses', ["$scope", 'GeniusFactory',
    function($scope, GeniusFactory) {
      $scope.users = GeniusFactory.users();
    }
  ]);
  
app.controller('GetOrUpdateGenius', ["$scope", "GeniusFactory", "$location","$window",
		function($scope, GeniusFactory, $location,$window) {
		  var index = $location.search().index;
		  $scope.user = '';
		  GeniusFactory.users().$loaded()
		  .then(function(users){
			$scope.user = users[index];
			}).catch(function(error) {
				console.error("Error:", error);
			});
		$scope.saveGeniusInfo = function(){
			var geniusForm = $scope.geniusInfoForm;
			if(geniusForm.$pristine)
				$window.alert("No values to update..");
			else{
				var user = $scope.user;
				if(geniusForm.geniusid.$dirty)
					user.geniusid = geniusForm.geniusid.$viewValue;
				if(geniusForm.geniusname.$dirty)
					user.geniusname = geniusForm.geniusname.$viewValue;
				GeniusFactory.updateUser(user,index);
			}
			//console.log("id changed--->"+$scope.geniusInfoForm.geniusid.$pristine);
			//console.log("name changed--->"+$scope.geniusInfoForm.geniusname.$pristine);
		}
	}
]);

  app.controller('SearchAGenius', ["$scope", "GeniusFactory","$window",function($scope,GeniusFactory,$window) {
      $scope.selected = '';
      $scope.usersArr = GeniusFactory.users();
	  $scope.gotoAGenius = function(){
			var userObjId = JSON.parse(angular.element(document.getElementById("selectedUser")).val())['$id'];
			var arr = $scope.usersArr;
			var index = -1;
			for(var i = 0; i < arr.length; i++){
				if(userObjId == arr[i].$id){
					index = i;
					break;
				}
			}
			console.log("index---->"+index);
			if(index != -1){
				$window.location.href = '/genius#?index='+index;
			}
			else{
				$window.alert("User not Found...");
			}
		};
    }
  ]);
  
  app.factory('GeniusFactory', ["$firebaseArray",  function($firebaseArray) {
    //Create a users object
    var _users;
	var ref = "https://torrid-heat-237.firebaseio.com/Users-sagar-array";

    return {
      users: users,
	  updateUser: function updateUser(user,index){
			_users[index] = user;
			console.log(_users.$keyAt(_users[index]));
			_users.$save(_users[index]).
			then(function(ref) {
				console.log("USer updated..");
			}).catch(function(error) {
				console.error("Error:", error);
			});
		}
    }
	
	

    function users() {
      //This will cache your users for as long as the application is running.
      if (!_users) {
        //_users = $firebaseArray(new Firebase("****"));
        _users = $firebaseArray(new Firebase(ref));
        /*_users = [{
          geniusid: "new",
          geniusname: "Harry"
        }, {
          "geniusid": "new",
          "geniusname": "Jean"
        }, {
          "geniusid": "news",
          "geniusname": "Mike"
        }, {
          "geniusid": "qazwsx",
          "geniusname": "Lynn"
        }];*/
      }
      return _users;
    }
	
  }]);
})(angular);