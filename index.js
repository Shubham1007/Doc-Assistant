var express = require("express");
var app= express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var mysql = require('mysql');
var path = require('path');
var users =[];
var onlineuser =[];

//configuration
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'html');


var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "mydb"
});

app.get("/",function(req,res)
{
	   
	res.sendFile(__dirname+"/main.html");
});

app.get("/index",function(req,res)
{
	res.sendFile(__dirname+"/index.html");
});

app.get("/doc",function(req,res)
{
	res.sendFile(__dirname+"/doctor.html");
});

app.get("/doct",function(req,res)
{
	res.sendFile(__dirname+"/doct.html");
});

// database connection and insertion 

app.post("/sub",function(req,res)
{
	con.connect(function(err) 
{
  if (err) 
  throw err;
else
{
  console.log("Database connected!");
  var names =  document.forms["myform"]["name1"].value;
  var ages = document.forms["myform"]["age1"].value;
  var symptom = document.forms["myform"]["symptom1"].value;
  var files = document.forms["myform"]["file1"].value;
  
  var sql = "INSERT INTO information (name,age,symptoms,file) VALUES (names,ages,symptom,files)";
  con.query(sql, function (err, result) 
  {
    if (err)
		throw err;
    console.log("1 record inserted");
  });
} });	
});


// sockets connection 
io.sockets.on("connection",function(socket){
	users.push(socket);
	console.log("New user connected "+users.length),

	socket.on("disconnect",function(){
		users.splice(users.indexOf(socket),1);
		onlineuser.splice(onlineuser.indexOf(socket.username),1);
		console.log("User disconnected "+users.length);
	});

	socket.on("new user",function(data){
		socket.username = data;
		onlineuser.push(socket.username);
		console.log("user conected "+socket.username);
		updateuser();
	});

	socket.on("msg",function(name,msg){
		io.sockets.emit("rmsg",{name:name,msg:msg});
	});

	function updateuser(){
		io.sockets.emit("get user",onlineuser);
	}

});




http.listen(1234,function(){
	
console.log("Server Created with port 1234");
});