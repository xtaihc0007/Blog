/**
 * Created by bzhang on 8/19/2016.
 */


var mongodb=require('./db');

function User(user) {
    this.name=user.name;
    this.password= user.password;
};

module.exports= User;

User.prototype.save= function save(callback) {
    var user ={
        name:this.name,
        password:this.password
    };

    mongodb.open(function (err, db) {
        if(err){
            return callback(err);
        }

        db.collection('users',function (err, collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }

            collection.insertOne(user,{safe:true},function (err, user) {
                mongodb.close();
                callback(err,user);
            });
        });
    });
}


User.get=function get(username,callback) {

    mongodb.open(function (err,db) {
        if(err){
            mongodb.close();
            return callback(err);
        }

        db.collection('users',function (err, collection) {
            if(err){
                mongodb.close();
                callback(err);
            }

            collection.findOne({name:username},function (err, doc) {
                mongodb.close();



                if(doc){
                    var user= new User(doc);
                    console.log('server side '+ user.name);
                    callback(user,null);
                }else {
                    callback(null,'not found!');
                }
            });
        });
    });
};