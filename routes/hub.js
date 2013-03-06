/**
 * New node file
 */
 
exports.connect = function(req, res){
	console.log(req);
	console.log(res);
  //res.render('remote',{title:"Remote"});
};

exports.list = function(req, res){
  res.render('list',{title:"Hub // User list",numConnections:8});
};