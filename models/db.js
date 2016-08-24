/**
 * Created by bzhang on 8/17/2016.
 */

var settings=require('../settings'),
    Db=require('mongodb').Db,
    Server=require('mongodb').Server;
module.exports = new Db(settings.db, new Server(settings.host,27017),{safe: true});