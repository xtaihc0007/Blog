var express = require('express');
var router = express.Router();
var crypto=require('crypto');
var User= require('../models/user.js');
var Post= require('../models/post');


/* GET home page. */
router.get('/', function(req, res, next) {
   Post.get(null,function (err, posts) {
     if(err){
       posts=[];
     }

     res.render('index',{title:'My Simple Blog ',posts:posts});
   });
});
router.get('/u/:user/',function (req, res) {
 User.get(req.params.user,function (user,err ) {
   if(!user){
    req.flash('error','user does not exist.');
     return res.redirect('/');
   }

   Post.get(user.name,function (err, posts) {
     if(err){
       req.flash('error', err);
       return res.redirect('/');
     }
     res.render('user',{
        title:user.name,
        posts:posts
     });
   })


 });
});
router.get('/post',checkLogin);
router.get('/post',function (req, res){
  res.render('post',{title:'Post Content'});
});
router.post('/post',checkLogin);
router.post('/post',function (req, res) {
  var currentUser= req.session.user;
  if(req.body.post==""){
    req.flash('error','content can not be null.');
    return res.redirect('/post');
  }
var post= new Post(null,currentUser.name,req.body.post,req.body.title);
  //var post= new Post(currentUser.name, req.body.post, req.body.title);
  post.save(function (err) {
    if(err){
      req.flash('error',err);
      return redirect('/');
    }

    req.flash('success','content has been published.');
    res.redirect('/u/' + currentUser.name);
  })
});
router.get('/reg',checkNotLogin);
router.get('/reg',function (req, res) {
  res.render('reg',{title:'User register'});
});
router.post('/reg',checkNotLogin);
router.post('/reg',function (req, res) {
  if(req.body.username=="" || req.body.userpwd=="" || req.body.pwdrepeat==""){
       req.flash('error','input can not be null!');
     console.log('pwd null!');

      return res.redirect('/reg');
  }

  if(req.body.userpwd != req.body.pwdrepeat){
      req.flash('error','passwords must be same');
    return res.redirect('/reg');
  }

  var md5= crypto.createHash('md5');
  var password=md5.update(req.body.userpwd).digest('base64');

  var newUser= new User({
    name:req.body.username,
    password: password
  });

  User.get(newUser.name,function (user, err ) {


    console.log(user);
    console.log(err);
    if(user){
      err='username is not avaliable!';
      req.flash('error',err);
      return res.redirect('/reg');
    }
    
    newUser.save(function (err) {
      if(err){
        console.log(err);
        req.flash('error',err);
        return res.redirect('/reg');
      }

      req.session.user= newUser;
      req.flash('success',req.session.user.name+' register is successed!');
      res.redirect('/');
    });
  });

});
router.get('/login',checkNotLogin);
router.get('/login',function (req, res) {
  res.render('login',{title:'User login'});
});
router.post('/login',checkNotLogin);
router.post('/login',function (req, res) {

    console.log(req.body.userpwd);
    var md5= crypto.createHash('md5');
    var password=md5.update(req.body.userpwd).digest('base64');
  console.log(req.body.userpwd);
  User.get(req.body.username,function (user,err) {
    if(!user){

      req.flash('error','Invalid user.');
      return res.redirect('/login');
    }
    if(user.password!=password){
      req.flash('error','wrong password.');
      return res.redirect('/login');
    }
    req.session.user= user;
    req.flash('success','login successed.');
    res.redirect('/');
  });
});
router.get('/logout',function (req, res) {
  req.session.user=null;
  req.flash('success','logout successed.')
  res.redirect('/');
});

router.get('/c/:id',function (req, res) {

  Post.getOne(req.params.id,function ( err,post) {
    if(err){
      req.flash('error',err);
      res.redirect('/');
    }

    res.render('details',{post:post, title:'Details',});
  });
})
function checkLogin(req,res,next) {
  if(!req.session.user){
    req.flash('error','Login please.');
    res.redirect('/login');
  }
  next();
}
function checkNotLogin(req,res,next) {
  if(req.session.user){

    req.flash('error','login already');
    return res.redirect('back');
  }
  next();
}


module.exports = router;
