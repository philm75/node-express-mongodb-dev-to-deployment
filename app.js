const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

const app = express();

// Load Routes
const ideas = require("./routes/ideas");
const users = require("./routes/users");

// Passport config
require('./config/passport')(passport);

// Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev')
        .then(() => console.log('MongoDB connected...'))
        .catch(err => console.log(err));

// Tell express to use handle bars template engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Static folder - sets public folder
app.use(express.static(path.join(__dirname, 'public')));

// Method override middleware
app.use(methodOverride("_method"));

// Middle ware for express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Global variables
app.use((req,res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null
    next(); // Call next piece of middleware
});

// Index Route
app.get("/", (req, res) => {
    res.render('index', {
        title: "Welcome"
    });
});

app.get("/about", (req, res) => {
    res.render('about');
});

app.use("/ideas", ideas);
app.use("/users", users);

const port = 5000;
app.listen(port, () => console.log(`Server started on port ${port}.`));