var fs = require('fs'),
    http = require('http'),
//cloud9 deploy or local 3000 port
    port = process.env.PORT ? process.env.PORT : 3000;

var mongo = require('mongodb');
var MongoClient = mongo.MongoClient,
    assert = require('assert');
// var express = require('express');
// var app = express();
// var server = http.createServer(app);


/*
 Simple server *********************************************************************
 */
console.log('Starting server on port: ' + port);
var server = http.createServer(function (req, res) {
    if (req.method === 'POST' && req.url === '/find') {
        req.on('data', function (data) {
            console.log("POST data: " + data);

            var dataDecoded = JSON.parse(data);
            // Connection URL
            var url = 'mongodb://localhost:27017/test';
            // Use connect method to connect to the Server
            MongoClient.connect(url, function (err, db) {
                console.log("Connected to mongoDB");
                var collection = db.collection("userChats");
                //1.Try to find
                collection.find({
                    city: dataDecoded.city,
                    user2: null
                }).toArray(function (err, docs) {
                    if (docs[0] === undefined) {
                        collection.insertOne({
                                user1: dataDecoded.name,
                                user2: null,
                                city: dataDecoded.city
                            }, function (err, result) {
                                var responseData = JSON.stringify({
                                    status: 'waiting',
                                    room: result.ops[0]._id
                                });
                                db.close();
                                res.writeHead(200);
                                res.end(responseData);
                            }
                        );
                    } else {
                        collection.updateOne(
                            {
                                _id: docs[0]._id
                            },
                            {
                                $set: {"user2": dataDecoded.name}
                            }, function (err, result) {
                                var responseData = JSON.stringify({
                                    status: 'connected',
                                    room: docs[0]._id
                                });
                                db.close();
                                res.writeHead(200);
                                res.end(responseData);
                            }
                        );

                    }
                });


            });

        })
    } else if (req.method === 'POST') {
        req.on('data', function (data) {
            console.log("POST data: " + data);
            var date = new Date();
            data = date.toLocaleTimeString() + ", " + data + '<br>';
            fs.appendFile('log.html', data, function (err) {
                if (err) throw err;
                console.log('The data was appended to file!');
            });
            res.writeHead(200);
            res.end(data);
        });
    } else if (req.url === '/ip') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        var ip = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        res.writeHead(200);
        res.end(ip);
    } else {
        if (req.url === "/") {
            req.url = '/index.html'
        }
        console.log('GET file: ' + req.url);
        fs.readFile(__dirname + '/../client/public' + req.url, function (err, data) {
            if (err) {
                res.writeHead(404);
                res.end(JSON.stringify(err));
                return;
            }
            res.writeHead(200);
            res.end(data);
        });
    }
}).listen(port);
//************************************************************************************

var io = require('socket.io').listen(server);

var activeRooms = [];
io.on('connection', function (socket) {
    socket.on('join room', function (room) {
        console.log(socket.id);
        socket.join(room);
        activeRooms[socket.id] = room;
    });

    socket.on('chat message', function (msg) {
        console.log(socket.rooms);
        for (var room in socket.rooms) {
            var userRoom;
            if (room.indexOf('userRoom_') !== -1) {
                userRoom = room;
                break;
            }
        }
        socket.broadcast.to(userRoom).emit('chat message', msg);
    });

    socket.on('disconnect', function () {
        console.log('Got disconnect!', activeRooms);
        var room = activeRooms[socket.id];
        if (!room) {
            return;
        }
        var chatId = room.slice('userRoom_'.length);

        var url = 'mongodb://localhost:27017/test';
        // Use connect method to connect to the Server
        MongoClient.connect(url, function (err, db) {
            console.log("Connected to mongoDB");
            var collection = db.collection("userChats");
            var o_id = new mongo.ObjectID(chatId);
            collection.deleteOne({
                '_id': o_id
            }, function (err, result) {
                db.close();
            });
        });
    });
});

