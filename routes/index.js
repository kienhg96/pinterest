var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;


module.exports = function(passport){
    router.get('/', function(req, res){
        res.render('index', {title: 'Home'});
    });
    router.post('/login', function(req, res) {
        passport.authenticate('local', function(err, user, info) {
            if (err) { 
                throw err;
            }
            if (!user) { 
                return res.json({errCode: -1, msg: 'Login Failed'}); 
            }
            req.logIn(user, function(err) {
                if (err) { 
                    throw err; 
                }
                return res.json({errCode: 0, msg: 'Login success', user: {username: user.username, id: user._id.toString()}});
            });
        })(req, res);
    });

    
    router.post('/signup', function(req, res){
        var username = req.body.username;
        var password = req.body.password;
        mongo.connect(process.env.MONGO_URI, function(err, db){
            if (err) throw err;
            db.collection('user').findOne({username: username}, function(err, user){
                if (err) throw err;
                if (user) {
                    return res.json({errCode: -2, msg: 'Username already exists'});
                }
                db.collection('user').insert({username: username, password: password}, function(err, data){
                    db.close();
                    if (err) throw err;
                    var user = data.ops[0];
                    res.json({errCode: 0, msg: 'Signup Success', user: user});
                });
            });
        });
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
    })
    
    return router;
}
//module.exports = router;