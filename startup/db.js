const mongoose = require('mongoose');

module.exports = function () {

mongoose.connect('mongodb+srv://playerzaf:12974711@cluster0-t59xr.mongodb.net/test?retryWrites=true')
.then(() => console.log('connected to mongodb....'))
.catch(err => console.error('could not connect', err));

// mongoose.connect('mongodb://localhost/pubgC-db')
//         .then(() => console.log('running'))
//         .catch(err => console.log('not running'));
}