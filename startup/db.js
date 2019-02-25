const mongoose = require('mongoose');

module.exports = function () {
mongoose.connect('mongodb+srv://Abhishek:gotranks@cluster0-uo8qi.mongodb.net/test?retryWrites=true')
.then(() => console.log('connected to mongodb....'))
.catch(err => console.error('could not connect', err));
}