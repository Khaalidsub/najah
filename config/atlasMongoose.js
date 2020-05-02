const mongoose = require('mongoose');
mongoose
	.connect('mongodb+srv://subaan:wer123@cluster0-qfslx.mongodb.net/najah?retryWrites=true&w=majority', {
		useUnifiedTopology: true,
		useCreateIndex: true,
		useNewUrlParser: true,
		useFindAndModify: false
	})
	.catch((err) => {
		console.log(err);
	});

module.exports = mongoose;

//connection String

//
