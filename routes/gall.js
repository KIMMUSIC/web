var express = require('express')
var router = express.Router();
var mysql = require('mysql');
var ejs = require('ejs');
var fs = require('fs');
var option = require('./option');

var loginData = {
    connectionLimit: option.storageConfig.connectionLimit,
    host: option.storageConfig.host,
    user: option.storageConfig.user,
    database: option.storageConfig.database,
    password: option.storageConfig.password
}

router.get('/', function(req, res)
{
    var queryString = 'select * from gall';
    getConnection().query(queryString, function(error, result)
    {
        if (error) {
            console.log("페이징 에러" + error);
            return
            }
            
            /*fs.readFile('main.html', 'utf-8', function(error, data)
            {
                res.send(ejs.render(data,{
                    data : result
                }));

            })*/

            res.render('main.html', {data : result});
            
        
    })
    
})

var pool = mysql.createPool({
    connectionLimit: loginData.connectionLimit,
    host: loginData.host,
    user: loginData.user,
    database: loginData.database,
    password: loginData.password
    })

    function getConnection() {
        return pool
        }


module.exports = router;
        
    