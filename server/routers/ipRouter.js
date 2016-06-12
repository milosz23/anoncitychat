var express = require('express');

var ipRouter = express.Router();

ipRouter.route('/')
    .get(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        var ip = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        res.writeHead(200);
        res.end(ip);
    });

module.exports = ipRouter;