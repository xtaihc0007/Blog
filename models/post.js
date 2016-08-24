/**
 * Created by bzhang on 8/22/2016.
 */
var mongodb=require('./db');
var mongo = require('mongodb')
var Comment=require('./comment')

function Post(_id,username, post, title, time) {
    this._id= _id;
    this.user=username;
    this.post=post;
    this.title=title;
    this.comments=[];
    if(time){
        this.time=time;
    }else {
        var now=new Date();
        this.time= now.getFullYear()+"/"+now.getMonth()+"/"+now.getDate();
    }
}

module.exports=Post;

Post.prototype.save=function save(callback) {
    var post={
        user:this.user,
        post:this.post,
        title:this.title,
        comments:[],
        time:this.time

    };

    mongodb.open(function (err, db) {
        if(err){
            return callback(err);
        }

        db.collection('posts',function (err, collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }

            collection.ensureIndex('user');
            collection.insertOne(post,{safe:true},function (err, post) {
                mongodb.close();
                callback(err,post);
            });
        });
    });
};

Post.get=function get(username,callback) {
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }

    db.collection('posts',function (err, collection) {
        if(err){
            db.close();
            return callback(err);
        }
        var query={};
        if(username){
            query.user=username;
        }
        collection.find(query).sort({time:-1}).toArray(function (err, docs) {
            mongodb.close();
           if(err){
               return callback(err,null)
           }
           var posts=[];
            docs.forEach(function (doc, index) {
                var post= new Post(doc._id,doc.user,doc.post,doc.title,doc.time);
                posts.push(post)
            });

            callback(null,posts);
        });
    });
    });
}


Post.getOne=function getOne(_id,callback) {
    mongodb.open(function (err, db) {
        if(err){
            return callback(err);
        }
        db.collection('posts',function (err, collection) {
            if(err){
                db.close();
                return callback(err);
            }

            var o_id = new mongo.ObjectID(_id);
            console.log("id= "+o_id);
            var query={};
            if(_id){
                query._id=o_id;
            }
            collection.findOne(query,function (err, doc) {
                mongodb.close();
                if(err){
                    return callback(err,null);
                }
                var p= new Post(_id,doc.user,doc.title,doc.time);

                doc.comments.forEach(function (d, index) {
                    console.log(d);
                    var c= new Comment(d.commentuser, d.commenttext, d.commenttime);

                    p.comments.push(c);
                });
                console.log(p);
                callback(null,p);
            });

        })
    })
}






















