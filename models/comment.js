/**
 * Created by bzhang on 8/24/2016.
 */

var mongodb= require('./db');

function Comment(commentuser, commenttext,commenttime) {
    this.commentuser= commentuser;
    this.commenttext= commenttext;
    this.commenttime= commenttime;
}

module.exports= Comment;

Comment.prototype.save= function (_id, collectionname, callback) {

    mongodb.open(function (err, db) {
        if(err){
            callback(err);
        }
        db.collection(collectionname,function (err, collection) {
           if(err){
               mongodb.close();
               callback(err);
           }
            var commentuser= this.commentuser;
            var commenttext= this.commenttext;
            var commenttime= this.commenttime;
            collection.update({"_id":_id},{"$push":{"comments":{"commentuser":commentuser,"commenttext":commenttext,"commenttime":commenttime}}},function (err) {
                if(err){
                    mongodb.close();
                    return callback(err);
                }
            });

        });
    })

}
