module.exports = function (app, model) {

    /*var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    passport.use(new LocalStrategy(localStrategy));
    var FacebookStrategy = require('passport-facebook').Strategy;
    var facebookConfig = {
        clientID: 1265946906784663,
        clientSecret: "6f710de946e123a02e937368cde8c7c8",
        callbackURL: "http://localhost:5000/assignment/auth/facebook/callback",
        profileFields: ['id', 'email', 'first_name', 'last_name']
    };
    passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));*/

    var bcrypt = require('bcrypt-nodejs');

    function localStrategy(username, password, done) {
        model
            .userModel
            .findUserByUsername(username)
            .then(
                function (user) {
                    if (user.username === username && bcrypt.compareSync(password, user.password)) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                },
                function (err) {
                    if (err) {
                        return done(err);
                    }
                }
            );
    }

    function facebookStrategy(token, refreshToken, profile, done) {
        model
            .userModel
            .findUserByFacebookId(profile.id)
            .then(function (user) {
                    if (user) {
                        return done(null, user);
                    }
                    else { //create a new user in db
                        var newUser = {
                            username: profile.emails[0].value.split('@')[0],
                            firstName: profile.name.givenName,
                            lastName: profile.name.familyName,
                            email: profile.emails[0].value,
                            facebook: {
                                id: profile.id,
                                token: token
                            }
                        };
                        model
                            .userModel
                            .createUser(newUser)
                            .then(function (user) {
                                    if (user) {
                                        return done(null, user);
                                    }
                                    else {
                                        return done(null, false);
                                    }
                                },
                                function (err) {
                                    if (err) {
                                        return done(err);
                                    }
                                });
                    }
                },
                function (err) {
                    if (err) {
                        return done(err);
                    }
                });
    }

    /*passport.serializeUser(serializeUser);
    function serializeUser(user, done) {
        done(null, user);
    }

    passport.deserializeUser(deserializeUser);
    function deserializeUser(user, done) {
        model
            .userModel
            .findUserById(user._id)
            .then(
                function (user) {
                    done(null, user);
                },
                function (err) {
                    done(err, null);
                }
            );
    }*/

    app.post('/assignment/api/user', createUser);
    //app.post('/assignment/api/login', passport.authenticate('local'), login);
    //app.get('/assignment/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));
    app.get('/assignment/auth/facebook/callback',function(req, res, next) {
        passport.authenticate('facebook', function (err, user, info) {
            // This is the default destination upon successful login.
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.redirect('/assignment/#/login');
            }
            var redirectUrl = '/assignment/#/user/' + user._id;
            // If we have previously stored a redirectUrl, use that,
            // otherwise, use the default.
            if (req.session.redirectUrl) {
                redirectUrl = req.session.redirectUrl;
                req.session.redirectUrl = null;
            }
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
            });
            res.redirect(redirectUrl);
        })(req, res, next);
    });
    app.post('/assignment/api/logout', logout);
    app.post('/assignment/api/register', register);

    app.get('/assignment/api/user', findUser);
    app.get('/assignment/api/user/:userId', findUserById);
    app.get('/assignment/api/loggedin', loggedin);

    app.delete('/assignment/api/user/:userId', deleteUser);
    app.put('/assignment/api/user/:userId', updateUser);


    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function logout(req, res) {
        req.logOut();
        res.sendStatus(200);
    }

    function register(req, res) {
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);
        model.userModel
            .findUserByUsername(user.username)
            .then(function (retVal) {
                    if (retVal) {
                        res.sendStatus(400).send("User already created!");
                    } else {
                        model
                            .userModel
                            .createUser(user)
                            .then(
                                function (user) {
                                    if (user) {
                                        req.login(user, function (err) {
                                            if (err) {
                                                res.status(400).send(err);
                                            } else {
                                                res.json(user);
                                            }
                                        });
                                    }
                                },
                                function (err) {
                                    res.sendStatus(400).send(err);
                                });
                    }
                },
                function (err) {
                    res.sendStatus(400).send(err);
                })
    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function deleteUser(req, res) {
        var userId = req.params.userId;
        model.userModel
            .deleteUser(userId)
            .then(function (retVal) {
                    if (retVal) {
                        res.sendStatus(204);
                    } else {
                        res.sendStatus(400);
                    }
                },
                function (err) {
                    res.sendStatus(400).send(err);
                });
    }

    function updateUser(req, res) {
        var userId = req.params.userId;
        var user = req.body;
        model.userModel
            .updateUser(userId, user)
            .then(function (retVal) {
                    if (retVal) {
                        res.sendStatus(200);
                    } else {
                        res.sendStatus(400);
                    }
                },
                function (err) {
                    res.sendStatus(400).send(err);
                });
    }

    function createUser(req, res) {
        var user = req.body;
        model.userModel
            .findUserByUsername(user.username)
            .then(function (retVal) {
                    if (retVal) {
                        res.sendStatus(400).send("User already created!");
                    } else {
                        model.userModel
                            .createUser(user)
                            .then(function (retVal) {
                                    if (retVal) {
                                        res.send(retVal);
                                    } else {
                                        res.send('0');
                                    }
                                },
                                function (err) {
                                    res.sendStatus(400).send(err);
                                });
                    }
                },
                function (err) {
                    res.sendStatus(400).send(err);
                });
    }

    function findUser(req, res) {
        var query = req.query;
        if (query.password && query.username) {
            findUserByCredentials(req, res);
        } else if (query.username) {
            findUserByUsername(req, res);
        }
    }

    function findUserByUsername(req, res) {
        var username = req.query.username;
        model.userModel
            .findUserByUsername(username)
            .then(
                function (retVal) {
                    if (retVal) {
                        res.send(retVal);
                    } else {
                        res.send('0');
                    }
                },
                function (err) {
                    res.sendStatus(400).send(err);
                }
            );
    }

    function findUserByCredentials(req, res) {
        var username = req.query.username;
        var password = req.query.password;
        model.userModel
            .findUserByCredentials(username, password)
            .then(
                function (retVal) {
                    if (retVal) {
                        res.send(retVal);
                    } else {
                        res.send('0');
                    }
                },
                function (err) {
                    res.sendStatus(400).send(err);
                }
            );
    }

    function findUserById(req, res) {
        var userId = req.params.userId;
        model.userModel
            .findUserById(userId)
            .then(
                function (retVal) {
                    if (retVal) {
                        res.send(retVal);
                    } else {
                        res.send('0');
                    }
                },
                function (err) {
                    res.sendStatus(400).send(err);
                }
            );
    }
};