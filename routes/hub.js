/**
 * New node file
 */

exports.list = function(req, res){
  res.render('list',{title:"Hub // User list",numConnections:8});
};