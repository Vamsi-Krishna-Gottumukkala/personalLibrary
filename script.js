var con = require("./connection");
var exp = require("express");
var app = exp();
const path = require("path");

var bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(exp.static(path.join(__dirname, "public")));

con.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL");
});

app.get("/new", (req, res) => {
  res.sendFile(__dirname + "/create.html");
});

app.post("/new", (req, res) => {
  var name = req.body.name;
  var type = req.body.type;
  var status = req.body.status;
  var score = req.body.score;
  var author = req.body.author;
  var completed = req.body.date;

  con.connect((err) => {

    var sql =
      "INSERT INTO home (name, type, status, score, author, completed) VALUES ?";

    var values = [[name, type, status, score, author, completed]];
    con.query(sql, [values], (err) => {
      if (err) throw err;
      res.redirect("/");
    });
  });
});

app.get("/", (req, res) => {
  var sql = "SELECT * FROM home";
  con.query(sql, (err, result) => {
    if (err) throw err;
    res.render(__dirname + '/index', { books: result });
  });
});

app.get('/delete-books',(req,res)=>{
  var sql = "DELETE FROM home where name=?";

  var name = req.query.name;

  con.query(sql, [name], (err, result) => {
    if (err) throw err;
    res.redirect('/')
  });
})

app.get('/update-books',(req,res)=>{
  var sql = "SELECT * FROM home where name=?";

  var name = req.query.name;

  con.query(sql, [name], (err, result) => {
    if (err) throw err;
    res.render(__dirname+"/update-books",{books:result})
  });
})

app.post('/update-books', (req, res) => {
  var name = req.body.name;
  var type = req.body.type;
  var status = req.body.status;
  var score = req.body.score;
  var author = req.body.author;
  var completed = req.body.date;
  var bid = req.body.bid;

  var sql = "UPDATE home SET name=?, type=?, status=?, score=?, author=?, completed=? WHERE bid=?" ;

  con.query(sql, [name, type, status, score, author, completed, bid], (err, result) => {
    if (err) throw err;
    res.redirect('/');
  });
});

app.get('/search-books',(req,res)=>{
  var sql = "SELECT * FROM home";
  con.query(sql, (err, result) => {
    if (err) throw err;
    res.render(__dirname + '/search-books', { books: result });
  });
})

app.get('/search',(req,res)=>{

  var name = req.query.name;
  var author = req.query.author;

    var sql = "SELECT * FROM home WHERE name LIKE '%"+name+"%'AND author LIKE '%"+author+"%'"

    con.query(sql,(err, result)=>{
      if(err) throw error
      res.render(__dirname+"/search-books",{books:result})
    })
})

app.listen(7000, () => {
  console.log("Server is running on port 7000");
});
