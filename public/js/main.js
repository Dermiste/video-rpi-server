$(document).ready(function(){
	var ip = #{ipAddress}
	var socket = io.connect('http://localhost:3001');
	socket.on('numUserChanged',function(data){
		$('#numConnections').html(data.numUsers);
	});	
	socket.on('connect',function(data){
		//console.log('join room');
		socket.emit('joinRoom',{room:'rpi'});
	});		
	socket.on('play',function(data){
		console.log('play received');
		$('#logs').append('Play received<br/>');
	});		
	$("#playButton").click(function(){
		socket.emit('play');
	});
});