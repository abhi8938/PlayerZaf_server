const mongoose = require('mongoose');

module.exports = function () {
mongoose.connect('mongodb://localhost/pubgC-db')
.then(() => console.log('connected to mongodb....'))
.catch(err => console.error('could not connect', err));
}