var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;



const bodyParser = require('body-parser');
const cors = require('cors');
const port = 3000;

// 中介層
app.use(cors());
app.use(bodyParser.json());

// 靜態資料夾
app.use(express.static('public'));

// 分數 API
const scoreRouter = require('./routes/scores');
app.use('/scores', scoreRouter);

// 啟動伺服器
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
