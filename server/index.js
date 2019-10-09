var moment = require("moment");
const functions = require("firebase-functions");
const express = require("express");
const bodyParser = require("body-parser");
global.fetch = require("node-fetch");
const fileUpload = require("express-fileupload");
const app = express();
const port = process.env.PORT || 5000;

const fs = require("fs");
const path = require("path");
var cors = require("cors");
const canvas = require("canvas");
const faceapi = require("face-api.js");

var admin = require("firebase-admin");
var serviceAccount = require("./ay2019-cz3002-alphapro-firebase-adminsdk-xw615-a870aba412");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ay2019-cz3002-alphapro.firebaseio.com/"
});

const db = admin.database();

const asyncMiddleware = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// creating a starting path in our database
const ref = db.ref("ASE");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

var model;

//login - retrieve user based on username and password
app.post(
  "/login",
  asyncMiddleware(async (req, res) => {
    /* note:
          This function require the front end to POST req's body with:
          1. username
          2. password
          If record matched, the detail of the user will be send back:
          1. candidate: {
            referenceKey,
            matriculationNo,
            name,
            password,
            username
          }
          else:
          1. send back false
        */
    console.log("login");
    console.log(req.body.username);
    let snapshot = await new Promise((resolve, reject) =>
      ref
        .child("users")
        .orderByChild("username")
        .equalTo(req.body.username)
        .once("value", resolve)
    );
    accountCandidates = snapshot.val();
    if (snapshot.exists()) {
      for (k in accountCandidates) {
        console.log("account password is: ", accountCandidates[k].password);
        console.log("req password is: ", req.body.password);
        if (accountCandidates[k].password == req.body.password) {
          candidate = {
            referenceKey: k,
            name: accountCandidates[k].name,
            password: accountCandidates[k].password,
            username: accountCandidates[k].username,
            admin: accountCandidates[k].role == "A" ? true : false
          };
          console.log(candidate);
          res.send(candidate);
        } else {
          //wrong password
          res.send({ status: false, message: "Wrong Password" });
        }
      }
    }
  })
);

//View all student, return all students
app.get(
  "/api/student",
  asyncMiddleware(async (req, res) => {
    /* note:
          This function require the front end to get the api:
            it will return with a list of student:
            studentlist: [
              {
                matriculationNo,
                value: {
                  name,
                  password,
                  role,
                  username
                }
              },
              {
                matriculationNo,
                value
              }
            ]
        */
    var studentlist = [];
    let snapshot = await new Promise((resolve, reject) =>
      ref.child("users").once("value", resolve)
    );
    var users = snapshot.val();

    for (i in users) {
      if (users[k].role == "S") {
        studentlist.push({
          key: k,
          value: users[k]
        });
      }
    }
    res.send(studentlist);
  })
);

//View 1 student, return 1 specific student
//url need to change, include reference key
app.post(
  "/api/student/one",
  asyncMiddleware(async (req, res) => {
    /* note:
          This function require the front end to POST req's body with:
            1. matriculationNo
          If record matched, the detail of the user will be send back:
            student:
            {
              MatriculationNo,
              value: {
                name,
                password,
                role,
                username
              }
            }
        */
    let snapshot = await new Promise((resolve, reject) =>
      ref
        .child("users")
        .orderByKey()
        .equalTo(req.body.matriculationNo)
        .once("value", resolve)
    );

    if (snapshot.exists()) {
      var users = snapshot.val();
      for (k in users) {
        student = { key: k, value: users[k] };
        res.send(student);
      }
    } else {
      res.send(false);
    }
  })
);

//update a specific user based on the reference key
app.post("/api/student/update", (req, res) => {
  /* note:
    This function require the front end to POST req's body with:
    1. matriculationNo
    2. name
    3. username
    4. password
    If record updated, send back true
*/

  var newData = {
    name: req.body.name,
    username: req.body.username,
    password: req.body.password
  };
  ref
    .child("users")
    .child(req.body.matriculationNo)
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
  /* note:
          This function require the front end to POST req's body with:
            1. matriculationNo of specific student
          If record is removed, send back true
        */

  ref
    .child("users")
    .child(req.body.matriculationNo)
    .remove()
    .then(() => {
      res.send(true);
    })
    .catch(e => {
      res.send(e);
    });
});

//Add student account
app.post(
  "/api/student/add/",
  asyncMiddleware(async (req, res) => {
    /* note:
          This function require the front end to POST req's body with:
            1. matriculationNo
            2. name
            3. username
            4. password
            5. descriptor
          The function will check if the user matriculationNo existed before:
            If yes, send back false
            else, add the student account
              If record is added, send back true
        */
    console.log("adding student");
    parameterList = req.body;
    //check if user existed
    let patchDesc = [];

    let descriptorSet = req.body.descriptor;
    for (eachDesc in descriptorSet) {
      console.log("singluar descriptor");
      let des = Float32Array.from(
        Object.values(descriptorSet[eachDesc].descriptor),
        x => x
      );
      patchDesc.push(des);
    }
    console.log("patchDesc: ", patchDesc);
    // let des = Float32Array.from(
    //   Object.values(parameterList.descriptor),
    //   x => x
    // );

    let result = new faceapi.LabeledFaceDescriptors(
      parameterList.matriculationNo,
      patchDesc
    );

    ref
      .child("users")
      .orderByChild("matriculationNo")
      .equalTo(parameterList.matriculationNo)
      .once("value", snapshot => {
        if (snapshot.exists()) {
          res.send(false);
        } else {
          /* To do: add in face photo*/
          //add record into the firebase database
          ref
            .child("users")
            .child(parameterList.matriculationNo)
            .set({
              name: parameterList.name,
              username: parameterList.username,
              password: parameterList.password,
              role: "S",
              descriptor: result
            })
            .then(res.send(true));
        }
      });
  })
);

//View all class, return all class
app.get(
  "/api/class",
  asyncMiddleware(async (req, res) => {
    /* note:
          This function require the front end to get the api:
            it will return with a list of class based on today date:
              classSession: [
                      {
                        key,
                        value: {
                          classIndex,
                          courseIndex,
                          courseName,
                          date,
                          endingTime,
                          startingTime,
                          supervisor
                        }
                      },
                      {
                        key,
                        value
                      }
                    ]
        */

    console.log("getting class session");

    var classSession = [];
    let snapshot = await new Promise((resolve, reject) =>
      ref
        .child("class")
        .orderByChild("date")
        .once("value", resolve)
    );
    var classes = snapshot.val();
    console.log("class: ", classes);
    for (i in classes) {
      classSession.push({
        key: i,
        value: classes[i]
      });
    }
    console.log("returning class session", classSession);
    res.send(classSession);
  })
);

//Add class session
app.post(
  "/api/class/add/",
  asyncMiddleware(async (req, res) => {
    /* note:
          This function require the front end to POST req's body with:
            1. array of student matriculationNo
            2. startingTime
            3. endingTime
            4. classIndex
            5. courseIndex
            6. courseName
            7. supervisor
          The function will check if the user class existed before:
            If yes, send back false
            else, add the class session
              If record is added, then add attendance record of students taking the class
        */
    console.log("add class called");
    incr = 0;
    parameterList = req.body.class;
    matriculationNo = req.body.matriculationNo;
    classPath = "";
    let flag = false;
    //check if user existed
    let snapshot = await new Promise((resolve, reject) =>
      ref
        .child("class")
        .orderByChild("date")
        .equalTo(moment().format("MM/DD/YYYY"))
        .once("value", resolve)
    );
    if (snapshot.exists()) {
      var classSession = snapshot.val();
      console.log("class session is: ", classSession);

      for (classSessionKey in classSession) {
        if (
          classSession[classSessionKey].startingTime ==
            parameterList.startingTime ||
          (classSession[classSessionKey].classIndex ==
            parameterList.classIndex &&
            classSession[classSessionKey].courseIndex ==
              parameterList.courseIndex)
        ) {
          flag = true;
        }
      }

      if (flag) {
        res.send(false);
      } else {
        console.log("classPath getting");
        classPath = await ref.child("class").push({
          courseIndex: parameterList.courseIndex,
          classIndex: parameterList.classIndex,
          courseName: parameterList.courseName,
          supervisor: parameterList.supervisor,
          date: moment().format("MM/DD/YYYY"),
          startingTime: parameterList.startingTime,
          endingTime: parameterList.endingTime
        });
        for (matriculationKey in matriculationNo) {
          await ref
            .child("attendance")
            .child(classPath.path.pieces_[2] + incr.toString())
            .set({
              classReferenceID: classPath.path.pieces_[2],
              matriculationNo: matriculationNo[matriculationKey],
              status: ""
            });
          incr++;
        }
        res.send(true);
      }
    } else {
      classPath = await ref.child("class").push({
        courseIndex: parameterList.courseIndex,
        classIndex: parameterList.classIndex,
        courseName: parameterList.courseName,
        supervisor: parameterList.supervisor,
        date: moment().format("MM/DD/YYYY"),
        startingTime: parameterList.startingTime,
        endingTime: parameterList.endingTime
      });
      for (matriculationKey in matriculationNo) {
        await ref
          .child("attendance")
          .child(classPath.path.pieces_[2] + incr.toString())
          .set({
            classReferenceID: classPath.path.pieces_[2],
            matriculationNo: matriculationNo[matriculationKey],
            status: ""
          });
        incr++;
      }
      res.send(true);
    }
  })
);

//delete a specific class session based on referenceKey
app.post(
  "/api/class/delete",
  asyncMiddleware(async (req, res) => {
    /* note:
          This function require the front end to POST req's body with:
            1. referenceKey of specific class
          If record is removed,
            then remove attendance record of the respective class session
            send back true
        */

    console.log(req.body.referenceKey);
    var i;

    await ref
      .child("class")
      .child(req.body.referenceKey)
      .remove();

    let snapshot = await new Promise((resolve, reject) =>
      ref
        .child("attendance")
        .orderByKey.startAt(String(referenceKey))
        .once("value", resolve)
    );

    for (i in snapshot.val()) {
      await ref
        .child("attendance")
        .child(i)
        .remove();
    }
    res.send(true);
  })
);

//Retrieve attendance list based on matriculationNo of the individual
app.post(
  "/api/attendance/view/",
  asyncMiddleware(async (req, res) => {
    /* note:
          This function require the front end to post the api:
            1. matriculationNo
            it will return with a list of attendance of the individual matriculationNo:
            attendancelist: [
              {
                matriculationNo,
                value: {
                  name,
                  password,
                  role,
                  username
                }
              },
              {
                matriculationNo,
                value
              }
            ]
        */

    matriculationNo = req.body.matriculationNo;
    let attendancelist = [];
    let convertedAttendanceList = [];

    let snapshot = await new Promise((resolve, reject) =>
      ref.child("attendance").once("value", resolve)
    );
    let attendance = snapshot.val();
    for (keys in attendance) {
      if (attendance[keys].matriculationNo == matriculationNo) {
        await attendancelist.push({ key: keys, value: attendance[keys] });
      }
    }
    for (key in attendancelist) {
      classkey = attendancelist[key].value.classReferenceID;
      attendanceDetail = attendancelist[key];
      let snapshot = await new Promise((resolve, reject) =>
        ref
          .child("class")
          .orderByKey()
          .equalTo(classkey)
          .once("value", resolve)
      );
      if (snapshot.exists()) {
        classDetail = snapshot.val();
        for (t in classDetail) {
          classDetail = classDetail[t];
          convertedAttendanceList.push({
            classReferenceID: attendanceDetail.value.classReferenceID,
            classIndex: classDetail.classIndex,
            courseIndex: classDetail.courseIndex,
            courseName: classDetail.courseName,
            date: classDetail.date,
            endingTime: classDetail.endingTime,
            startingTime: classDetail.startingTime,
            supervisor: classDetail.supervisor,
            attendanceReferenceID: attendanceDetail.key,
            status: attendanceDetail.value.status
          });
        }
      } else {
        res.send(false);
      }
    }
    console.log("return list");
    res.send(convertedAttendanceList);
  })
);

//update attendance status to attended based on classDetail and matriculationNo of the student
app.post(
  "/api/attendance/update2",
  asyncMiddleware(async (req, res) => {
    /* note:
        This function require the front end to POST req's body with:
            1. classDetail
                a. courseIndex
                b. classIndex
            2. descriptor
                a. _descriptor
                b. _label
        The function will search for the class session referenceKey with the 'TODAY', courseIndex and classIndex:
            matchFace using the trained model and userDescriptor
                    if result is equal to matriculationNo
                        update the user 'TODAY' class attendance of the given courseIndex and classIndex
*/
    console.log("update attendance");
    var classDetail = req.body.classDetail;
    var userDescriptor = req.body.descriptor;
    var matriculationNo = userDescriptor._label;
    var classReferenceID = 0;
    attendanceStatus = {
      status: "attended"
    };

    const classSessionS = await new Promise((resolve, reject) =>
      ref
        .child("class")
        .orderByChild("date")
        .equalTo(moment().format("MM/DD/YYYY"))
        .once("value", resolve)
    );
    if (!classSessionS.exists()) {
      // if snapshot dont exist
    }

    var classSession = classSessionS.val();
    for (classKey in classSession) {
      if (
        classSession[classKey].courseIndex == classDetail.courseIndex &&
        classSession[classKey].classIndex == classDetail.classIndex
      ) {
        // console.log("ID located");
        classReferenceID = classKey;
      }
    }

    const result = await matchingFaceResult(userDescriptor, model);

    console.log("result: ", result);
    if (result == matriculationNo) {
      //if result is correct, update the attendance record
      console.log("updating");
      let snapshot = await new Promise(resolve =>
        ref
          .child("attendance")
          .orderByKey()
          .startAt(String(classReferenceID))
          .once("value", resolve)
      );

      if (snapshot.exists()) {
        studentInClass = snapshot.val();
        for (e in studentInClass) {
          if (studentInClass[e].matriculationNo == matriculationNo) {
            await ref
              .child("attendance")
              .child(e)
              .update(attendanceStatus);
            res.send(true);
          }
        }
      } else {
        res.send(false);
      }
    } else {
      //face matching result is wrong
      res.send(false);
    }
  })
);

// //update attendance status to attended based on classDetail and matriculationNo of the student
// app.post("/api/attendance/update", (req, res) => {
//     /* note:
//           This function require the front end to POST req's body with:
//               1. classDetail
//                   a. courseIndex
//                   b. classIndex
//               2. descriptor
//                   a. _descriptor
//                   b. _label
//           The function will search for the class session referenceKey with the 'TODAY', courseIndex and classIndex:
//             Then search for all matriculationNo in the class session and store it in ArrayMatriculation
//               Search for all the descriptor with the ArrayMatriculation and store each of the descriptor into Arraydescriptor
//                   Train a model with the Arraydescriptor and matchFace using the trained model and userDescriptor
//                       if result is equal to matriculationNo
//                           update the user 'TODAY' class attendance of the given courseIndex and classIndex
//       */

//     var classDetail = req.body.classDetail;
//     var userDescriptor = req.body.descriptor;
//     var matriculationNo = userDescriptor._label;
//     console.log(matriculationNo);
//     var classReferenceID = 0;
//     var counter1 = 1;
//     var ArrayMatriculation = [];
//     var Arraydescriptor = [];
//     attendanceStatus = {
//         status: "attended"
//     };
//     ref
//         .child("class")
//         .orderByChild("date")
//         .equalTo(moment().format("MM/DD/YYYY"))
//         .once("value", function (snapshot) {
//             if (snapshot.exists()) {
//                 var classSession = snapshot.val();
//                 Object.keys(classSession).forEach(k => {
//                     if (
//                         classSession[k].courseIndex == classDetail.courseIndex &&
//                         classSession[k].classIndex == classDetail.classIndex
//                     ) {
//                         // console.log("ID located");
//                         classReferenceID = k;
//                         // console.log(classReferenceID);

//                         //find all the student of the class session
//                         ref
//                             .child("attendance")
//                             .orderByKey()
//                             .startAt(classReferenceID.toString())
//                             .once("value", function (snapshot) {
//                                 if (snapshot.exists()) {
//                                     studentInClass = snapshot.val();
//                                     Object.keys(studentInClass).forEach(k => {
//                                         ArrayMatriculation.push(studentInClass[k].matriculationNo);
//                                     }),
//                                         //forming of the array of descriptor
//                                         Object.keys(ArrayMatriculation).forEach(k => {
//                                             let oneNo = ArrayMatriculation[k];
//                                             ref
//                                                 .child("users")
//                                                 .orderByKey()
//                                                 .equalTo(oneNo)
//                                                 .once("value", function (snapshot) {
//                                                     if (snapshot.exists()) {
//                                                         student = snapshot.val();
//                                                         Object.keys(student).forEach(k => {
//                                                             Arraydescriptor.push(student[k].descriptor);
//                                                         });
//                                                         //cannot then after forEach, so using a simple counter to do it
//                                                         if (counter1 == ArrayMatriculation.length) {
//                                                             /* To Do:
//                                                               get the then to work
//                                                               */
//                                                             generateModelResult(
//                                                                 userDescriptor,
//                                                                 Arraydescriptor
//                                                             ).then(function (detectValue) {
//                                                                 console.log("detectValue is: ", detectValue);
//                                                                 if (detectValue == matriculationNo) {
//                                                                     //if result is correct, update the attendance record
//                                                                     console.log("updating");
//                                                                     ref
//                                                                         .child("attendance")
//                                                                         .orderByKey()
//                                                                         .startAt(String(classReferenceID))
//                                                                         .once("value", function (snapshot) {
//                                                                             if (snapshot.exists()) {
//                                                                                 // console.log("2nd part using classReferenceID: ", classReferenceID);
//                                                                                 // console.log(snapshot.val());
//                                                                                 studentInClass = snapshot.val();
//                                                                                 Object.keys(studentInClass).forEach(
//                                                                                     k => {
//                                                                                         if (
//                                                                                             studentInClass[k]
//                                                                                                 .matriculationNo ==
//                                                                                             matriculationNo
//                                                                                         ) {
//                                                                                             // console.log("student attendance record: ", studentInClass[k]);
//                                                                                             ref
//                                                                                                 .child("attendance")
//                                                                                                 .child(k)
//                                                                                                 .update(attendanceStatus)
//                                                                                                 .then(res.send(true))
//                                                                                                 .catch(e => {
//                                                                                                     res.send(e);
//                                                                                                 });
//                                                                                         }
//                                                                                     }
//                                                                                 );
//                                                                             }
//                                                                         });
//                                                                 } else {
//                                                                     //face matching result is wrong
//                                                                     res.send(false);
//                                                                 }
//                                                             });
//                                                         }
//                                                         counter1++;
//                                                     } else {
//                                                         res.send(false);
//                                                     }
//                                                 });
//                                         });
//                                 }
//                             });
//                     }
//                 });
//             }
//         })
//         .catch(e => {
//             res.send(e);
//         });
// });

app.post(
  "/api/attendance/admin-update",
  asyncMiddleware(async (req, res) => {
    /* note:
          This function require the front end to POST req's body with:
              1. classDetail
                  a. courseIndex
                  b. classIndex
              2. matriculationNo
          The function will search for the class session referenceKey with the 'TODAY', courseIndex and classIndex:
                          update the user 'TODAY' class attendance of the given courseIndex and classIndex
      */

    var classDetail = req.body.classDetail;
    var matriculationNo = req.body.matriculationNo;
    var classReferenceID = 0;
    var counter1 = 1;
    attendanceStatus = {
      status: "attended"
    };
    let snapshot = await new Promise((resolve, reject) =>
      ref
        .child("attendance")
        .orderByKey()
        .startAt(String(classReferenceID))
        .once("value", resolve)
    );
    if (snapshot.exists()) {
      let studentInClass = snapshot.val();
      for (key in studentInClass) {
        if (studentInClass[key].matriculationNo == matriculationNo) {
          await ref
            .child("attendance")
            .child(key)
            .update(attendanceStatus);
        }
      }
      res.send(true);
    } else {
      res.send(false);
    }
  })
);

//post("/api/auth/login")

app.listen(port, () => console.log(`Listening on port ${port}`));

//to host it on firebase, need to export as app
//exports.app = functions.https.onRequest(app);

//database record order
/*
users
matriculationNo(key)
    name, username, password, role, descriptor

class
(key)
    courseIndex, classIndex, courseName, supervisor, date, startingTime, endingTime

attendance
(class key + n)
    class_reference, matriculationNo, status
*/

startingProcess = async () => {
  var globalStudentdescriptorlist = [];
  ref
    .child("users")
    .once("value", function(snapshot) {
      var users = snapshot.val();
      Object.keys(users).forEach(k => {
        if (users[k].role == "S") {
          globalStudentdescriptorlist.push({
            descriptor: users[k].descriptor
          });
        }
      });
    })
    .then(() => {
      return generateModel(globalStudentdescriptorlist);
    });
};

generateModel = async descriptorArray => {
  console.log("generating model");
  await faceapi.nets.ssdMobilenetv1.loadFromDisk("./models");
  await faceapi.nets.faceLandmark68Net.loadFromDisk("./models");
  await faceapi.nets.faceRecognitionNet.loadFromDisk("./models");

  const LabeledFaceDescriptors = [];

  // console.log('array is: ' , descriptorArray)
  Object.keys(descriptorArray).forEach(k => {
    let user_descSet = descriptorArray[k].descriptor._descriptors;
    // console.log('user_descSet is: ', user_descSet)
    let user = descriptorArray[k].descriptor._label;
    console.log("user matriculationNo is: ", user);
    let user_descriptorSet = [];
    Object.keys(user_descSet).forEach(k => {
      let user_desc = user_descSet[k];
      // console.log('user_des is: ', user_desc)
      let descriptor = [];
      Object.keys(user_desc).forEach(k => {
        descriptor.push(user_desc[k]);
      });
      descriptor = new Float32Array(descriptor);
      user_descriptorSet.push(new Float32Array(descriptor));
    });
    // user_descriptorSet = new Float32Array(user_descriptorSet);
    console.log(user_descriptorSet);
    LabeledFaceDescriptors.push(
      new faceapi.LabeledFaceDescriptors(user, user_descriptorSet)
    );
  });
  console.log(
    "creating model that trained against ",
    LabeledFaceDescriptors.length,
    " descriptor: ",
    LabeledFaceDescriptors
  );
  if (LabeledFaceDescriptors.length > 0) {
    model = await new faceapi.FaceMatcher(LabeledFaceDescriptors, 0.6);
  }
};

matchingFaceResult = async (userDescriptor, faceCatcher) => {
  console.log("matching Face");
  faceDescriptor = [];

  //   console.log("the userDescriptor property is: ", userDescriptor);

  console.log("test");
  Object.keys(userDescriptor._descriptors).forEach(k => {
    faceDescriptor.push(userDescriptor._descriptors[k]);
  });

  console.log("test");

  faceDescriptor = new Float32Array(faceDescriptor);
  console.log("faceDescriptor: ", faceDescriptor.length);

  console.log("faceCatch: ", faceCatcher);

  let bestMatch = await faceCatcher.findBestMatch(faceDescriptor);
  return bestMatch._label.toString();
};

console.log("starting server preparation");
startingProcess();
