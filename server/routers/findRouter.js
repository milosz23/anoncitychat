var express = require('express');
var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;

var findRouter = express.Router();

findRouter.route('/')
    .post(function (req, res, next) {
        req.on('data', function (data) {
            console.log("POST data: " + data);

            var dataDecoded = JSON.parse(data);
            // Connection URL
            var mongoURL = process.env.IP ? 
                'mongodb://' + process.env.IP +':27017/test' :
                'mongodb://localhost:27017/test';
            
            // Use connect method to connect to the Server
            MongoClient.connect(mongoURL, function (err, db) {
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

        });
    });

module.exports = findRouter;