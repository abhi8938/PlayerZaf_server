
require('express-async-errors');
const startupDebugger = require('debug')('app:startup');
const express = require('express');
const bodyParser = require('body-parser');
const engines = require('consolidate');
const cors = require('cors');
const app = express();
redirect(app);


require('./startup/logging');
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config');
require('./startup/prod')(app);


startupDebugger('first start');

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on port ${port}....`)); 