

module.exports = function(req, res, libs){
	if(req.headers.api in api){
		api[req.headers.api](req, res, libs)
	}
}