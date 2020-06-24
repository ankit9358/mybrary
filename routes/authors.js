const express = require('express');
const router = express.Router();
const Author = require('../models/author');
const Books = require('../models/books');

// all authers route

router.get('/', async (req, res) => {
    let searchOption = {};
    if (req.query.name != null && req.query.name !== '') {
        searchOption.name = new RegExp(req.query.name, 'i');
    }
    try {
        const authors = await Author.find(searchOption);
        res.render('authors/index', {
            authors: authors,
            searchOption: req.query
        });
    } catch {
        res.redirect('/');
    }

}
);
// new authers route form

router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() });

}
);

// creating new auther

router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    });
    try {
        const newAuthor = await author.save();
        res.redirect(`authors/${author.id}`);
    }
    catch {
        res.render('authors/new', { author: author, errorMessage: 'Error Creating Author' });
    }
}
);
// -----------------edititng authors ---------
router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        res.render('authors/edit', { author: author });

    }
    catch{
        res.redirect('authors');
    }

    // res.send('Edit ' + req.params.id);
}
);
//------------------showing authors-----------
router.get('/:id', async (req, res) => {
    try{
        const author = await Author.findById(req.params.id);
        const books = await Books.find({author: author.id}).limit(6).exec();
        res.render('authors/show', {author: author, books: books});

    }
    catch(err){
        console.log(err)
        res.redirect('/');
    }
});

// -----------------deleting authors----------
router.delete('/:id/delete', async (req, res) => {
    let author
    try {
        author =  await Author.findById(req.params.id);
        await author.remove();
        res.redirect('/authors')
    }
    catch {
        if(author == null){
            res.redirect('/');
        }
        else{
            res.redirect(`/authors/${author.id}`);
        }
        
    }
});

//------------------Update Authors------------
router.put('/:id', async (req, res) => {
    let author
    try {
        author =  await Author.findById(req.params.id);
        author.name = req.body.name;
        const newAuthor = await author.save();
        res.redirect(`/authors/${author.id}`);
    }
    catch {
        res.render('authors/edit', { author: author, errorMessage: 'Error Updating Author' });
    }
});


module.exports = router;
