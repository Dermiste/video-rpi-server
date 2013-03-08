/**
 * New node file
 */

exports.list = function(req, res){

	var ip;
	var os=require('os');
	var ifaces=os.networkInterfaces();
	for (var dev in ifaces) {
	    var alias=0;
	    ifaces[dev].forEach(function(details){
		    if (details.family=='IPv4') {
		      console.log(dev+(alias?':'+alias:''),details.address);
		      ip = details.address;
		      ++alias;
		    }
	    });
    }

  res.render('list',{title:"Hub // User list",numConnections:8,ipAddress:ip});
};