
/**
 * Module dependencies.
 */
var remote;
var express = require('express')
  , routes = require('./routes')
  , user   = require('./routes/user')
  , remote = require('./routes/remote')
  , hub = require('./routes/hub')
  , http   = require('http')
  , path   = require('path')
  ,ioSocket = require('socket.io')
  , ioClient = require('socket.io-client');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


app.get('/hub/list',hub.list);

var socket = ioSocket.listen(3001);

socket.notifyNumUserChanged = function(){
	var i =  0;
	for (var o in socket.open){
		i++;
	}
	socket.sockets.in('rpi').emit('numUserChanged',{numUsers:i});
}

socket.playEverywhere = function(){
	socket.sockets.in('rpi').emit('play');
}

socket.sockets.on('connection', function (skt) {
	socket.notifyNumUserChanged();
	 
	skt.on('disconnect', function (skt) {
		socket.notifyNumUserChanged();
	});
	skt.on('play', function (skt) {
		socket.playEverywhere();
	});	
	
	skt.on('joinRoom', function (data) {	
		skt.join(data.room);
		socket.notifyNumUserChanged();
	});		
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
