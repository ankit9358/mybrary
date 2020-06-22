const express = require('express');
const router = express.Router();
const Books = require('../models/books');
const Author = require('../models/author');
const imageMimeTypes = ['image/jpeg', 'image/png','image/gif'];


// search books

router.get('/', async (req, res) => {
    let query = Books.find()
    if(req.query.title != null && req.query.title !=""){
        query = query.regex('title', new RegExp(req.query.title, 'i'));
    }
    if(req.query.pbbefore != null && req.query.pbbefore !=''){
        query = query.lte('publishDate', req.query.pbbefore)
    }
    if(req.query.pbafter != null && req.query.pbafter !=''){
        query = query.gte('publishDate', req.query.pbafter)
    }
    try {
        const books = await query.exec();
        // const authors = await Author.find(searchOption)
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

router.get('/new',async  (req, res) => {
    renderNewPage(res, new Books);
   
}
);

// create new books

router.post('/',  async (req, res) => {
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
        res.redirect('books');
    }
    catch(err) {
        console.log(err);
        renderNewPage(res, books, true);
    }
}
);

function saveCover(book, coverEncoded){
    if(coverEncoded ==null) return;
    const cover = JSON.parse(coverEncoded);
    if(cover != null && imageMimeTypes.includes(cover.type)){
        book.coverImage = new Buffer.from(cover.data,'base64');
        book.coverImagetype = cover.type
    }
}

async function renderNewPage(res, book, hasError = false){
    try {
        const authors = await Author.find({});
        const params ={
            authors: authors,
            books: book
        }
        if(hasError) params.errorMessage = "Error creating book";
        res.render('books/new', params);
    } catch {
        res.redirect('/books');

    }
}

module.exports = router;