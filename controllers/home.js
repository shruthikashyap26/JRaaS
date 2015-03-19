/**
 * GET /
 * Home page.
 */
exports.index = function(req, res) {
  res.render('home', {
    title: 'Home'
  });
};

exports.job = function(req, res) {
	var query = req.param('state');
	res.writeHead(200, {"Content-Type" : "text/plain"});
	res.write("You are visiting the "+ query + " page");
	res.end();
};