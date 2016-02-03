module.exports = function(app){

    var mongoose = require('mongoose');
    var Graph = require('node-dijkstra');
    var mapModel = require(app.locals.appRoot + '/model/Map');

    var AppController = {

        map: function(req, res){

            var error, 
                requestData,
                requestDataJSON;

            req.on('data', function(data) {
               requestData = data;
            });

            req.on('end', function(data) {

                if ((error = AppController.validateMapRequest(req, requestData)) !== true) {
                    res.status(error.errorCode).json({ message: error.errorMessage });
                    return;
                } 

                requestDataJSON = JSON.parse(requestData);

                mapModel.findOne({ name: requestDataJSON.name }, function(e, existingMap){

                    if(existingMap){
                        existingMap.set('paths', requestDataJSON.paths);
                        existingMap.save(function(e, updatedMap){
                            if (!e) {
                                res.status(201).json({message: 'Mapa \'' + requestDataJSON.name + '\' atualizado com sucesso'});
                            }
                            else {
                                res.status(422).json(e);
                            } 
                        });
                    }
                    else{
                        new mapModel(requestDataJSON).save(function (e) {
                            if (!e) {
                                res.status(201).json({message: 'Mapa \'' + requestDataJSON.name + '\' criado com sucesso'});
                            } else {
                                res.status(422).json(e);
                            }
                        });
                    }
                });
            });
        },

        calc: function(req, res){

            var error,
                paths,
                calc,
                cost = 0,
                path = {},
                returnObject = {},
                route = new Graph();

            if ((error = AppController.validateCalcRequest(req.query)) !== true) {
                res.status(error.errorCode).json({ message: error.errorMessage });
                return;
            } 

            mongoose.model('maps').find({name: req.query.mapa},function(e, maps){
                if (!e) {

                    if(!Array.isArray(maps) || maps.length === 0){
                        res.status(500).json({ message: 'Mapa ' + req.query.mapa + ' não localizado, atente para a diferenciação entre letras maiúsculas e minúsculas' });
                        return;
                    }

                    paths = maps[0].get('paths');

                    var auxObj = {}, origem, destino, distancia, novaRota, rotaAntiga;

                    for(var i = 0 ; i < paths.length ; i++){

                        path = {};
                        origem = paths[i].origem;
                        destino = paths[i].destino;
                        distancia = paths[i].distancia;
                        rotaAntiga = auxObj[origem] || {};
                        path[destino] = distancia;
                        novaRota = Object.assign(rotaAntiga, path );

                        auxObj[origem] = novaRota;
                    }

                    for(var node in auxObj){
                        route.addNode([node].toString(), auxObj[node]);
                    }

                    calc = route.path(req.query.origem, req.query.destino, {cost:true});

                    if(req.query.precoLitro <= 0 || isNaN(req.query.precoLitro)){
                        returnObject.message = 'Atenção, não foi possível calcular o custo da rota pois o preço por litro de combustível não foi informado';
                    }
                    else if(req.query.autonomia <= 0 || isNaN(req.query.autonomia)){
                        returnObject.message = 'Atenção, não foi possível calcular o custo da rota pois a autonomia(km/l) não foi informada';
                    }
                    else if(!calc.path){
                        returnObject.message = 'Atenção, não foi possível calcular a rota';
                    }
                    else {
                        cost = (calc.cost/req.query.autonomia) * req.query.precoLitro;
                    }

                    returnObject.rota = calc.path || [];
                    returnObject.custo = cost;
                    returnObject.distanciaTotal = calc.cost || 0;

                    res.json(returnObject);
                }
                else {
                    res.status(500).json(e);
                } 
            });
        },

        validateMapRequest: function(req, requestData){

            var requestDataJSON;

            if(!req.is('application/json')){
                return {
                    errorCode: 415,
                    errorMessage: 'Para utilizar este recurso, é necessário enviar uma requisição do tipo JSON'
                };
            }

            if(!requestData){
                 return {
                    errorCode: 422,
                    errorMessage: "Para utilizar este recurso, é necessário enviar o objeto 'Mapa'"
                };
            }

            try {
                requestDataJSON = JSON.parse(requestData);
            } catch (e) {
                return {
                    errorCode: 422,
                    errorMessage: 'Para utilizar este recurso, é necessário enviar um objeto do tipo JSON'
                };
            }

            if(!requestDataJSON.hasOwnProperty('name')){
                 return {
                    errorCode: 422,
                    errorMessage: "Para utilizar este recurso, é necessário que o objeto 'Mapa' contenha a propriedade 'name'"
                };
            }

            if(!requestDataJSON.hasOwnProperty('paths') || !Array.isArray(requestDataJSON.paths)){
                 return {
                    errorCode: 422,
                    errorMessage: "Para utilizar este recurso, é necessário que o objeto Mapa contenha a propriedade 'paths' do tipo Array"
                };
            }

            return true;
        },

        validateCalcRequest: function(queryString){
            
            if(!queryString.hasOwnProperty('mapa') || !queryString.mapa){
                 return {
                    errorCode: 422,
                    errorMessage: "Para utilizar este recurso, é necessário informar o parâmetro 'mapa'"
                };
            }

            if(!queryString.hasOwnProperty('origem') || !queryString.origem){
                 return {
                    errorCode: 422,
                    errorMessage: "Para utilizar este recurso, é necessário informar o parâmetro 'origem'"
                };
            }

            if(!queryString.hasOwnProperty('destino') || !queryString.destino){
                 return {
                    errorCode: 422,
                    errorMessage: "Para utilizar este recurso, é necessário informar o parâmetro 'destino'"
                };
            }

            if(!queryString.hasOwnProperty('autonomia')){
                 return {
                    errorCode: 422,
                    errorMessage: "Para utilizar este recurso, é necessário informar o parâmetro 'autonomia'"
                };
            }

            if(!queryString.hasOwnProperty('precoLitro')){
                 return {
                    errorCode: 422,
                    errorMessage: "Para utilizar este recurso, é necessário informar o parâmetro 'precoLitro'"
                };
            }

            return true;
        }
    };
    
    return AppController;
};