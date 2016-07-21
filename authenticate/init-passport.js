var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var express = require('express');
var router = express.Router();

exports = module.exports = function(passport){
    passport.use('login', new LocalStrategy(function(username, password, done){
        mongo.connect(process.env.MONGO_URI, function(err, db){
            if (err) return done(err);
            db.collection('user').findOne({username: username}, function(err, user){
                db.close();
                if (err) 
                    return done(err);
                if (!user)
                    return done(null, false);
                if (user.password !== password) {
                    return done(null, false);
                } 
                return done(null, user);
            });
        });
    }));
    
    passport.use('signup', new LocalStrategy(function(username, password, done){
        var findOrCreateUser = function(){
            mongo.connect(process.env.MONGO_URI, function(err, db){
               if (err) return done(err);
               db.collection('user').findOne({username: username}, function(err, user){
                   if (err) {
                       db.close()
                       return done(err);
                   }
                   if (user){
                       db.close();
                       return done(null, false);
                   }
                   else {
                       db.collection('user').insert({username: username, password: password}, function(err, data){
                           db.close();
                           if (err) return done(err);
                           return done(null, data.ops[0]);
                       });
                   }
               });
            });
        }
        process.nextTick(findOrCreateUser);
    }));
    
    passport.serializeUser(function(user, done){
        //console.log('serialize User ' + user._id.toString());
        return done(null, user._id.toString());
    });
    
    passport.deserializeUser(function(id, done){
        //console.log('deserialize User ' + id);
        mongo.connect(process.env.MONGO_URI, function(err, db){
            if (err) 
                return done(err);
            db.collection('user').findOne({_id: ObjectID(id)},
                function(err, user){
                db.close();
                return done(err, user);
            });
        });
    });
}
exports.router = router;