 var app = angular.module('myApp', ['ngRoute']);

 app.config(function($routeProvider) {
 	$routeProvider.when('/', {
 		templateUrl : 'login.html',
		controller : 'loginController'
 	})
 	.when('/signUp', {
		templateUrl : 'signUp.html'
	})
 	.when('/home', {
		templateUrl : 'home.html'
	})
	.when('/addStudent', {
		templateUrl : 'addStudent.html',
		controller : 'addStudentController'
	})
	.when('/monitorClass', {
		templateUrl : 'monitorClass.html',
		controller : 'monitorClassController'
	})
	.when('/logout', {
		templateUrl : 'login.html',
		controller : 'loginController'
	})
 });

 app.controller('loginController', ['$scope', '$http', '$location', '$rootScope', function($scope, $http, $location, $rootScope) {
	$rootScope.username = $scope.username;

	$scope.login = function() {
		$http.post('/postdata', {
			'uname': $scope.username,
			'pwd' : $scope.password
		}).then(function(resp) {
			if (resp.data == 'Y') {
				$location.path('/home');
			} else {
				alert('Login failed');
			}
		})
	};

	$scope.signUp = function() {
		$location.path('/signUp');
	}

	$scope.register = function() {
		$http.post('/postdata2', {
			'username': $scope.newUsername,
			'password' : $scope.newPassword
		})
	};
	
}]);

app.controller('addStudentController',['$scope','$http', function($scope, $http) {
	$scope.classes = [
						{'id':1, 'name':'Class 1'},
						{'id':2, 'name':'Class 2'},
						{'id':3, 'name':'Class 3'},
						{'id':4, 'name':'Class 4'},
						{'id':5, 'name':'Class 5'},
						{'id':6, 'name':'Class 6'},
						{'id':7, 'name':'Class 7'},
						{'id':8, 'name':'Class 8'},
						{'id':9, 'name':'Class 9'},
						{'id':10, 'name':'Class 10'}
					];

	$scope.addStudent = function() {
		$http.post('/postdata3', {
			'class': $scope.data.multipleSelect,
			'sName' : $scope.studentName,
			'sAge' : $scope.age,
			'sub1' : $scope.subject1,
			'sub2' : $scope.subject2,
			'sub3' : $scope.subject3
		})
		$scope.data.multipleSelect = "";
		$scope.studentName = "";
		$scope.age = "";
		$scope.subject1 = "";
		$scope.subject2 = "";
		$scope.subject3 = "";
	};
}]);

app.controller('monitorClassController',['$scope', '$http', function($scope, $http) {
	$scope.classes = [
						{'id':'class1', 'name':'Class 1'},
						{'id':'class2', 'name':'Class 2'},
						{'id':'class3', 'name':'Class 3'},
						{'id':'class4', 'name':'Class 4'},
						{'id':'class5', 'name':'Class 5'},
						{'id':'class6', 'name':'Class 6'},
						{'id':'class7', 'name':'Class 7'},
						{'id':'class8', 'name':'Class 8'},
						{'id':'class9', 'name':'Class 9'},
						{'id':'class10', 'name':'Class 10'}
					];

	$scope.change = function() {
		$http.post('/postdata5', {
		'classId': $scope.classId
		}).then(function(resp) {
			$scope.studentNames = resp.data;
		})
	}				

	$scope.fetch = function() {
		$http.post('/postdata4', {
		'class': $scope.classId,
		'sName' : $scope.stuName
		}).then(function(resp) {
				//console.log(resp);
				$scope.age = resp.data.studentAge;
				$scope.subject1 = resp.data.csMarks;
				$scope.subject2 = resp.data.bioMarks;
				$scope.subject3 = resp.data.chemMarks;
				$scope.avg = (parseInt($scope.subject1) + parseInt($scope.subject2) + parseInt($scope.subject3))/3;
		})
	}
}]);