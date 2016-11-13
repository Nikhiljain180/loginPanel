/**
 * Created by Nikhil Jain on 14-11-2016.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.route('/')
    .get(function(req, res, next) {
        res.send(req.cookies);
    });
module.exports = router;
