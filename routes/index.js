var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;

module.exports = function(passport){
    router.get('/_', function(req, res){
        res.render('index_', {title: 'Home'});
    });
    
    router.get('/', function(req, res){
        var user = null;
        
        mongo.connect(process.env.MONGO_URI, function(err, db){
            if (err) throw err;
            db.collection('pin').find({}, {sort: [['date', 'desc']]}).toArray(function(err, data){
                if (err) throw err;
                if (req.isAuthenticated()){
                    user = {username: req.user.username, id: req.user._id.toString()};
                }
                res.render('index', {title: 'Home', user: user, pins: data});
                db.close();
            });
        });
    });    
    
    router.post('/login', function(req, res) {
        passport.authenticate('login', function(err, user, info) {
            if (err) { 
                throw err;
            }
            if (!user) { 
                return res.json({errCode: -1, msg: 'Login Failed'}); 
            }
            req.logIn(user, function(err) {
                if (err) throw err; 
                return res.json({errCode: 0, msg: 'Login success', user: {username: user.username, id: user._id.toString()}});
            });
        })(req, res);
    });
    
    
    router.post('/signup', function(req, res){
        passport.authenticate('signup', function(err, user, info){
            if (err) {
                throw err;
            }
            if (!user) {
                return res.json({errCode: -2, msg: 'Username Already exists'})
            }
            req.logIn(user, function(err){
                if (err) throw err;
                return res.json({errCode: 0, msg: 'Signup Success', username: req.user.username});
            });
        })(req, res); 
    });
    
    router.get('/logout', function(req, res){
        if (req.isAuthenticated()){
            req.logout();
            res.json({errCode: 0, msg: 'Logout success'});
        }
        else {
            res.json({errCode: -3, msg: 'You are not login'});
        }
    });
    
    router.get('/user', function(req, res){
        if (req.isAuthenticated()){
            res.json(req.user);
        }
        else {
            res.json(null);
        }
    });
    
    router.post('/postpin', function(req, res){
        if (req.isAuthenticated()){
            var imgUrl = req.body.imgUrl;
            var title = req.body.title;
            mongo.connect(process.env.MONGO_URI, function(err, db){
                if (err) throw err;
                db.collection('pin').insert({author: req.user.username, imgUrl: imgUrl, title: title, date: new Date()}, function(err, result){
                    if (err) throw err;
                    db.close();
                    res.json({errCode: 0, result: result.ops[0]});
                });
            });
        }
        else {
            res.json({errCode: -3, msg: "You are not login"});
        }
    });
    
    router.get('/pin', function(req, res){
        mongo.connect(process.env.MONGO_URI, function(err, db){
            if (err) throw err;
            db.collection('pin').find({}, {sort: [['date', 'desc']]}).toArray(function(err, data){
               if (err) throw err;
               res.json({errCode: 0, data: data});
               db.close();
            });
        });
    });
    
    router.get('/mypin', function(req, res){
       if (req.isAuthenticated()) {
           mongo.connect(process.env.MONGO_URI, function(err, db){
               if (err) throw err;
               db.collection('pin').find({author: req.user.username}, {sort: [['date', 'desc']]}).toArray(function(err, data){
                  if (err) throw err;
                  res.json({errCode: 0, data: data});
                  db.close();
               });
           });
       }
       else {
           res.json({errCode: -3, msg: 'You are not login'});
       }
    });

    router.get('/mypins', function(req, res){
        if (req.isAuthenticated()) {
            mongo.connect(process.env.MONGO_URI, function(err, db){
               if (err) throw err;
               db.collection('pin').find({author: req.user.username}, {sort: [['date', 'desc']]}).toArray(function(err, data){
                  if (err) throw err;
                  var user = {username: req.user.username, id: req.user._id.toString()};
                  res.render('index', {title: 'My pins', user: user, pins: data, mypins: true});
                  db.close();
               });
           });
        }
        else {
            res.redirect('/');
        }
    });

    router.post('/delpins', function(req, res){
        if (req.isAuthenticated()){
            var id = req.body.id;
            //console.log(id);
            mongo.connect(process.env.MONGO_URI, function(err, db){
                if (err) throw err;
                db.collection('pin').remove({_id: ObjectID(id)}, function(err){
                    if (err) throw err;
                    db.close();
                    res.json({errCode: 0});
                });
            });
        }
        else {
            res.json({errCode: -3, msg: 'You are not login'});
        }
    });


    return router;
}
//module.exports = router;