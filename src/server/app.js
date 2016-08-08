var express = require('express');
var app = express();


// route to client folder as a static resource
app.use(express.static('src/client'));

app.get('/', function (req, res) {
    res.sendfile('./src/client/main/index.html');
});

var port = process.env.PORT || 9000;

app.listen(port, function () {
    console.log('server running at port# ' + port);
});