const mongoose = require('mongoose');

module.exports = function () {
mongoose.connect('mongodb+srv://Abhishek:abhishek@cluster1-h7cgu.mongodb.net/pubgc-db?retryWrites=true')
.then(() => console.log('connected to mongodb....'))
.catch(err => console.error('could not connect', err));

// mongoose.connect('mongodb://localhost/pubgC-db')
//         .then(() => console.log('running'))
//         .catch(err => console.log('not running'));
}