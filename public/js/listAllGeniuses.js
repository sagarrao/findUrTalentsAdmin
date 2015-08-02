(function (angular) {
var app = angular.module('geniuses', ["firebase", "ui.bootstrap"]);
var ref = "https://torrid-heat-237.firebaseio.com/Users-sagar";

app.controller('GetAllGeniuses', ["$scope", 'GeniusFactory', 
    function($scope, GeniusFactory) {
	  $scope.users = GeniusFactory.users();
	  }]
	);
  
app.controller('GetOrUpdateGenius', ["$scope", "GeniusFactory", "$location","$window","$firebaseObject",
		function($scope, GeniusFactory, $location,$window,$firebaseObject) {
		  var userId = $location.search().id;
		  $scope.user = GeniusFactory.user(userId);
		  
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
				GeniusFactory.updateUser(user,userId);
			}
		}
	}
]);

  app.controller('SearchAGenius', ["$scope", "GeniusFactory","$window","$firebaseArray",
	function($scope,GeniusFactory,$window,$firebaseArray) {
      $scope.selected = '';
      $scope.usersArray = GeniusFactory.usersArray();
	  $scope.gotoAGenius = function(){
			var userId = JSON.parse(angular.element(document.getElementById("selectedUser")).val())['$id'];
			$window.location.href = '/genius#?id='+userId;
		};
    }
  ]);
  
  app.factory('GeniusFactory', ["$firebaseObject", "$firebaseArray","$http", "$location", function($firebaseObject,$firebaseArray,$http,$location) {
    //Create a users object
    var _users;
	var _usersArray;
	var _user;

    return {
      users: users,
	  usersArray:usersArray,
	  user : function getUser(id){
		_user = $firebaseObject(new Firebase(ref+"/"+id));
		return _user;
	  },
	  updateUser: function updateUser(user,index){
			_user.$save().
			then(function(ref) {
				console.log("USer updated..");
			}).catch(function(error) {
				console.error("Error:", error);
			});
		}
    }
	
	
	function usersArray(){
		if(!_usersArray)
			_usersArray = $firebaseArray(new Firebase(ref));
		return _usersArray;
	}

    function users() {
      //This will cache your users for as long as the application is running.
		  if (!_users) {
			_users = $firebaseObject(new Firebase(ref));
		  }
      return _users;
    }
	
  }]);
})(angular);