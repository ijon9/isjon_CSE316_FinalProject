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
    // Create table CurrentUser
    // var sql = `CREATE TABLE CurrentUser(
    //     employeeID VARCHAR(50),
    //     labID VARCHAR(50),
    //     FOREIGN KEY(employeeID) REFERENCES Employee(employeeID),
    //     FOREIGN KEY(labID) REFERENCES LabEmployee(labID)
    // )`;
    // con.query(sql, function(err, result) {
    //     if(err) throw err;
    //     console.log("Table created");
    // });
    // Truncate CurrentUser
    con.query('TRUNCATE TABLE CurrentUser', function(err, result) {
        if(err) throw err;
    });
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
        var loginFail = url.parse(req.url, true).query.error;
        if(loginFail === 'true') {
            res.write('<h2 style="text-align:center;color:red">');
            res.write("Incorrect Email or Password");
            res.write('</h2>');
        }
        res.end();
    });
});

// Employee Results Page
app.get("/results", (req, res) => {
    //Checks if login information is correct
    var q = url.parse(req.url, true);
    var qdata = q.query;
    var sql = `SELECT COUNT(*),employeeID FROM Employee WHERE
        email="` + qdata.email + `" AND passcode="`
        + qdata.password + '"';
    con.query(sql, function(err, result) {
        if (err) throw err;
        var entryPresent = result[0]['COUNT(*)'];
        if(!entryPresent) {
            res.redirect("/employee?error=true");
        }
        else {
            res.write("results");
            // Clears the CurrentUser table and 
            // Loads the current Employee into the table
            con.query("TRUNCATE TABLE CurrentUser", function(err, result) {
                if(err) throw err;
            });
            sql = `INSERT INTO CurrentUser VALUES(`
                + '"' + result[0]['employeeID'] + '", NULL' + `)`;
            con.query(sql, function(err, result) {
                if(err) throw err;
            });
        }
        res.end();
    });
});

// Lab Login
app.get("/lablogin", (req, res) => {
    fs.readFile("templates/labLogin.html", (err,data) => {
        res.writeHead(200, { "Content-Type" : "text/html" });
        res.write(data);
        var loginFail = url.parse(req.url, true).query.error;
        if(loginFail === 'true') {
            res.write('<h2 style="text-align:center;color:red">');
            res.write("Incorrect LabID or Password");
            res.write('</h2>');
        }
        res.end();
    });
});

// Lab Home
app.get("/labhome", (req, res) => {
    fs.readFile("templates/labHome.html", (err,data) => {
        //Checks if login information is correct
        var q = url.parse(req.url, true);
        var qdata = q.query;
        var sql = `SELECT COUNT(*) FROM LabEmployee WHERE
            labID="` + qdata.id + `" AND password="`
            + qdata.password + '"';
        con.query(sql, function(err, result) {
            if (err) throw err;
            var entryPresent = result[0]['COUNT(*)'];
            if(!entryPresent) {
                res.redirect("/lablogin?error=true");
            }
            else {
                // Load the lab home webpage 
                res.writeHead(200, { "Content-Type" : "text/html" });
                res.write(data+'<br>');
                res.write('<h2 style="text-align:center">');
                res.write("LabID: " + qdata.id);
                res.write('</h2>');
                // Clears the CurrentUser table and
                // Loads the current lab employee into the table
                con.query("TRUNCATE TABLE CurrentUser", function(err, result) {
                    if(err) throw err;
                });
                sql = `INSERT INTO CurrentUser VALUES(`
                    + 'NULL, "' + qdata.id + `")`;
                con.query(sql, function(err, result) {
                    if(err) throw err;
                });
            }
            res.end();
        });
    })
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
    fs.readFile("templates/testCollection.html", (err, data) => {
        // Get the current lab employee that is logged in
        con.query('SELECT labID FROM CurrentUser', (err, result) => {
            var currUser = result[0];//['labID'];
            if(currUser === undefined) {
                res.redirect("/");
            }
            else {
                res.writeHead(200, { "Content-Type" : "text/html" });
                res.write(data);
                currUser = currUser['labID'];
                if(currUser !== null) {
                    res.write('<h2 style="text-align:center">');
                    res.write('Lab ID: ' + currUser);
                    res.write('</h2>');
                }
                res.end();
            }
        });
    });
});

port = process.env.PORT || 3000
app.listen(port, () => { console.log('server started!') });