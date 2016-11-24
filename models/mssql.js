var sql = require('mssql');

function query(tsql, next) {
	//sql.globalConnection.connect(function(err) {
		var request = new sql.Request(sql.globalConnection);
		request.query(tsql, function(err, recordset) {
			if(err) console.log(err);
			next(err, recordset);
		});
	//});
}

module.exports = {
	query: query
};
