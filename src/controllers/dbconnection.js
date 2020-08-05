var mysql = require("mysql");
var db;

function connectDatabase(){
    if(!db){
        db = mysql.createConnection({
            host:"localhost",
            user:"root",
            port:"3306",
            dbname:"SolarPanel"
        });

        db.connect(function(err){
            if(!err){
                console.log('Database is connected!');
            } else {
                console.log('Error connecting database');
            }
        });
    }
    return db;
}

module.exports = connectDatabase();