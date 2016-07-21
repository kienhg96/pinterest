var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;


module.exports = function(passport){
    router.get('/', function(req, res){
        res.render('index', {title: 'Home'});
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
                return res.json({errCode: 0, msg: 'Signup Success'});
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
    })
    
    
    return router;
}
//module.exports = router;