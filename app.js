var express = require('express');
var path = require('path');
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var connectMultiparty = require('connect-multiparty');
var expressSession = require('express-session');
var logger = require('morgan');
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(expressSession);
var app = express();
var port = process.env.PORT || 4000;
var fs = require('fs');

var dbUrl = 'mongodb://localhost/imooc';
mongoose.connect(dbUrl);
app.locals.moment = require('moment');

var models_path = __dirname + '/app/models';
var walk = function(path){
    fs
      .readdirSync(path)
      .forEach(file => {
          var newPath = path + '/' + file
          var stat = fs.statSync(newPath)

          if(stat.isFile()){
              if(/(.*)\(js|coffee\)/.test(file)){
                  require(newPath)
              }
          }
          else if(stat.isDirectory()){
              walk(newPath)
          }
      });
}

walk(models_path)

app.set('views', './app/views/pages');
app.set('view engine', 'jade');

app.use(serveStatic(path.join(__dirname,'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(connectMultiparty());
app.use(expressSession({
    secret: 'imooc',
    store: new mongoStore({
        url: dbUrl,
        collection: 'sessions'
    }),
    resave: false,
    saveUninitialized: true
}))

if('development' === app.get('env')){
    app.set('showStackError',true);
    app.use(logger('dev'));
    app.locals.pretty = true;
    mongoose.set('debug',true);
}

require('./config/routes')(app);

var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;
    
    console.log('app listening at http://localhost', host, port);
});

