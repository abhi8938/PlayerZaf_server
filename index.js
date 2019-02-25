
require('express-async-errors');
const startupDebugger = require('debug')('app:startup');
const express = require('express')
, redirect = require('express-redirect');
const bodyParser = require('body-parser');
const engines = require('consolidate');
const cors = require('cors');
const app = express();
redirect(app);



app.use(cors());
require('./startup/logging');
require('./startup/routes')(app);
// require('./startup/db')();
require('./startup/config');
require('./startup/prod')(app);
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

startupDebugger('first start');

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}....`)); 