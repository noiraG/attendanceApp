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

app.get("/api/hello", (req, res) => {
  console.log("someone access hello");
  res.json({ express: "Hello From Express" });
  //   refStudent.push({
  //     matriculationNo: "U2354670A",
  //     name: "hui hui Long",
  //     username: "Huihui01",
  //     password: "P@ssw0rd",
  //     role: "S"
  //   });
});

//View all student, return all students
app.get("/api/student", (req, res) => {
  var list = [];
  ref.once("value", function(snapshot) {
    var users = snapshot.val().users;
    Object.keys(users).forEach(k => {
      if (users[k].role == "S") {
        list.push(users[k]);
      }
    });
  });
  res.send(list);
});

//View all student, return 1 specific student
app.post("/api/student/one", (req, res) => {
  var targetMatriculation = req.body;
  ref.once("value", function(snapshot) {
    var users = snapshot.val().users;
    Object.keys(users).forEach(k => {
      if (users[k].matriculationNo == targetMatriculation) {
        res.send(users[k]);
      }
    });
  });
});

//Add account
app.post("/api/student/add", (req, res) => {
  parameterList = req.body;
  console.log(parameterList);
  //   refStudent.push({
  //     matriculationNo: "U2354670A",
  //     name: "hui hui Long",
  //     username: "Huihui01",
  //     password: "P@ssw0rd",
  //     role: "S"
  //   });
});

app.post("/api/world", (req, res) => {
  console.log(req.body);
  res.send(
    `I received your POST request. This is what you sent me: ${req.body.post}`
  );
});

app.listen(port, () => console.log(`Listening on port ${port}`));

//exports.app = functions.https.onRequest(app);
