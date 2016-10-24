var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	name: String
});

var UserModel = mongoose.model('users', userSchema);
