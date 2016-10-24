var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var  postSchema = new Schema({
	content: String,
	user: {
		type: Schema.ObjectId,
		ref: 'users'
	}
});

var PostModel = mongoose.model('posts', postSchema);
