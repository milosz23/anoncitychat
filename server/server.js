//cloud9 deploy or local 3000 port
var port = process.env.PORT ? process.env.PORT : 3000;


var express = require('express');
var app = express();
var http = require('http').Server(app);

var ipRouter = require('./routers/ipRouter.js');
var findRouter = require('./routers/findRouter.js');

app.use('/ip', ipRouter);
app.use('/find', findRouter);
app.use(express.static(__dirname + '/../client/public'));

http.listen(port, function () {
    console.log('Listening on port ' + port);
});


//TODO: move socket logic somewhere
var io = require('socket.io')(http);
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
var activeRooms = [];
io.on('connection', function (socket) {
    socket.on('join room', function (room) {
        console.log(socket.id);
        socket.join(room);
        activeRooms[socket.id] = room;

        if (socket.adapter.rooms[room].length === 2) {
            io.to(room).emit('start', '');
        };
    });

    socket.on('chat message', function (msg) {
        msg = {
            user: msg.user,
            text: msg.text.replace(/(<([^>]+)>)/ig,"")  //strip tags from user input
        };
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
        var msg = {
            user: '<i>SYSTEM</i>',
            text: '<h1>Partner disconnected.. <a href="/#/find">Find new</a></h1>'
        };
        socket.broadcast.to(room).emit('chat message', msg);
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

