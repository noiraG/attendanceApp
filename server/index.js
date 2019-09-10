var moment = require("moment");
const functions = require("firebase-functions");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 5000;

var admin = require("firebase-admin");
var serviceAccount = require("./my-first-app-19b2e-firebase-adminsdk-dpp2a-5e17c786c8.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://my-first-app-19b2e.firebaseio.com"
});

const db = admin.database();

// creating a starting path in our database
const ref = db.ref("ASE");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//View all student, return all students
app.get("/api/student", (req, res) => {
  var studentlist = [];
  ref.once("value", function(snapshot) {
    var users = snapshot.val().users;
    Object.keys(users).forEach(k => {
      if (users[k].role == "S") {
        studentlist.push({
          key: k,
          value: users[k]
        });
      }
    });
    res.send(studentlist);
  });
});

//View all student, return 1 specific student
//url need to change, include reference key
app.post("/api/student/one", (req, res) => {
  ref
    .child("users")
    .orderByChild("matriculationNo")
    .equalTo(req.body.matriculationNo)
    .once("value", function(snapshot) {
      res.send(snapshot.val());
    });
});

//update a specific user based on the reference key
app.post("/api/student/update", (req, res) => {
  var newData = {
    matriculationNo: req.body.matriculationNo,
    name: req.body.name,
    username: req.body.username,
    password: req.body.password
  };
  ref
    .child("users")
    .child(req.body.referenceKey)
    .update(newData)
    .then(() => {
      res.send(true);
    })
    .catch(e => {
      res.send(e);
    });
});

//delete a specific student account based on referenceKey
app.post("/api/student/delete", (req, res) => {
  ref
    .child("users")
    .child(req.body.referenceKey)
    .remove()
    .then(() => {
      res.send(true);
    })
    .catch(e => {
      res.send(e);
    });
});

//Add student account
app.post("/api/student/add/", (req, res) => {
  parameterList = req.body;
  //check if user existed
  ref
    .child("users")
    .orderByChild("matriculationNo")
    .equalTo(parameterList.matriculationNo)
    .once("value", snapshot => {
      if (snapshot.exists()) {
        res.send(false);
      } else {
        /* To do: add in face */
        //add record into the firebase database
        ref
          .child("users")
          .push({
            matriculationNo: parameterList.matriculationNo,
            name: parameterList.name,
            username: parameterList.username,
            password: parameterList.password,
            role: "S"
          })
          .then(res.send(true));
      }
    });
});

//View all class, return all class
app.get("/api/class", (req, res) => {
  var classSession = [];
  ref
    .child("class")
    .orderByChild("date")
    .equalTo(moment().format("MM/DD/YYYY"))
    .once("value", function(snapshot) {
      var classes = snapshot.val();
      Object.keys(classes).forEach(k => {
        classSession.push({
          key: k,
          value: classes[k]
        });
      });
      res.send(classSession);
    });
});

//Add class session
app.post("/api/class/add/", (req, res) => {
  parameterList = req.body;

  //check if user existed
  ref
    .child("class")
    .orderByChild("date")
    .equalTo(moment().format("MM/DD/YYYY"))
    .once("value", snapshot => {
      if (snapshot.exists()) {
        var classSession = snapshot.val();
        Object.keys(classSession).forEach(k => {
          if (classSession[k].startingTime == parameterList.startingTime) {
            res.send(false);
          } else {
            if (
              classSession[k].classIndex == parameterList.classIndex &&
              classSession[k].courseIndex == parameterList.courseIndex
            ) {
              res.send(false);
            } else {
              ref
                .child("class")
                .push({
                  courseIndex: parameterList.courseIndex,
                  classIndex: parameterList.classIndex,
                  courseName: parameterList.courseName,
                  supervisor: parameterList.supervisor,
                  date: moment().format("MM/DD/YYYY"),
                  startingTime: parameterList.startingTime,
                  endingTime: parameterList.endingTime
                })
                .then(res.send(true))
                .catch(e => {
                  console.log(e);
                });
            }
          }
        });
      } else {
        ref
          .child("class")
          .push({
            courseIndex: parameterList.courseIndex,
            classIndex: parameterList.classIndex,
            courseName: parameterList.courseName,
            supervisor: parameterList.supervisor,
            date: moment().format("MM/DD/YYYY"),
            startingTime: parameterList.startingTime,
            endingTime: parameterList.endingTime
          })
          .then(res.send(true))
          .catch(e => {
            console.log(e);
          });
      }
    });
});

//delete a specific student account based on referenceKey
app.post("/api/class/delete", (req, res) => {
  ref
    .child("class")
    .child(req.body.referenceKey)
    .remove()
    .then(() => {
      res.send(true);
    })
    .catch(e => {
      res.send(e);
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));

//to host it on firebase, need to export as app
//exports.app = functions.https.onRequest(app);

//database record order
/*
users
matriculationNo, name, username, password, role, photo

class
courseIndex, classIndex, courseName, supervisor, date, startingTime, endingTime
*/
