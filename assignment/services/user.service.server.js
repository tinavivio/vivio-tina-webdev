module.exports = function (app, model) {

    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    passport.use(new LocalStrategy(localStrategy));

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

    passport.serializeUser(serializeUser);
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
    }

    app.post('/assignment/api/user', createUser);
    app.post('/assignment/api/login', passport.authenticate('local'), login);
    app.post('/assignment/api/logout', logout);
    app.post('/assignment/api/register', register);

    app.get('/assignment/api/user', findUser);
    app.get('/assignment/api/user/:userId', findUserById);
    app.get ('/assignment/api/loggedin', loggedin);

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
            function(err){
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