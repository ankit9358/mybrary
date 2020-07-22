const express = require('express');
const router = express.Router();
const Books = require('../models/books');
const Author = require('../models/author');
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];


// search books

router.get('/', async (req, res) => {
    let query = Books.find()
    if (req.query.title != null && req.query.title != "") {
        query = query.regex('title', new RegExp(req.query.title, 'i'));
    }
    if (req.query.pbbefore != null && req.query.pbbefore != '') {
        query = query.lte('publishDate', req.query.pbbefore)
    }
    if (req.query.pbafter != null && req.query.pbafter != '') {
        query = query.gte('publishDate', req.query.pbafter)
    }
    try {
        const books = await query.exec();
        res.render('books/index', {
            books: books,
            searchOption: req.query
        });
    } catch {
        res.redirect('/');
    }
}
);

// new books craete form

router.get('/new', async (req, res) => {
    renderNewPage(res, new Books);

}
);

// create new books

router.post('/', async (req, res) => {
    const books = new Books({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        description: req.body.description,
    });
    saveCover(books, req.body.cover);
    try {
        const newBook = await books.save();
        res.redirect('/books');
    }
    catch (err) {
        console.log(err);
        renderNewPage(res, books, true);
    }
}
);

function saveCover(book, coverEncoded) {
    if (coverEncoded == null) return;
    const cover = JSON.parse(coverEncoded);
    if (cover != null && imageMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, 'base64');
        book.coverImagetype = cover.type;
    }
}

async function renderNewPage(res, book, hasError = false) {
    try {
        const authors = await Author.find({});
        const params = {
            authors: authors,
            books: book
        }
        if (hasError) params.errorMessage = "Error creating book";
        res.render('books/new', params);
    } catch {
        res.redirect('/books');

    }
}

// ----------------------edit book--------------------
router.get('/:id/edit', async (req, res) => {
    try {
        const books = await Books.findById(req.params.id);
        const authors = await Author.find({});
        const params = {
            authors: authors,
            books: books
        }
        res.render('books/edit', params);

    }
    catch (err) {
        res.redirect('/books');
    }


})

// ----------------------show book--------------------
router.get('/:id', async (req, res) => {
    // res.send('book '+ req.params.id);
    try {
        const books = await Books.findById(req.params.id).populate('author').exec();
        res.render('books/show', { books: books });

    }
    catch (err) {
        res.redirect('/');
    }
});





// ----------------------update boook-----------------
router.put('/:id', async (req, res) => {
    let books
    let authors
    try {
        authors = await Author.find({});
        books = await Books.findById(req.params.id);
        // author.name = req.body.name;title: req.body.title,
        books.author = req.body.author;
        books.publishDate = new Date(req.body.publishDate);
        books.pageCount = req.body.pageCount;
        books.description = req.body.description;
        if (req.body.cover != null && req.body.cover !== '') {
            saveCover(books, req.body.cover);
        }
        await books.save();
        res.redirect(`/books/${books.id}`);
    }
    catch (err) {

        if (books != null) {
            res.render('books/edit', { books: books, authors: authors, errorMessage: 'Error Editing Author' });
          } else {
            redirect('/');
          }
        
        
        console.log(err);
    }
});



// ----------------------delete book------------------
router.delete('/:id/delete', async (req, res) => {
    let books
    try {
        books =  await Books.findById(req.params.id);
        await books.remove();
        res.redirect('/books');
    }
    catch {
        if(books == null){
            res.redirect('/');
        }
        else{
            res.redirect(`/books/${author.id}`);
        }
        
    }
});

module.exports = router;