var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session      = require('express-session');
var flash        = require('req-flash');
var routes = require('./routes/index');
var users = require('./routes/users');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var settings = require('./settings');//数据库连接依赖包
//session会话存储于数据库依赖包（与教程中的区别）
var session = require('express-session');//session使用
var MongoStore = require('connect-mongo')(session);//mongodb使用

//提供session支持（与教程中的区别）
app.use(session({
  secret: settings.cookieSecret,
  key: settings.db,//cookie name
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 30},//30 days
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    /*db: settings.db,
     host: settings.host,
     port: settings.port*/
    url: 'mongodb://localhost/blog'
  })
}));

//引入 flash 模块来实现页面通知
var flash = require('connect-flash');//req.flash()使用

app.use(flash());//定义使用 flash 功能

app.use(function(req, res, next){
  console.log("app.usr local");
  //res.locals.xxx实现xxx变量全局化，在其他页面直接访问变量名即可
  //访问session数据：用户信息
  res.locals.user = req.session.user;
  //获取要显示错误信息
  var error = req.flash('error');//获取flash中存储的error信息
  res.locals.error = error.length ? error : null;
  //获取要显示成功信息
  var success = req.flash('success');
  res.locals.success = success.length ? success : null;
  next();//控制权转移，继续执行下一个app。use()
});

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});





app.listen(8099,'127.0.0.1', function(){
  console.log('Express server listening on port ' + app.get('port'));
});
module.exports = app;
