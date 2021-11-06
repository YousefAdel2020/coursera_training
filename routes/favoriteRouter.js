const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('./cors');

const Favorites = require('../models/favorite');
var authenticate = require('../authenticate');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        console.log("string ", req.user._id);
        Favorites.findOne({ User: req.user._id })
            .populate('User')
            .populate('dishes')
            .then((favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {

        Favorites.findOne({ User: req.user._id })
            .then((favorites) => {
                //console.log(favorites);

                if (favorites != null) {
                    console.log(req.body.dishes);
                    favorites.dishes = [...favorites.dishes, ...req.body.dishes]
                    favorites.save()
                        .then((favorite) => {
                            Favorites.findById(favorite._id)
                                .populate('User')
                                .populate('dishes')
                                .then((fav) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(fav);
                                })
                        }, (err) => next(err));

                } else {
                    Favorites.create({ "User": req.user._id, "dishes": req.body.dishes })
                        .then((favorite) => {

                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        }, (err) => next(err))
                        .catch((err) => next(err));
                }
            })


    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /favorites');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOneAndDelete({ User: req.user._id })
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    });







favoriteRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {

        Favorites.findOne({ User: req.user._id })
            .populate('User')
            .populate('dishes')
            .then((favorites) => {
                console.log(favorites.dishes.find(dish => dish._id == req.params.dishId));
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites.dishes.find(dish => dish._id == req.params.dishId));

            }, (err) => next(err))
            .catch((err) => next(err));


    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ User: req.user._id })
            .then((favorites) => {
                //console.log(favorites);

                if (favorites != null) {
                    console.log(req.body.dishes);
                    favorites.dishes.push(req.params.dishId);
                    favorites.save()
                        .then((favorite) => {
                            Favorites.findById(favorite._id)
                                .populate('User')
                                .populate('dishes')
                                .then((fav) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(fav);
                                })
                        }, (err) => next(err));

                } else {
                    Favorites.create({ "User": req.user._id, "dishes": [req.params.dishId] })
                        .then((favorite) => {

                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        }, (err) => next(err))
                        .catch((err) => next(err));
                }
            })
    })

.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ User: req.user._id })
        .then((favorite) => {




            console.log(favorite.dishes.find(dish => dish._id == req.params.dishId));
            favorite.dishes = favorite.dishes.filter(dish => dish._id != req.params.dishId);


            favorite.save()
                .then((fav) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(fav);
                }).catch((err) => next(err));





        }).catch((err) => next(err));





});

module.exports = favoriteRouter;