const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const authenticate=require('../authenticate');

const Favorites= require('../models/favorite');
const Dishes = require('../models/dishes');

const favRouter=express.Router();
favRouter.use(bodyParser.json());

favRouter.route('/')

.get(authenticate.verifyUser,(req,res,next)=>{
Favorites.findOne({'user':req.user._id})
.populate('user')
.populate('dishes')
.then((favorite,err) =>{
  
    if(err){ return err; }

    res.json(favorite);
}, (err) => next(err))
.catch((err) => next(err));
})

.post(authenticate.verifyUser,(req,res,next)=>{
    Favorites.findOne({user:req.user._id})
    .then((favorites)=>{

        if (favorites == null) {

            Favorites.create({user:req.user._id})
                .then((favorites) => {
                    console.log("Favorite document Created", favorites);
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    for(const i in req.body){
                        favorites.dishes.push(req.body[i]);
                    }
                    favorites.save();
                    res.json(favorites);
                }, (err) => next(err))
                .catch((err) => next(err));
        }
        else {
            
            for (const i in req.body) {
                
                var flag = false;
                for (var j = (favorites.dishes.length - 1); j >= 0; j--) {
                    var id1 = favorites.dishes[j]
                    var id2 = req.body[i]._id
                    console.log(id1)
                    console.log(id2)
                    if (id1.equals(id2)) {
                        flag = true;
                    }
                }
                if (flag != true) {
                    favorites.dishes.push(req.body[i]);
                }
            } 
           
            favorites.save();
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorites);
        }
        
    }, (err) => next(err))
    .catch((err) => next(err));
    
    

})
.delete(authenticate.verifyUser,(req,res,next)=>{
Favorites.remove({})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err)=> next(err));

})

.put(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported');
});

favRouter.route('/:dishId')

.post(authenticate.verifyUser,(req,res,next)=>{
    Favorites.findOne({user:req.user._id})
    .then((favorite)=>{

        if (favorite == null) {
            Favorites.create({ 'user': req.user._id })
                .then((favorite) => {

                    console.log('Favorite Created ', favorite);
                    favorite.dishes.push(req.params.dishId)
                    favorite.save();
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                });

        }
        else {
            var flag=false;

            for(var i=(favorite.dishes.length-1);i>=0;i--){
                if(favorite.dishes[i]==req.params.dishId){
                    
                    flag=true;
                }
            }

            if(flag==true){
                res.end("dish already present in favorites");

            }   else{

                favorite.dishes.push(req.params.dishId);
                favorite.save();
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }       
                     
            
        }
        
        
        
    }, (err) => next(err))
    .catch((err)=> next(err));
    
})

.delete(authenticate.verifyUser,(req,res,next)=>{

    Favorites.findOne({user:req.user._id})
    .then((favorite)=>{
        favorite.dishes.remove(req.params.dishId);
        favorite.save();
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(favorite);
    }, (err) => next(err))
    .catch((err)=> next(err));

})

.put(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported');
})

.get(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode=403;
    res.end('GET operation not supported');
});

module.exports=favRouter;