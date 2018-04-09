/**
     * Handles the sign in button press.
     */
    function toggleSignIn() {
        if (firebase.auth().currentUser) {
  
          // [START signout]
          firebase.auth().signOut();
          // [END signout]
        } else {
          var email = document.getElementById('email').value;
          var password = document.getElementById('password').value;
          if (email.length < 4) {
            alert('Please enter an email address.');
            return;
          }
          if (password.length < 4) {
            alert('Please enter a password.');
            return;
          }
          // Sign in with email and pass.
          // [START authwithemail]
          firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
            window.location = "Account.html";
          }).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode === 'auth/wrong-password') {
              alert('Wrong password.');
            } else {
              alert(errorMessage);
            }
            console.log(error);
            document.getElementById('sign-in').disabled = false;
            // [END_EXCLUDE]
          });
          // [END authwithemail]
         
        }
        document.getElementById('sign-in').disabled = true;
      }
      /**
       * Handles the sign up button press.
       */
      function handleSignUp() {
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        var name = document.getElementById('displayName').value;
        if (email.length < 4) {
          alert('Please enter an email address.');
          return;
        }
        if (password.length < 4) {
          alert('Please enter a password.');
          return;
        }
        // Sign in with email and pass.
        // [START createwithemail]
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user){              
            firebase.database().ref().child('users').child(user.uid).set({//create a new node with their unique id
              userId : user.uid,//set the userid to their id
              email : user.email,//set the email as their email
              })
              window.location = "Account.html";
      
        }).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // [START_EXCLUDE]
          if (errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
          } else {
            alert(errorMessage);
          }
          console.log(error);
          // [END_EXCLUDE]
        });
        // [END createwithemail]
        
      }
      /**
       * Sends an email verification to the user.
       */
      function sendEmailVerification() {
        // [START sendemailverification]
        firebase.auth().currentUser.sendEmailVerification().then(function() {
          // Email Verification sent!
          // [START_EXCLUDE]
          alert('Email Verification Sent!');
          // [END_EXCLUDE]
        });
        // [END sendemailverification]
      }
      function sendPasswordReset() {
          window.location = 'password_reset.html';
        var email = document.getElementById('email').value;
        // [START sendpasswordemail]
        firebase.auth().sendPasswordResetEmail(email).then(function() {
          // Password Reset Email Sent!
          // [START_EXCLUDE]
          alert('Password Reset Email Sent!');
          // [END_EXCLUDE]
        }).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // [START_EXCLUDE]
          if (errorCode == 'auth/invalid-email') {
            alert(errorMessage);
          } else if (errorCode == 'auth/user-not-found') {
            alert(errorMessage);
          }
          console.log(error);
          // [END_EXCLUDE]
        });

        logout();
        // [END sendpasswordemail];
      }
      /**
       * initApp handles setting up UI event listeners and registering Firebase auth listeners:
       *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
       *    out
       */
      function initApp() {
          
        // Listening for auth state changes.
        // [START authstatelistener]
        firebase.auth().onAuthStateChanged(function(user) {
          // [START_EXCLUDE silent]
          //document.getElementById('quickstart-verify-email').disabled = true;
          // [END_EXCLUDE]
          var user = firebase.auth().currentUser;
  
          if (user) {
  
            // User is signed in.
            user.updateProfile({
                displayName : name
            })
            var displayName = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var photoURL = user.photoURL;
            var isAnonymous = user.isAnonymous;
            var uid = user.uid;
            var providerData = user.providerData;
     
            // [START_EXCLUDE]
            //document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
            //document.getElementById('sign-in').textContent = 'Logout';
            //document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
            
            // [END_EXCLUDE]
          } else {
            // User is signed out.
            // [START_EXCLUDE]
            //document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
            //document.getElementById('sign-in').textContent = 'Login';
            //document.getElementById('quickstart-account-details').textContent = 'null';
            // [END_EXCLUDE]
          }
          // [START_EXCLUDE silent]
          //document.getElementById('sign-in').disabled = false;
          // [END_EXCLUDE]
        });
        // [END authstatelistener]
        document.getElementById('sign-in').addEventListener('click', toggleSignIn, false);
        document.getElementById('sign-up').addEventListener('click', handleSignUp, false);
        //document.getElementById('quickstart-verify-email').addEventListener('click', sendEmailVerification, false);
        //document.getElementById('quickstart-password-reset').addEventListener('click', sendPasswordReset, false);
      }
      window.onload = function() {
        initApp();
      };

      function saveChanges(){
         var user = firebase.auth().currentUser;
         console.log(user);
          var name = document.getElementById('fullName').innerText;
          console.log(name);
          var username = document.getElementById('userName').innerText;
          var interests = document.getElementById('userInterests').innerText;
          var about = document.getElementById('aboutUser').innerText;
          var product = document.getElementById('userProducts').innerText;
          var url = document.getElementById('profilePic').value;
         
          user.updateProfile({
              displayName: userName,
              photoURL: url
          })
          
          
          firebase.database().ref().child('users').child(user.uid).set({//create a new node with their username
            username: username,
            email: user.email,
            fullname: name,
            interests: interests,
            about: about,
            product: product,
            //profile: url
    
         }).then(function(){
             window.location = "Account.html";  
         })      
      }
      function getData(){
        document.getElementById("loader").style.display = "none";
        var user = firebase.auth().currentUser;
        var heading = document.getElementById("accountHeading");
        var fullName = document.getElementById("fullName");
        var userName = document.getElementById("userName");
        var userEmail = document.getElementById('email');
        var aboutMe = document.getElementById('aboutUser');
        var myProducts = document.getElementById('userProducts');
        var myInterests = document.getElementById('userInterests');

          var picture = document.getElementById('profilePic');
          var list = document.getElementById('list');
          picture.src = user.photoURL;
          //var headingRef  = firebase.database().ref().child('users').child(user.uid).child('username');
         // headingRef.on('value' , function(snapshot){
            //  heading.innerText = "Welcome back " + snapshot.val();
          //});

          firebase.database().ref().child('users').child(user.uid).on('value', function(snapshot){
            var name = snapshot.child('fullname').val();
            fullName.innerText = name;
            var username = snapshot.child('username').val();
            userName.innerText = username;
            var usersEmail = snapshot.child('email').val();
            userEmail.innerText = usersEmail;
            var userAbout = snapshot.child("about").val();
            aboutMe.innerText = userAbout;
            var products = snapshot.child('product').val();
            myProducts.innerText =  products;
            var interests = snapshot.child('interests').val();
            myInterests.innerText =  interests;
              //snapshot.forEach(function(item){
                //  list.innerText = JSON.stringify(snapshot.val(), null, 8);
              //}) 
          })
        
      }
function logout(){
    firebase.auth().signOut();
    window.location = "login.html";
}
      
  function editProfile(){
    document.getElementById("uploadButton").style.display = "block";
    var user = firebase.auth().currentUser;
    var spans = document.getElementsByClassName("span");
    for (var i = 0, len = spans.length; i < len; ++i) {
      spans[i].contentEditable = "true";
    }
    var btn = document.createElement("BUTTON");        
    var t = document.createTextNode("Save Changes");       
    btn.appendChild(t);                                
    document.getElementById('AccountPageButtons').appendChild(btn);
    var uploader = document.getElementById("progressBar");
    var filebutton = document.getElementById("filebutton");
    filebutton.addEventListener('change', function(e){
    var file = e.target.files[0];
    var storageRef = firebase.storage().ref('user_pics' + file.name);
    var task = storageRef.put(file);
    task.on('state_changed',
        function progress(snapshot){
            var percentage = (snapshot.bytesTransferred / snapshot.totalBytes)*100;
            uploader.value = percentage;
        },
        
        function error(err){
            console.log("can't do it");
        },

        function complete(){
          downloadURL = task.snapshot.downloadURL;
          var display = document.getElementById("profilePic");
          display.src = downloadURL;
          display.value = downloadURL;
          
        }
    );
});
    btn.addEventListener('click', saveChanges);
    

  }
  function loading(){
    myvar = setTimeout(getData, 2000);
  }