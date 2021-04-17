var express = require('express')
var router = express.Router();
var mysql = require('mysql');
var ejs = require('ejs');
var fs = require('fs');
var db = require('../lib/db');

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


    function getConnection() {
        return db;
        }


module.exports = router;
        
    