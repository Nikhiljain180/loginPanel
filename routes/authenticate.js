var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var User = mongoose.model('User');

module.exports = function (passport) {

    //sends successful login state back to angular
    router.get('/success', function (req, res) {
        var cookie = req.cookies.id;
        if (cookie === undefined) {
            res.cookie('id', req.user._id);
            console.log('cookie created successfully');
        } else {
            console.log('cookie exists', cookie);
        }
        res.send({state: 'success', user: req.user ? req.user : null});
    });

    //sends failure login state back to angular
    router.get('/failure', function (req, res) {
        res.send({state: 'failure', user: null, message: "Invalid username or password"});
    });

    //log in
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/auth/success',
        failureRedirect: '/auth/failure'
    }));

    //sign up
    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/auth/success',
        failureRedirect: '/auth/failure'
    }));

    //log out
    router.get('/signout', function (req, res) {
        req.logout();
        if (req.cookies.id) {
            res.clearCookie("id");
        }
        res.redirect('/');
    });

    router.get('/checkLogin', function (req, res) {
        if (req.cookies.id) {
            User.findById(req.cookies.id, function (err, post) {
                if (!err) {
                    res.send(200, post.username);
                }
            });
        }
    });

    return router;

};