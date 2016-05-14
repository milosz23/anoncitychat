var fs = require('fs'),
    http = require('http'),
    //cloud9 deploy or local 3000 port
    port = process.env.PORT ? process.env.PORT : 3000;

/*
 Simple server *********************************************************************
 */
console.log('Starting server on port: ' + port);
http.createServer(function (req, res) {
    if(req.method==='POST') {
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

