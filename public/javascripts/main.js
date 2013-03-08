$(document).ready(function(){
	//var ip = #{ipAddress}
	var socket = io.connect('http://'+ip+':3001');
	socket.on('numUserChanged',function(data){
		$('#numConnections').html(data.numUsers);
	});	
	socket.on('connect',function(data){
		//console.log('join room');
		var random = Math.random();
		if (random > 0.5)
			socket.emit('joinRoom',{room:'rpi'});
		else
			socket.emit('joinRoom',{room:'admin'});
	});		
	socket.on('play',function(data){
		console.log('play received');
		$('#logs').append('Play received<br/>');
	});		
	$("#playButton").click(function(){
		socket.emit('play');
	});
});