var express = require('express')
var router = express.Router();
var mysql = require('mysql');
var ejs = require('ejs');
var fs = require('fs');

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
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    database: 'web',
    password: 'rhleh3060'
    })

    function getConnection() {
        return pool
        }


module.exports = router;
        
    