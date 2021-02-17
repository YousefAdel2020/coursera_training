const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const Dishes = require('./models/dishes');

var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var config = require('./config.js');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts,
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        User.findOne({ _id: jwt_payload._id }, (err, user) => {
            if (err) {
                return done(err, false);
            } else if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        });
    }));

exports.verifyUser = passport.authenticate('jwt', { session: false });


exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin === false) {
        var err = new Error('You are not authorized to perform this operation!');
        err.status = 403;
        return next(err);
    }

    return next();
}

exports.sameuser = (req, res, next) => {
    Dishes.findById(req.params.dishId)
        .then((dish) => {
            console.log(typeof(req.user._id));
            console.log(typeof(dish.comments.id(req.params.commentId).author._id));



            if (!((req.user._id).equals(dish.comments.id(req.params.commentId).author._id))) {

                var err = new Error('You are not the same user who put this comment');
                err.status = 403;
                return next(err);
            }

            return next();

        })
        .catch((err) => next(err));
}