var express = require('express')
var router = express.Router();
var mysql = require('mysql');
var ejs = require('ejs');
var fs = require('fs');
var db = require('../lib/db');
var bodyParser = require('body-parser');
var session = require('express-session');
const { response } = require('express');
var MySQLStore = require('express-mysql-session')(session);

var dbp = mysql.createPool(db);

router.use(bodyParser.urlencoded({extended : false}))

router.use(session({
    secret: '123wrwe87#123@@',
    resave : false,
    saveUninitialized: true,
    store: new MySQLStore(db),
}));

router.get('/pasing/:cur', function(req, res)
{


    var page_size = 10;
    var page_list_size = 10;
    var no="";
    var totalPageCount = 0;

    var qS = 'select count(*) as cnt from gall';
    getConnection().query(qS,function(error2,data)
    {
        if(error2)
        {
            console.log(error2 + "메인화면 mysql 조회실패");
            return;
        }

        totalPageCount = data[0].cnt;
        var curPage = req.params.cur;

        if(totalPageCount < 0)
        {
            totalPageCount = 0;
        }

        var totalPage = Math.ceil(totalPageCount / page_size);
        var totalSet = Math.ceil(totalPage / page_list_size);
        var curSet = Math.ceil(curPage / page_list_size) // 현재 셋트 번호
        var startPage = ((curSet - 1) * 10) + 1 //현재 세트내 출력될 시작 페이지
        var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지



        //현재페이지가 0 보다 작으면
if (curPage < 0) {
    no = 0
    } else {
    //0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
    no = (curPage - 1) * 10
    }
        
    var result2 = {
    "curPage": curPage,
    "page_list_size": page_list_size,
    "page_size": page_size,
    "totalPage": totalPage,
    "totalSet": totalSet,
    "curSet": curSet,
    "startPage": startPage,
    "endPage": endPage
    };

    var usession = {};


    if(req.session.user)
    {
        usession = req.session;
    }


    var qS2 = 'select * from gall left join user on gall.user_id = user.userid order by id desc limit  ? ,?';
    getConnection().query(qS2,[no,page_size], function(error, result)
    {
        if (error) {
            console.log("페이징 에러" + error);
            return
            }
            console.log(result);
            res.render('main.html', {data : result,pasing : result2, usession : usession});


    })
    
    })
});



router.get('/',function(req,res)
{
    res.redirect('/pasing/' + 1);
})






router.get('/insert', function(req, res)
{
    res.render('insert.html');
})

router.post('/insert', function(req, res)
{
    var body = req.body;
    getConnection().query('insert into gall(title, description,user_id) value (?,?,?)', [body.title, body.description,req.session.user.id], function()
    {
        res.redirect('/');
    })

})

router.get('/detail/:id', function(req, res)
{
    getConnection().query('select * from reply where gall_num = ?', [req.params.id], function(error, reply)
    {
        getConnection().query('select * from gall where id = ?', [req.params.id], function(error, result)
        {
            console.log(reply);
                    res.render('detail.html', {data : result, data2:reply});
        })

    })

})

router.post('/login', function(req,res)
{
    var id = req.body.username;
    var pw = req.body.password;

    getConnection().query('select * from user where userid = ? AND userpw = ?',[id,pw],function(error,result){
        if(error)
        {
            console.log(error);
        }
        else{
            if(result[0] == undefined)
            {
                console.log("asdf");
                res.redirect('login');
            }
            else{
                console.log(result);
                req.session.user = {
                    id : id,
                    pw:pw,
                    nick:result[0].nickname,
                    authorized : true

                };
            res.redirect('/');
            }
        }
    })
})

router.get('/logout', function(req,res)
{
    if(req.session.user){
        delete req.session.user
            res.redirect('/');
        
    }
    else{
        console.log('로그인 안되어있음');
        res.redirect('/');
    }
})

router.get('/login', function(req,res)
{
    var output = `
    <h1>Login</h1>
    <form action="/login" method="post">
      <p>
        <input type="text" name="username" placeholder="username">
      </p>
      <p>
        <input type="password" name="password" placeholder="password">
      </p>
      <p>
        <input type="submit">
      </p>
    </form>
    `;
    res.send(output);
})

router.get('/regist', function(req,res)
{
    res.render('regist.html');
})

router.post('/regist', function(req,res)
{
    var id = req.body.id;
    var pw = req.body.pw;
    var nick = req.body.nick;

    getConnection().query('INSERT INTO USER VALUES (?,?,?)', [id,pw,nick], function(error,data)
    {
        res.redirect('/');
    })
})

router.post('/id_check', function(req,res)
{
    var id = req.body.id;
    getConnection().query('select * from user where userid = ?', [id], function(err,data)
    {
        console.log(data);
        if(data.length != 0)
        {
            res.send('존재');
        }
        else{
            res.send('사용가능');
        }
    })
})

router.post('/reply/:id', function(req,res)
{
    var pase = req.params.id;
    getConnection().query('INSERT INTO REPLY(gall_num,user_id,description) VALUE (?,?,?)', [pase, req.session.user.id,req.body.id], function(err,data)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.send('success');
        }
    })
})



    function getConnection() {
        return dbp;
        }


module.exports = router;
        
    