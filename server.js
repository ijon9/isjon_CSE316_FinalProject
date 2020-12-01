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
    // con.query("CREATE DATABASE mydb", (err, result) => {
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
    // con.query(sql, (err, result) => {
    //     if(err) throw err;
    //     console.log("Table created");
    // });
    // // Create table LabEmployee
    // var sql = `CREATE TABLE LabEmployee(
    //     labID VARCHAR(50),
    //     password VARCHAR(50),
    //     PRIMARY KEY(labID)
    // )`;
    // con.query(sql, (err, result) => {
    //     if(err) throw err;
    //     console.log("Table created");
    // });
    // // Create table Pool
    // var sql = `CREATE TABLE Pool(
    //     poolBarcode VARCHAR(50),
    //     PRIMARY KEY(poolBarcode)
    // )`;
    // con.query(sql, (err, result) => {
    //     if(err) throw err;
    //     console.log("Table created");
    // });
    // // Create table Well
    // var sql = `CREATE TABLE Well(
    //     wellBarcode VARCHAR(50),
    //     PRIMARY KEY(wellBarcode)
    // )`;
    // con.query(sql, (err, result) => {
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
    // con.query(sql, (err, result) => {
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
    // con.query(sql, (err, result) => {
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
    // con.query(sql, (err, result) => {
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
    // con.query(sql, (err, result) => {
    //     if(err) throw err;
    //     console.log("Table created");
    // });
    // Truncate CurrentUser
    con.query('TRUNCATE TABLE CurrentUser', (err, result) => {
        if(err) throw err;
    });
});

// Routes
// Home
app.get("/", (req, res) => {
    fs.readFile("templates/index.html", (err, data) => {
        res.writeHead(200, { "Content-Type" : "text/html" });
        res.write(data);
        var loggedIn = url.parse(req.url, true).query.error;
        if(loggedIn === 'true') {
            res.write('<h2 style="text-align:center;color:red">');
            res.write("You must be logged in to access the desired webpage");
            res.write('</h2>');
        }
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
    con.query(sql, (err, result) => {
        if (err) throw err;
        var entryPresent = result[0]['COUNT(*)'];
        if(!entryPresent) {
            res.redirect("/employee?error=true");
        }
        else {
            // Clears the CurrentUser table and 
            // Loads the current Employee into the table
            con.query("TRUNCATE TABLE CurrentUser", (err, result) => {
                if(err) throw err;
            });
            sql = `INSERT INTO CurrentUser VALUES(`
                + '"' + result[0]['employeeID'] + '", NULL' + `)`;
            con.query(sql, (err, result) => {
                if(err) throw err;
            });
            fs.readFile("templates/employeeResults.html", (err, data) => {
                res.writeHead(200, { "Content-Type" : "text/html"});
                res.write(data);
                res.end();
            });
        }
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
        con.query(sql, (err, result) => {
            if (err) throw err;
            var entryPresent = result[0]['COUNT(*)'];
            if(!entryPresent) {
                res.redirect("/lablogin?error=true");
            }
            else {
                // Clears the CurrentUser table and
                // Loads the current lab employee into the table
                con.query("TRUNCATE TABLE CurrentUser", (err, result) => {
                    if(err) throw err;
                });
                sql = `INSERT INTO CurrentUser VALUES(`
                    + 'NULL, "' + qdata.id + `")`;
                con.query(sql, (err, result) => {
                    if(err) throw err;
                });
                // Load the lab home webpage 
                res.writeHead(200, {"Content-Type" : "text/html"});
                res.write(data);
                res.write('<h2 style="text-align:center">');
                res.write("Lab ID: " + qdata.id);
                res.write('</h2>');
                res.end();
            }
        });
    })
});

// Pool Mapping
app.get("/pool", (req, res) => {
    // Create a database called CurrentPool which has a list of test barcodes currently selected
    // Have a form including a text box and submit button to allow the user to add courses
    // Display the currently selected tests in a list with a delete button next to each one, which is part of the same form
    // if there is no query or if the submit pool button is pressed, add each test in the CurrentPool table into
    // the pool mapping table and truncate the currentPool table
    // Display a table which lists all the pools and the test barcodes in each pool
    // Look at the query to see what to display
    con.query('SELECT labID FROM CurrentUser', (err, result) => {
        if (err) throw err;
        var currUser = result[0];
        if(currUser === undefined) {
            res.redirect("/?error=true");
        }
        else if(currUser['labID'] === null) {
            res.redirect("/?error=true");
        }
        else {
            currUser = currUser['labID'];
            fs.readFile("templates/poolMapping.html", (err, data) => {
                res.writeHead(200, {"Content-Type" : "text/html"});
                res.write(data);
                var q = url.parse(req.url, true);
                var qdata = q.query;
                // If addPool !== "", add all of the test barcodes into pool map with the specified pool
                if(qdata.addPool !== "" && qdata.addPool !== undefined) {
                    const pool = qdata.addPoolBcode;
                    con.query('INSERT INTO pool VALUES("' + pool + '")', (err, result) => {
                        if(err) { 
                            res.write('<h2 style="color:red"> Invalid Pool Barcode </h2>')
                            displayPoolMapping(res, currUser);
                        }
                        else {
                            con.query('SELECT testBarcode FROM CurrentPool', (err, result) => {
                                if(err) throw err;
                                result.forEach(row => {
                                    const test = row['testBarcode'];
                                    var sql = `INSERT INTO PoolMap VALUES("`+test+'", "'+pool+'")';
                                    con.query(sql, (err, result) => {
                                        if(err) throw err;
                                    });
                                });
                                // Truncate table CurrentPool
                                con.query('TRUNCATE TABLE CurrentPool', (err, result) => {
                                    if(err) throw err;
                                    displayPoolMapping(res, currUser);
                                });
                            });
                        }
                    });
                }
                // If addTest === undefined, truncate the CurrentPool Table
                else if(qdata.addTest === undefined && (qdata.addPool === "" || qdata.addPool === undefined)) {
                    // Truncate table CurrentPool
                    con.query('TRUNCATE TABLE CurrentPool', (err, result) => {
                        if(err) throw err;
                    });
                    displayPoolMapping(res, currUser);
                }
                else if(qdata.addTest !== undefined) {
                    // Insert into CurrentPool the current test entered, only if that test is given by the current lab employee
                    const testBcode = qdata.addTestBcode;
                    var sql = `SELECT COUNT(*) FROM EmployeeTest WHERE collectedBy="`+currUser+'" AND testBarcode="'+testBcode+'"';
                    con.query(sql, (err, result) => {
                        if(err) throw err;
                        if(result[0]['COUNT(*)'] !== 1) {
                            res.write('<h2 style="color:red">Invalid Test Barcode</h2>')
                            displayPoolMapping(res, currUser);
                        }
                        else {
                            con.query('INSERT INTO CurrentPool VALUES("'+testBcode+'")', (err, result) => {
                                if(err) throw error;
                                displayPoolMapping(res, currUser);
                            });
                        }
                    });
                }
            });
        }
    });
});

function displayPoolMapping(res, currUser) {
    // Display tests in currentPool
    con.query('SELECT * FROM CurrentPool', (err, result) => {
        if(err) throw err;
        result.forEach(row => {
            const bcode = row['testBarcode'];
            res.write('<li>' + bcode + ' <input type="submit" name="' + bcode +
                '" value="Delete"></li>');
        });
        res.write('</ul><input type="text" name="addTestBcode"> <input type="submit" name="addTest" value="Add Test"><br><br>');
        res.write('<input type="submit" name="addPool" value="Add Pool"><br>');
        res.write('</form>');
        // Display pool tests for the current lab employee
        var sql = `SELECT poolBarcode,P.testBarcode FROM PoolMap P, EmployeeTest E
            WHERE E.testBarcode=P.testBarcode AND E.collectedBy="` + currUser +'"';
        con.query(sql, (err, result) => {
            if(err) throw err;
            res.write(`<br><br><table style="margin:auto;text-align:center;width:20%"
            cellspacing=0 border="1">`);
            // Table Heading
            res.write('<tr>');
            res.write('<th> Pool Barcode </th>');
            res.write('<th> Test Barcodes </th>');
            res.write('</tr>');
            // Add each row
            result.forEach(row => {
                const pbcode = row['poolBarcode'];
                const tbcode = row['testBarcode'];
                res.write('<tr>');
                res.write('<td>'+pbcode+'</td>');
                res.write('<td>'+tbcode+'</td>');
                res.write('</tr>');
            });
            // For each poolBarcode, collect all of the TestBarcodes within that pool
            // Table Rows
            // result.forEach(row => {
            //     const pbcode = row['poolBarcode'];
            //     con.query(`SELECT testBarcode FROM PoolMap WHERE poolBarcode="`+pbcode+'"', (err, result) => {
            //         res.write('<tr>');
            //         res.write('<td>' + pbcode + '</td>');
            //         res.write('<td>');
            //         // Print each test barcode associated with the pool
            //         for (let i = 0; i < result.length; i++) {
            //             const bcode = result[i]['testBarcode'];
            //             if(i === result.length-1) { res.write(bcode); }
            //             else { res.write(bcode+', '); }
            //         }
            //         res.write('</td>');
            //         res.write('</tr>');
            //     })
            // });
            res.write('</table>');
            res.write('<h2 style="text-align:center"> Lab ID: ' + currUser + '</h2>');
            res.write('</body></html>');
            res.end();
        });            
    });
}

// Well Testing
app.get("/well", (req, res) => {
    res.write("Well Testing");
    res.end();
});

// Test Collection Page
app.get("/test", (req, res) => {
    fs.readFile("templates/testCollection.html", (err, data) => {
        // Get the current lab employee that is logged in
        // and print the html template
        con.query('SELECT labID FROM CurrentUser', (err, result) => {
            if (err) throw err;
            var currUser = result[0];
            if(currUser === undefined) {
                res.redirect("/?error=true");
            }
            else if(currUser['labID'] === null) {
                res.redirect("/?error=true");
            }
            else {
                // If a new test has been added, add the corresponding
                // row into the database
                currUser = currUser['labID'];
                var q = url.parse(req.url, true);
                var qdata = q.query;
                const employeeId = qdata.id;
                if(employeeId !== undefined) {
                    const barcode = qdata.barcode;
                    var sql = `INSERT INTO EmployeeTest VALUES("` +
                        barcode + '", "' + employeeId + '", "' + 
                        '2020-11-28 09:30:00", "' + currUser +`")`;
                    con.query(sql, (err, result) => {
                        if(err) {
                            res.write('<p style="color:red;text-align:center">Invalid EmployeeID or Test Barcode</p><br>');
                        }
                    });
                }
                // If a test has been deleted, delete the corresponding row from the database
                const bcodeToDelete = qdata.bcode;
                if(bcodeToDelete !== undefined) {
                    var sql = 'DELETE FROM EmployeeTest WHERE testBarcode="'+bcodeToDelete+'"';
                    con.query(sql, (err, result) => { if(err) throw error; });
                }
                // Print the page
                res.writeHead(200, {"Content-Type" : "text/html"});
                res.write(data);
                // Print table of tests
                res.write('<form style="text-align:center" action="/test">');
                res.write(`<br><table style="margin:auto;text-align:center;width:20%"
                    cellspacing=0 border="1">`);
                sql = `SELECT employeeID,testBarcode FROM EmployeeTest WHERE collectedBy=`+currUser;
                con.query(sql, (err, result) => {
                    // Table heading
                    res.write('<tr>');
                    res.write('<th> EmployeeID </th>');
                    res.write('<th> Test Barcode </th>');
                    res.write('</tr>');
                    // Table rows
                    result.forEach(row => {
                        const eID = row['employeeID'];
                        const bcode = row['testBarcode'];
                        res.write("<tr>");
                        res.write('<td>');
                        res.write('<input type="radio" id="bcode" name="bcode" value="'+bcode+'">');
                        res.write('<label for="bcode">'+eID+'</label>');
                        res.write('</td>');
                        res.write('<td>' + bcode + '</td>');
                        res.write('</tr>');
                    });
                    res.write('</table><br>');
                    res.write('<input type="submit" value="Delete">');
                    res.write('</form>');
                    // Print LabID
                    res.write('<h2 style="text-align:center">');
                    res.write("Lab ID: " + currUser);
                    res.write('</h2>');
                    res.end();
                });
            }
        });
    });
});

port = process.env.PORT || 3000
app.listen(port, () => { console.log('server started!') });