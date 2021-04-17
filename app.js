var express = require('express');
var app = express();
var ejs = require('ejs');


app.set('views', __dirname + '/');
app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile);

var router = require('./routes/gall.js');
app.use(router);

app.listen(3000, function()
{
    console.log("서버가동");    
})