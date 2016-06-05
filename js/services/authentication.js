myApp.factory('Authentication', 
	['$rootScope', '$firebaseAuth', '$firebaseObject', '$location',
	function($rootScope, $firebaseAuth, $firebaseObject, $location){
	
	var auth = $firebaseAuth();

	auth.$onAuthStateChanged(function(authUser){
		if (authUser){
			var userRef = database.ref('users/' + authUser.uid);
			var userObj = $firebaseObject(userRef);
			$rootScope.currentUser = userObj;
		} else {
			$rootScope.currentUser = '';
		}
	});

	var myObject = {
		login: function(user){
			auth.$signInWithEmailAndPassword(
				user.email, 
				user.password
			).then(function(regUser){
				$location.path('/success');
			}).catch(function(error){
				$rootScope.message = error.message;
			});
			$rootScope.message = "Welcome " + user.email;
		},

		logout: function() {
			return auth.$signOut();
		},

		requireAuth: function(){
			return auth.$requireSignIn();
		},

		register: function(user){
			auth.$createUserWithEmailAndPassword(
				user.email,
				user.password
			).then(function(regUser){		
				database.ref('users/' + regUser.uid).set({
					date: firebase.database.ServerValue.TIMESTAMP,
					regUser: regUser.uid,
					firstname: user.firstname,
					lastname: user.lastname,
					email: user.email
				}); //register user in DB	

				myObject.login(user);
				
			}).catch(function(error){
				$rootScope.message = error.message;
			});
		}
	};

	return myObject;
}]);