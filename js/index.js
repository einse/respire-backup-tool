const fs = require('fs');

var txtEmail = document.getElementById('txtEmail');
var txtPassword = document.getElementById('txtPassword');
var txtDate = document.getElementById('txtDate');
var txtDays = document.getElementById('txtDays');

function writeLine (data) {
  fs.appendFileSync(config.authDomain + '.txt', data + '\n');
}

function load (date) {
  try {
    var userId = firebase.auth().currentUser.uid;
  } catch(error) {
    return;
  }
  var dateId = date;
  var dbRefUserData = firebase.database().ref('/users/' + userId + '/sets/');
  dbRefUserData.child(dateId).once('value').then(function (snapshot) {
    var entries = {};
    entries = snapshot.val();
    if (entries !== null) {
      iterator = 1;
      while (iterator < 1000) {
        var entryId = dateId + '-e' + iterator;
        var entry = entries[entryId];
        var pureEntry = '';
        if (entry) {
          for (var symbolsIterator in entry) {
            if (entry[symbolsIterator] === '\n') {
              pureEntry += '\\n';
            } else if (entry[symbolsIterator] === '\u0009') {
              pureEntry += '\\t';
            } else {
              pureEntry += entry[symbolsIterator];
            }
          }
          var finalString = dateId + '\t' + entryId + '\t' + pureEntry;
          writeLine(finalString);
        } else {
          break;
        }
        iterator++;
      }
      console.log(dateId+':', iterator-1); // compare with 2 other ways
                                           // of decreasing the iterator!
    } else {
      console.log('No entries at that date.');
    }
  });
}

console.log("Ready.");

function interpretLoginOrSignupError (error) {
  console.log(error.message);
};

function onSuccessfulLogin () {
  console.log("Logged in.");
  // Empty login/signup fields
  txtEmail.value = '';
  txtPassword.value = '';
  // Prepare for loading...
  $('#btnLoad').click(() => {
    var date = txtDate.value;
    var howManyDaysForward = Number(txtDays.value);
    load(date);
    for (var i = 0; i < howManyDaysForward; i++) {
      date = C$.next(date);
      load(date);
    }
    console.log('The right bound is', date);
  });
};

function logIn (email, pass) {
  var auth = firebase.auth();
  // Log in
  var promise = auth.signInWithEmailAndPassword(email, pass);
  promise.then(onSuccessfulLogin).catch(interpretLoginOrSignupError);
};

// Initialize Firebase
// Respire 3
var config = {
  apiKey: "AIzaSyC4upjsxpRwXa26Sf8pv1EuJ_Rxnz7nwew",
  authDomain: "respire3-hi.firebaseapp.com",
  databaseURL: "https://respire3-hi.firebaseio.com"
};

firebase.initializeApp(config);

$('#btnLogin').click(function () {
  var email = txtEmail.value;
  var pass = txtPassword.value;
  logIn(email, pass);
});
