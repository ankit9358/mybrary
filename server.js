if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const indexRouter = require('./routes/index');
const authorRoutes = require('./routes/authors');
const bookRoutes = require('./routes/books');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');


app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({limit:'10 mb', extended : false}));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));
app.use('/', indexRouter);
app.use('/authors', authorRoutes);
app.use('/books', bookRoutes);


// ---------------------------database-------------------
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL, {  useNewUrlParser: true,useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('connected to mongoose'));


app.listen(process.env.PORT || 3000);