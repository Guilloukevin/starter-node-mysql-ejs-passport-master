
var mysql = require('mysql');
 
var mysql = mysql.createConnection({
  host: "localhost",
  user: "kevin",
  password: "",
});
 
var databaseName = "passportjs";
 
mysql.connect(function(err) {
  if (err) throw err;
  mysql.query("create database "+databaseName, function (err, result, fields) {
    if (err) throw err;
  });
  mysql.end();
   
 
});
 
 
console.log("Base de donnée créer.");