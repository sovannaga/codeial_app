const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const expresslayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

app.use(express.urlencoded());

//use cookie parser
app.use(cookieParser());  

//we need to tell in which folder the app lookout for the static files
app.use(express.static('./assets'));

//use layouts
app.use(expresslayouts);
//extract style and script from sub pages into the layouts
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//use express router
app.use('/', require('./routes/index'));

//set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');


app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server: ${err}`);
        return;
    }

    console.log(`Server is running on port: ${port}`);
});