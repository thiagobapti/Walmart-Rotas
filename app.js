var express 				= require('express');
var app 					= express();
app.locals.appRoot 			= __dirname;
var mongoose				= require('mongoose');
var appRouterController 	= require('./controller/AppRouter')(app);

app.use(express.static('assets'));

app.listen(process.argv[2] || 80, function(){

	dbConnect();	

});

function dbConnect(){

	mongoose.connect('mongodb://localhost/ROUTES_APP');

	mongoose.connection.on('error', function(e){
		console.log(e);
	}); 

}

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get('/', appRouterController.index);
app.post('/api/map', appRouterController.map);
app.get('/api/calc', appRouterController.calc);
