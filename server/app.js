var express = require('express'),
	bodyParser = require('body-parser'),
	app = express();

var allowCrossDomain = function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
};

app.use(bodyParser({strict: false}));
app.use(allowCrossDomain);

require("./routes")(app);

app.listen(3000);