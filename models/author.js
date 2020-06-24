const mongoose = require('mongoose');
const books = require('./books');

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

authorSchema.pre('remove', function (next) {
    books.find({ author: this.id }, (err, books) => {
        if (err) {
            next(err);
        }
        else if (books.length > 0) {
            next(new Error('This author has still books'));
        }
        else {
            next();
        }
    }
    );
});

module.exports = mongoose.model('Author', authorSchema);