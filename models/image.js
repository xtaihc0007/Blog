/**
 * Created by bzhang on 8/23/2016.
 */

var mongodb= require('./db');
var Comment=require('./comment');
function Image(_id,username, byteImg, time) {
    this._id=_id;
    this.username= username;
    this.byteImg= byteImg;
    this.time= time;
    this.coments=[];

}




module.exports= Image;


Image.prototype.save(function (callback) {

    var image={
        username:this.username,
        byteImg:this.byteImg,
        time:this.time,
        comments:[]

    };

    mongodb.open(function (err, db) {
       if(err){
           return callback(err);
       }

       db.collection('images',function (err, collection) {
           if(err){
               mongodb.close();
               return callback(err);
           }
             //collection.insertOne({"username":username,"byteImg":byteImg,"time":time,"comments":[]},function (err) {
               collection.insertOne(image,function (err) {
               if(err){
                       mongodb.close();
                       return callback(err);
                   }
               });
           callback(null);
       });
    });
});

Image.getOne=function (_id,callback) {
    mongodb.open(function (err, db) {
        if(err){
            callback(err);
        }
        db.collection('image',function (err, collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            
            collection.findOne({"_id":_id},function (err, doc) {
                if(err){
                    mongodb.close();
                    return callback(err);
                }
                var img= new Image(doc._id,doc.username,doc.byteImg,doc.time);

                doc.coments.forEach(function (index, comment) {
                    var c= new Comment(comment.commentuser, comment.commenttext,comment.commenttime);
                    img.coments.add(c);
                });

                callback(img);
            });
        })
    })
}























