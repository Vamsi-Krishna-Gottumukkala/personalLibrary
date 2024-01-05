var con = require('./connection')
var exp = require('express');
var app = exp();

var bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/new', (req, res) => {
  res.sendFile(__dirname + '/create.html');
});

app.post('/new', (req, res) => {
  var name = req.body.name
  var type = req.body.type
  var status = req.body.status
  var score = req.body.score
  var author = req.body.author
  var completed = req.body.date

  con.connect((err)=>{
    if(err) throw err

    var sql = "insert into home(name, type, status, score, author, completed) values ?"

    var values = [
      [name, type, status, score, author, completed]
    ]
    con.query(sql,[values],(err)=>{
      if(err) throw err
      res.send('Added Successfully')
    })

  })

});

app.listen(7000);
