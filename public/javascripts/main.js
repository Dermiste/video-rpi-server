$(document).ready(function(){
	var socket = io.connect('http://'+ip+':3001');
	socket.on('numUserChanged',function(data){
		console.log(data);	
		var rpiList = $('<ul/>');
		$.each(data.users,function(index,value){
			var li = $('<li/>')
        		.appendTo(rpiList)
        		.text(value);
        	console.log("li id : "+value);	
		});
		$("#userList").html(rpiList);
		$("#numConnected").text(data.users.length);
	});	
	socket.on('connect',function(data){
		socket.emit('joinRoom',{room:'admin'});
	});		
	socket.on('play',function(data){
		console.log('play received');
		$('#logs').append('Play received<br/>');
	});		
	$("#playButton").click(function(){
		socket.emit('play');
	});
	$("#updateUserNumButton").click(function(){
		socket.emit('updateUserNum');
	});	
});