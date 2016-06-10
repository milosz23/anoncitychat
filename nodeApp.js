var fs = require('fs'),
    http = require('http'),
    //cloud9 deploy or local 3000 port
    port = process.env.PORT ? process.env.PORT : 3000;

    var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
/*
 Simple server *********************************************************************
 */
console.log('Starting server on port: ' + port);
http.createServer(function (req, res) {
    if(req.method==='POST' && req.url === '/find') {
        req.on('data', function (data) {
            console.log("POST data: " + data);



            var dataDecoded = JSON.parse(data);
            // Connection URL
            var url = 'mongodb://localhost:27017/test';
            // Use connect method to connect to the Server
            MongoClient.connect(url, function (err, db) {
                console.log("Connected correctly to server");
                var collection = db.collection("ololo");
                //1.Try to find
                collection.find({
                    city: dataDecoded.city,
                    user2: null
                }).toArray(function (err, docs) {
                    if(docs[0] === undefined) {
                        collection.insertOne({
                                user1: dataDecoded.name,
                                user2: null,
                                city:  dataDecoded.city
                            }, function(err,result){
                                db.close();
                                res.writeHead(200);
                                res.end('waiting');
                            });
                    } else {
                        collection.updateOne(
                            {
                                city: dataDecoded.city,
                                user2: null
                            },
                            {
                                $set: { "user2": dataDecoded.name }
                            }, function(err, results) {
                                //console.log(results);
                                db.close();
                                res.writeHead(200);
                                res.end('connected');
                            });
                    }
                });


            });

        })
    } else if(req.method==='POST') {
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
        fs.readFile(__dirname + req.url, function (err,data) {
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

