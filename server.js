var express = require('express');
var app = express();

/*var connectionString = 'mongodb://tvivio:jingo123@ds033086.mlab.com:33086/vivio_test';

if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    connectionString = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
        process.env.OPENSHIFT_APP_NAME;
}

var mongoose = require('mongoose');
mongoose.connect(connectionString);*/

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// configure a public directory to host static content
app.use(express.static(__dirname + '/public'));

// require ("./test/app.js")(app);
require ("./assignment/app.js")(app);

app.set('ipaddress', (process.env.IP));
app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), app.get('ipaddress'));
