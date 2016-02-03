module.exports = function(app){

    var appController     = require('./App')(app);
    var AppRouterController = {

        index: function(req, res){
            res.sendFile(app.locals.appRoot + '/view/index.html');
        },

        map: function(req, res){
            appController.map(req, res);
        },

        calc: function(req, res){
            appController.calc(req, res);
        }
    };
    
    return AppRouterController;
};