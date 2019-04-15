
require('express-async-errors');
const startupDebugger = require('debug')('app:startup');
const path = require('path');
const express = require('express')
    , redirect = require("express-redirect");
const bodyParser = require('body-parser');
const engines = require('consolidate');
const cors = require('cors');
const app = express();
redirect(app); 
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));
app.engine("ejs", engines.ejs);
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(cors());
require('./routes/testtxn')(app);
require('./startup/logging');
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config');
require('./startup/prod')(app);


startupDebugger('first start');

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`listening on port ${port}....`)); 
