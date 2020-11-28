const express = require('express');
const app = express();
var fs = require('fs');
const url = require('url');

// DB Connection
var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "mydb"
});
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    // Database creation
    // con.query("CREATE DATABASE mydb", function(err, result) {
    //     if(err) throw err;
    //     console.log("Database created");
    // });
    // // Create table Employee
    // var sql = `CREATE TABLE Employee(
    //     employeeID VARCHAR(20),
    //     email VARCHAR(50),
    //     firstName VARCHAR(50),
    //     lastName VARCHAR(50),
    //     passcode VARCHAR(50),
    //     PRIMARY KEY(employeeID),
    //     UNIQUE(email)
    // )`;
    // con.query(sql, function(err, result) {
    //     if(err) throw err;
    //     console.log("Table created");
    // });
    // // Create table LabEmployee
    // var sql = `CREATE TABLE LabEmployee(
    //     labID VARCHAR(50),
    //     password VARCHAR(50),
    //     PRIMARY KEY(labID)
    // )`;
    // con.query(sql, function(err, result) {
    //     if(err) throw err;
    //     console.log("Table created");
    // });
    // // Create table Pool
    // var sql = `CREATE TABLE Pool(
    //     poolBarcode VARCHAR(50),
    //     PRIMARY KEY(poolBarcode)
    // )`;
    // con.query(sql, function(err, result) {
    //     if(err) throw err;
    //     console.log("Table created");
    // });
    // // Create table Well
    // var sql = `CREATE TABLE Well(
    //     wellBarcode VARCHAR(50),
    //     PRIMARY KEY(wellBarcode)
    // )`;
    // con.query(sql, function(err, result) {
    //     if(err) throw err;
    //     console.log("Table created");
    // });
    // // Create table EmployeeTest
    // var sql = `CREATE TABLE EmployeeTest(
    //     testBarcode VARCHAR(50),
    //     employeeID VARCHAR(20) NOT NULL,
    //     collectionTime DATETIME,
    //     collectedBy VARCHAR(20),
    //     PRIMARY KEY(testBarcode),
    //     FOREIGN KEY(employeeID) REFERENCES Employee(employeeID),
    //     FOREIGN KEY(collectedBy) REFERENCES LabEmployee(labID)
    //  )`;
    // con.query(sql, function(err, result) {
    //     if(err) throw err;
    //     console.log("Table created");
    // });
    // // Create table PoolMap
    // var sql = `CREATE TABLE PoolMap(
    //     testBarcode VARCHAR(50),
    //     poolBarcode VARCHAR(50),
    //     FOREIGN KEY(testBarcode) REFERENCES EmployeeTest(testBarcode),
    //     FOREIGN KEY(poolBarcode) REFERENCES Pool(poolBarcode)
    // )`;
    // con.query(sql, function(err, result) {
    //     if(err) throw err;
    //     console.log("Table created");
    // });
    // // Create table WellTesting
    // var sql = `CREATE TABLE WellTesting(
    //     poolBarcode VARCHAR(50),
    //     wellBarcode VARCHAR(50),
    //     testingStartTime DATETIME,
    //     testingEndTime DATETIME,
    //     result VARCHAR(20),
    //     FOREIGN KEY(poolBarcode) REFERENCES Pool(poolBarcode)
    // )`;
    // con.query(sql, function(err, result) {
    //     if(err) throw err;
    //     console.log("Table created");
    // }); 
});

// Routes
// Home
app.get("/", (req, res) => {
    fs.readFile("templates/index.html", (err, data) => {
        res.writeHead(200, { "Content-Type" : "text/html" });
        res.write(data);
        res.end();
    });
});

// Employee Login Page for Results
app.get("/employee", (req, res) => {
    fs.readFile("templates/employeeLogin.html", (err, data) => {
        res.writeHead(200, { "Content-Type" : "text/html"});
        res.write(data);
        res.end();
    });
});

// Employee Results Page
app.get("/results", (req, res) => {
    res.write("results");
    res.end();
});

// Lab Login
app.get("/lablogin", (req, res) => {
    fs.readFile("templates/labLogin.html", (err,data) => {
        res.writeHead(200, { "Content-Type" : "text/html" });
        res.write(data);
        res.end();
    });
});

// Lab Home
app.get("/labhome", (req, res) => {
    res.write("Lab Home");
    res.end();
});

// Pool Mapping
app.get("/pool", (req, res) => {
    res.write("Pool Mapping");
    res.end();
});

// Well Testing
app.get("/well", (req, res) => {
    res.write("Well Testing");
    res.end();
});

// Test Collection Page
app.get("/test", (req, res) => {
    res.write("Test Collection");
    res.end();
});

port = process.env.PORT || 3000
app.listen(port, () => { console.log('server started!') });