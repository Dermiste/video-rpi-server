
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

var iosocket = ioSocket.listen(3001);

iosocket.notifyNumUserChanged = function(){	
	var users = [];
	if (iosocket.sockets.manager.rooms['/rpi']){
		iosocket.sockets.manager.rooms['/rpi'].forEach(function (id) {
			users.push(iosocket.sockets.socket(id).rpiID);
		});
	}
	iosocket.sockets.in('rpi').emit('numUserChanged',{users:users});
	iosocket.sockets.in('admin').emit('numUserChanged',{users:users});
}

iosocket.playEverywhere = function(){
	iosocket.sockets.in('rpi').emit('play');
}

iosocket.pauseEverywhere = function(){
	iosocket.sockets.in('rpi').emit('pause');
}

iosocket.stopEverywhere = function(){
	iosocket.sockets.in('rpi').emit('stop');
}

iosocket.sockets.on('connection', function (skt) {
	iosocket.notifyNumUserChanged();
	 
	skt.on('disconnect', function (skt) {
		iosocket.notifyNumUserChanged();
	});
	skt.on('close', function (skt) {
		iosocket.notifyNumUserChanged();
	});
	
	skt.on('play', function (skt) {
		iosocket.playEverywhere();
	});	
	
	skt.on('pause', function (skt) {
		iosocket.pauseEverywhere();
	});	
	
	skt.on('stop', function (skt) {
		iosocket.stopEverywhere();
	});			
	
	skt.on('updateUserNum', function (skt) {
		iosocket.notifyNumUserChanged();
	});		
	
	skt.on('joinRoom', function (data) {	
		console.log('joinRoom -> '+data.room);
		skt.join(data.room);
		iosocket.notifyNumUserChanged();
	});	
	skt.on('setID', function (data) {	
		console.log('setID -> '+data.id);
		skt.rpiID = data.id;
	});			
});



http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
