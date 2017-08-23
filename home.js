var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mysql = require('mysql');
var count = 0;

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "chattest"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log(count + ' A user connected');
  count++;
  var sql;
  sql = "SELECT * FROM text";
  con.query(sql, function (err, result) {
    if (err) throw err;
    io.sockets.emit('loading', result);
  });

  socket.on('msg', function(data){
    //Send message to everyone
    sql = "INSERT INTO text VALUES ('" + data.user + "', '" + data.msg + "')";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 message from " + data.user + " inserted, ID: " + result.insertId);
    });
    io.sockets.emit('newmsg', data);
  })
});

http.listen(3000, function(){
  console.log('listening on localhost:3000');
});