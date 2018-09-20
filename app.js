'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var serve = require('express-static');
var ejs = require('ejs');
var child_process = require('child_process');
var exec = child_process.exec;
var app = express();
var fs = require('fs');
var path = require('path');
var port = 8080;

var mysql = require('mysql');

var connection = mysql.createConnection({
	host: '203.113.146.146',
	port: '3306',
	user: 'root',
	password: 'pkerp@2017',
	database: 'vhrmdb',
	debug: false
});

app.set('port', 8080);

app.listen(port, function () {
	console.log('Example app listening on port 8080!');
});

app.use(express.static(path.join(__dirname, '/public')));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile);

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());

connection.connect(function (err) {
	if (!err) {
		console.log("Database is connected..");
	} else {
		console.log("Error connecting database..");
		connection.end();
	}
});

app.get('/', function (req, res) {
	res.render('index.html');
});

app.get('/department', function (req, res) {
	res.render('department.html');
});

app.get('/admin', function (req, res) {
	res.render('admin.html');
});


app.get('/ab', function (req, res) {
	connection.query("SELECT * from emp", function (err, result, fields) {
		var content = JSON.stringify(result);

		res.writeHead(200, {
			"Content-Type": "application/json; charset=utf-8"
		});
		res.write(content);
		res.end();

	});
});

app.post('/getCorporation', function (req, res) {
	connection.query("SELECT DISTINCT CORPORATION, CCODE from department ORDER BY CCODE", function (err, result, fields) {
		var content = JSON.stringify(result);

		res.writeHead(200, {
			"Content-Type": "application/json; charset=utf-8"
		});
		res.write(content);
		res.end();

	});
});

app.post('/getDepartment', function (req, res) {
	connection.query("SELECT * from department", function (err, result, fields) {
		var content = JSON.stringify(result);

		res.writeHead(200, {
			"Content-Type": "application/json; charset=utf-8"
		});
		res.write(content);
		res.end();

	});
});

app.post('/department/getReporter', function (req, res) {
	connection.query("SELECT * from report ORDER BY NAME", function (err, result, fields) {
		var content = JSON.stringify(result);

		res.writeHead(200, {
			"Content-Type": "application/json; charset=utf-8"
		});
		res.write(content);
		res.end();

	});
});