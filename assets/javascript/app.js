// 1. Initialize Firebase
var config = {
    apiKey: "AIzaSyCCKh3qvjQGAoLefMJZGGQGrIuUjdsZkHw",
    authDomain: "week-7-trainscheduler.firebaseapp.com",
    databaseURL: "https://week-7-trainscheduler.firebaseio.com",
    storageBucket: "week-7-trainscheduler.appspot.com",
    messagingSenderId: "824658260851"
  };

  firebase.initializeApp(config);

var database = firebase.database();

// 2. Button for adding Train, when click the button it run the synonomous function
$("#add-train-btn").on("click", function() {

  // Grabs user input, variable for each one and grab each value from the input in html 
  var trainName = $("#train-name-input").val().trim();
  var trainDestination = $("#destination-input").val().trim();
  var trainFirst = moment($("#train-first-input").val().trim(), "HH:mm").format("");
//FIX moment.js this need to be HH:mm-military time  
  //using moment.js to grab start date, trim it, format it to DD/MM/YY then reformat it to "X" which is a timestamp
  var trainFrequency = $("#frequency-input").val().trim();

  // Creates local "temporary" object for holding Train data
  // creating a new object to incorporate the variable above, new object to incoparate new key to be equal to variable
  var newTrain = {
    name: trainName,
    destination: trainDestination,
    first: trainFirst,
    frequency: trainFrequency
  };

  // Uploads new Train data to the database
  //var newTrain is push to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.first);
  console.log(newTrain.frequency);

  // Alert when new train is added
  alert("Train successfully added");

  // Clears all of the text-boxes
  //taking the input in html and making it blank in input field
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#train-first-input").val("");
  $("#frequency-input").val("");

  // Prevents moving to new page
  return false;
});

// 3. Create Firebase event for adding Train to the database and a row in the html when a user adds an entry
// child_added means function will run on page load and when a new child is added
// this will not run even if child is updated
database.ref().on("child_added", function(childSnapshot, prevChildKey) {

  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDestination = childSnapshot.val().destination;
  var trainFirst = childSnapshot.val().first;
  var trainFrequency = childSnapshot.val().frequency;

  // Train Info
  console.log(trainName);
  console.log(trainDestination);
  console.log(trainFirst);
  console.log(trainFrequency);


  var firstTimeConverted = moment(trainFirst, "hh:mm").subtract(1, "years");
      console.log(firstTimeConverted);

      // Current Time
      var currentTime = moment();
      console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

      // Difference between the times
      var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
      console.log("DIFFERENCE IN TIME: " + diffTime);
 
      // Time apart (remainder)
      var tRemainder = diffTime % trainFrequency;
      console.log(tRemainder);
 
      // Minute Until Train
      var tMinutesTillTrain = trainFrequency - tRemainder;
      console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);
 
      // Next Train
      var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm A");
      console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm A"));

  // Add each train's data into the table
  //adding a row to the tbody
  $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" +
  trainFrequency + "</td><td>" + nextTrain + "</td><td>" + tMinutesTillTrain + "</td></tr>");
});