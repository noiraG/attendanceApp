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

// creating a starting path in our database
const ref = db.ref("ASE");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(fileUpload());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

//receive a face image then call face api to idenify
app.post("/face", (req, res) => {
    console.log(req);
    let imageFile = req.files.file;
    /*To Do:
          Insert the face api calling
          **use res.send("message") to return the respond correspond to the face api result*/
});

//login - retrieve user based on username and password
app.post("/login", (req, res) => {
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
    ref
        .child("users")
        .orderByChild("username")
        .equalTo(req.body.username)
        .once("value", function (snapshot) {
            accountCandidates = snapshot.val();
            if (snapshot.exists()) {
                Object.keys(accountCandidates).forEach(k => {
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
                        res.send({status: false, message: "Wrong Password"});
                    }
                });
            } else {
                //user does not exist
                res.send({status: false, message: "Wrong Username"});
            }
        });
});

//View all student, return all students
app.get("/api/student", (req, res) => {
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
    ref.once("value", function (snapshot) {
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

//View 1 student, return 1 specific student
//url need to change, include reference key
app.post("/api/student/one", (req, res) => {
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

    ref
        .child("users")
        .orderByKey()
        .equalTo(req.body.matriculationNo)
        .once("value", function (snapshot) {
            if (snapshot.exists()) {
                var users = snapshot.val();
                Object.keys(users).forEach(k => {
                    student = {key: k, value: users[k]};
                    res.send(student);
                });
            } else {
                res.send(false);
            }
        });
});

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
app.post("/api/student/add/", (req, res) => {
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
    parameterList = req.body;
    //check if user existed

    let des = Float32Array.from(Object.values(parameterList.descriptor), x => x);
    let result = new faceapi.LabeledFaceDescriptors(
        parameterList.matriculationNo,
        [des]
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
});

//View all class, return all class
app.get("/api/class", (req, res) => {
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
    ref
        .child("class")
        .orderByChild("date")
        .once("value", function (snapshot) {
            var classes = snapshot.val();
            Object.keys(classes).forEach(k => {
                classSession.push({
                    key: k,
                    value: classes[k]
                });
            });
            console.log("returning class session", classSession);
            res.send(classSession);
        });
});

//Add class session
app.post("/api/class/add/", (req, res) => {
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

    incr = 0;
    parameterList = req.body.class;
    matriculationNo = req.body.matriculationNo;
    classPath = "";
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
                            (classPath = ref.child("class").push({
                                courseIndex: parameterList.courseIndex,
                                classIndex: parameterList.classIndex,
                                courseName: parameterList.courseName,
                                supervisor: parameterList.supervisor,
                                date: moment().format("MM/DD/YYYY"),
                                startingTime: parameterList.startingTime,
                                endingTime: parameterList.endingTime
                            }))
                                .then(
                                    matriculationNo.forEach(k => {
                                        ref
                                            .child("attendance")
                                            .child(classPath.path.pieces_[2] + incr.toString())
                                            .set({
                                                classReferenceID: classPath.path.pieces_[2],
                                                matriculationNo: k,
                                                status: ""
                                            })
                                            .catch(e => {
                                                console.log(e);
                                            });
                                        incr++;
                                    })
                                )
                                .then(res.send(true))
                                .catch(e => {
                                    console.log(e);
                                });
                        }
                    }
                });
            } else {
                (classPath = ref.child("class").push({
                    courseIndex: parameterList.courseIndex,
                    classIndex: parameterList.classIndex,
                    courseName: parameterList.courseName,
                    supervisor: parameterList.supervisor,
                    date: moment().format("MM/DD/YYYY"),
                    startingTime: parameterList.startingTime,
                    endingTime: parameterList.endingTime
                }))
                    .then(
                        matriculationNo.forEach(k => {
                            ref
                                .child("attendance")
                                .child(classPath.path.pieces_[2] + incr.toString())
                                .set({
                                    classReferenceID: classPath.path.pieces_[2],
                                    matriculationNo: k,
                                    status: ""
                                })
                                .catch(e => {
                                    console.log(e);
                                });
                            incr++;
                        })
                    )
                    .then(res.send(true))
                    .catch(e => {
                        console.log(e);
                    });
            }
        });
});

//delete a specific class session based on referenceKey
app.post("/api/class/delete", (req, res) => {
    /* note:
          This function require the front end to POST req's body with:
            1. referenceKey of specific class
          If record is removed,
            then remove attendance record of the respective class session
            send back true
        */

    console.log(req.body.referenceKey);
    var i;

    ref
        .child("class")
        .child(req.body.referenceKey)
        .remove()
        .then(() => {
            for (i = 0; i < 50; i++) {
                // console.log(req.body.referenceKey + i.toString());
                ref
                    .child("attendance")
                    .child(req.body.referenceKey + i.toString())
                    .remove();
            }
            res.send(true);
        });
});

//Retrieve attendance list based on matriculationNo of the individual
app.post("/api/attendance/view/", (req, res) => {
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
    let counter1 = 1;
    ref.once("value", function (snapshot) {
        let attendance = snapshot.val().attendance;
        Object.keys(attendance).forEach(k => {
            if (attendance[k].matriculationNo == matriculationNo) {
                attendancelist.push({
                    key: k,
                    value: attendance[k]
                });
            }
        });
        Object.keys(attendancelist).forEach(k => {
            classkey = attendancelist[k].value.classReferenceID;
            attendanceDetail = attendancelist[k];
            ref
                .child("class")
                .orderByKey()
                .equalTo(classkey)
                .once("value", function (snapshot) {
                    if (snapshot.exists()) {
                        classDetail = snapshot.val();

                        Object.keys(classDetail).forEach(k => {
                            classDetail = classDetail[k];
                        });
                        console.log("class detail ", classDetail);
                        console.log("attendance detail ", attendanceDetail);
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
                    if (counter1 == attendancelist.length) {
                        // console.log(convertedAttendanceList);
                        res.send(convertedAttendanceList);
                    }
                    counter1++;
                });
        });
    });
});

//update attendance status to attended based on classDetail and matriculationNo of the student
app.post("/api/attendance/update", (req, res) => {
    /* note:
          This function require the front end to POST req's body with:
              1. classDetail
                  a. courseIndex
                  b. classIndex
              2. descriptor
                  a. _descriptor
                  b. _label
          The function will search for the class session referenceKey with the 'TODAY', courseIndex and classIndex:
            Then search for all matriculationNo in the class session and store it in ArrayMatriculation
              Search for all the descriptor with the ArrayMatriculation and store each of the descriptor into Arraydescriptor
                  Train a model with the Arraydescriptor and matchFace using the trained model and userDescriptor
                      if result is equal to matriculationNo
                          update the user 'TODAY' class attendance of the given courseIndex and classIndex
      */

    var classDetail = req.body.classDetail;
    var userDescriptor = req.body.descriptor;
    var matriculationNo = userDescriptor._label;
    console.log(matriculationNo);
    var classReferenceID = 0;
    var counter1 = 1;
    var ArrayMatriculation = [];
    var Arraydescriptor = [];
    attendanceStatus = {
        status: "attended"
    };
    ref
        .child("class")
        .orderByChild("date")
        .equalTo(moment().format("MM/DD/YYYY"))
        .once("value", function (snapshot) {
            if (snapshot.exists()) {
                var classSession = snapshot.val();
                Object.keys(classSession).forEach(k => {
                    if (
                        classSession[k].courseIndex == classDetail.courseIndex &&
                        classSession[k].classIndex == classDetail.classIndex
                    ) {
                        // console.log("ID located");
                        classReferenceID = k;
                        // console.log(classReferenceID);

                        //find all the student of the class session
                        ref
                            .child("attendance")
                            .orderByKey()
                            .startAt(classReferenceID.toString())
                            .once("value", function (snapshot) {
                                if (snapshot.exists()) {
                                    studentInClass = snapshot.val();
                                    Object.keys(studentInClass).forEach(k => {
                                        ArrayMatriculation.push(studentInClass[k].matriculationNo);
                                    }),
                                        //forming of the array of descriptor
                                        Object.keys(ArrayMatriculation).forEach(k => {
                                            let oneNo = ArrayMatriculation[k];
                                            ref
                                                .child("users")
                                                .orderByKey()
                                                .equalTo(oneNo)
                                                .once("value", function (snapshot) {
                                                    if (snapshot.exists()) {
                                                        student = snapshot.val();
                                                        Object.keys(student).forEach(k => {
                                                            Arraydescriptor.push(student[k].descriptor);
                                                        });
                                                        //cannot then after forEach, so using a simple counter to do it
                                                        if (counter1 == ArrayMatriculation.length) {
                                                            /* To Do:
                                                              get the then to work
                                                              */
                                                            generateModelResult(
                                                                userDescriptor,
                                                                Arraydescriptor
                                                            ).then(function (detectValue) {
                                                                console.log("detectValue is: ", detectValue);
                                                                if (detectValue == matriculationNo) {
                                                                    //if result is correct, update the attendance record
                                                                    console.log("updating");
                                                                    ref
                                                                        .child("attendance")
                                                                        .orderByKey()
                                                                        .startAt(String(classReferenceID))
                                                                        .once("value", function (snapshot) {
                                                                            if (snapshot.exists()) {
                                                                                // console.log("2nd part using classReferenceID: ", classReferenceID);
                                                                                // console.log(snapshot.val());
                                                                                studentInClass = snapshot.val();
                                                                                Object.keys(studentInClass).forEach(
                                                                                    k => {
                                                                                        if (
                                                                                            studentInClass[k]
                                                                                                .matriculationNo ==
                                                                                            matriculationNo
                                                                                        ) {
                                                                                            // console.log("student attendance record: ", studentInClass[k]);
                                                                                            ref
                                                                                                .child("attendance")
                                                                                                .child(k)
                                                                                                .update(attendanceStatus)
                                                                                                .then(res.send(true))
                                                                                                .catch(e => {
                                                                                                    res.send(e);
                                                                                                });
                                                                                        }
                                                                                    }
                                                                                );
                                                                            }
                                                                        });
                                                                } else {
                                                                    //face matching result is wrong
                                                                    res.send(false);
                                                                }
                                                            });
                                                        }
                                                        counter1++;
                                                    } else {
                                                        res.send(false);
                                                    }
                                                });
                                        });
                                }
                            });
                    }
                });
            }
        })
        .catch(e => {
            res.send(e);
        });
});


app.post("/api/attendance/admin-update", (req, res) => {
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
    ref
        .child("attendance")
        .orderByKey()
        .startAt(String(classReferenceID))
        .once("value", function (snapshot) {
            if (snapshot.exists()) {
                studentInClass = snapshot.val();
                Object.keys(studentInClass).forEach(
                    k => {
                        if (
                            studentInClass[k]
                                .matriculationNo ==
                            matriculationNo
                        ) {
                            // console.log("student attendance record: ", studentInClass[k]);
                            ref
                                .child("attendance")
                                .child(k)
                                .update(attendanceStatus)
                                .then(res.send(true))
                                .catch(e => {
                                    res.send(e);
                                });
                        }
                    }
                );
            }
        });
});

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

generateModelResult = async (userDescriptor, descriptorArray) => {
    let user = null;
    let counter = 1;
    const LabeledFaceDescriptors = [];

    await faceapi.nets.ssdMobilenetv1.loadFromDisk("./models");
    await faceapi.nets.faceLandmark68Net.loadFromDisk("./models");
    await faceapi.nets.faceRecognitionNet.loadFromDisk("./models");

    Object.keys(descriptorArray).forEach(k => {
        let user_desc = descriptorArray[k]._descriptors[0];
        user = descriptorArray[k]._label;
        let descriptor = [];
        Object.keys(user_desc).forEach(k => {
            descriptor.push(user_desc[k]);
        })
        //   console.log(descriptor.length),
        descriptor = new Float32Array(descriptor);
        LabeledFaceDescriptors.push(
            new faceapi.LabeledFaceDescriptors(user, [descriptor])
        );
    })
    let model = await new faceapi.FaceMatcher(LabeledFaceDescriptors);
    faceDescriptor = [];

    //   console.log("the userDescriptor property is: ", userDescriptor);

    Object.keys(userDescriptor._descriptors).forEach(k => {
        faceDescriptor.push(userDescriptor._descriptors[k]);
    });

    faceDescriptor = new Float32Array(faceDescriptor);

    let bestMatch = await model.findBestMatch(faceDescriptor);
    detectValue = bestMatch._label.toString();
    return detectValue;
}
