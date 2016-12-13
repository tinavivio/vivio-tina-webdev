module.exports = function(app,model) {

    /*var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    passport.use(new LocalStrategy(localStrategy));
    var FacebookStrategy = require('passport-facebook').Strategy;
    var facebookConfig = {
        clientID: 244100136010163,
        clientSecret: "4281c6736685c58747de3861137be80b",
        callbackURL: "http://localhost:5000/project/auth/facebook/callback",
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

    var multer = require('multer');
    var upload = multer({ dest: __dirname+'/../../public/uploads' });

    app.get('/project/api/user', findUser);
    app.get('/project/api/user/:userId', findUserById);
    app.post('/project/api/user', createUser);
    app.delete('/project/api/user/:userId', deleteUser);
    app.put('/project/api/user/:userId', updateUser);
    app.post ('/project/api/upload', upload.single('myFile'), uploadImage);
    app.delete('/project/api/user/:userId/match/:matchId', deleteMatch);
    app.post('/project/api/user/:userId/match/calculate',calculateMatches);
    //app.post('/project/api/login', passport.authenticate('local'), login);
    //app.get('/project/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));
    app.get('/project/auth/facebook/callback',function(req, res, next) {
        passport.authenticate('facebook', function (err, user, info) {
            // This is the default destination upon successful login.
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.redirect('/project/#/login');
            }
            var redirectUrl = '/project/#/user/' + user._id;
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
    app.post('/project/api/logout', logout);
    app.post('/project/api/register', register);
    app.get('/project/api/loggedin', loggedin);

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

    function isValidMatch(user1,user2){
        if(user1.gender==='FEMALE'){
            if(user1.orientation==='STRAIGHT'){
                if(user2.gender==='FEMALE'){
                    return false;
                }else{
                    if(user2.orientation==='GAY'){
                        return false;
                    }
                }
            }else if(user1.orientation==='GAY'){
                if(user2.gender==='MALE'){
                    return false;
                }else{
                    if(user2.orientation==='STRAIGHT'){
                        return false;
                    }
                }
            }else{
                if(user2.gender==='FEMALE'){
                    if(user2.orientation==='STRAIGHT'){
                        return false;
                    }
                }else{
                    if(user2.orientation==='GAY'){
                        return false;
                    }
                }
            }
        }else{
            if(user1.orientation==='STRAIGHT'){
                if(user2.gender==='MALE'){
                    return false;
                }else{
                    if(user2.orientation==='GAY'){
                        return false;
                    }
                }
            }else if(user1.orientation==='GAY'){
                if(user2.gender==='FEMALE'){
                    return false;
                }else{
                    if(user2.orientation==='STRAIGHT'){
                        return false;
                    }
                }
            }else{
                if(user2.gender==='MALE'){
                    if(user2.orientation==='STRAIGHT'){
                        return false;
                    }
                }else{
                    if(user2.orientation==='GAY'){
                        return false;
                    }
                }
            }
        }
        return true;
    }

    function compareBurritos(burrito1,burrito2){
        var numPreferencesSame = 0;
        if(burrito1.tortilla===burrito2.tortilla){
            numPreferencesSame++;
        }
        if(burrito1.rice===burrito2.rice){
            numPreferencesSame++;
        }
        if(burrito1.beans===burrito2.beans){
            numPreferencesSame++;
        }
        if(burrito1.meat===burrito2.meat){
            numPreferencesSame++;
        }
        if(burrito1.salsa===burrito2.salsa){
            numPreferencesSame++;
        }
        if(burrito1.cheese===burrito2.cheese){
            numPreferencesSame++;
        }
        if(burrito1.lettuce===burrito2.lettuce){
            numPreferencesSame++;
        }
        if(burrito1.guacamole===burrito2.guacamole){
            numPreferencesSame++;
        }
        if(burrito1.sourCream===burrito2.sourCream){
            numPreferencesSame++;
        }
        return numPreferencesSame;
    }

    function calculateMatches(req,res){
        var userId = req.params.userId;
        model.userModel
            .findUserById(userId)
            .then(function(user){
                if(user){
                    model.userModel.clearMatches(userId)
                        .then(function(retVal){
                            if(retVal){
                                model.burritoModel.findBurritoByUserId(userId)
                                    .then(function(burrito){
                                            if(burrito){
                                                model.burritoModel.findAllBurritos()
                                                    .then(function(burritos){
                                                            if(burritos){
                                                                for(var i=0;i<burritos.length;i++){
                                                                    var matchScore = compareBurritos(burrito,burritos[i]);
                                                                    if(matchScore >= 6){
                                                                        model.userModel.findUserById(burritos[i]._user)
                                                                            .then(function(match){
                                                                                    if(match){
                                                                                        if(isValidMatch(user,match) && user.username!==match.username){
                                                                                            model.userModel.createMatch(user._id,match._id)
                                                                                                .then(function(retVal){
                                                                                                        console.log("New match added!");
                                                                                                    },
                                                                                                    function(err){
                                                                                                        res.sendStatus(400).send(err);
                                                                                                    });
                                                                                        }
                                                                                    }else{
                                                                                        res.sendStatus(400);
                                                                                    }
                                                                                },
                                                                                function(err){
                                                                                    res.sendStatus(400).send(err);
                                                                                });
                                                                    }
                                                                }
                                                                res.sendStatus(200);
                                                            }else{
                                                                res.sendStatus(400);
                                                            }
                                                        },
                                                        function(err){
                                                            res.sendStatus(400).send(err);
                                                        });
                                            }else{
                                                res.sendStatus(400);
                                            }
                                        },
                                        function(err){
                                            res.sendStatus(400).send(err);
                                        });
                            }else{
                                res.sendStatus(400);
                            }
                        },
                        function(err){
                            res.sendStatus(400).send(err);
                        });
                }else{
                    res.sendStatus(400);
                }
            },
            function(err){
                res.sendStatus(400).send(err);
            });
    }

    function deleteMatch(req,res){
        var userId = req.params.userId;
        var matchId = req.params.matchId;
        model.userModel
            .deleteMatch(userId,matchId)
            .then(function(retVal){
                    if(retVal){
                        res.sendStatus(204);
                    }else{
                        res.sendStatus(400);
                    }
                },
                function(err){
                    res.sendStatus(400).send(err);
                });
    }

    function uploadImage(req, res) {
        var userId        = req.body.userId;
        var myFile        = req.file;

        var originalname  = myFile.originalname; // file name on user's computer
        var filename      = myFile.filename;     // new file name in upload folder
        var path          = myFile.path;         // full path of uploaded file
        var destination   = myFile.destination;  // folder where file is saved to
        var size          = myFile.size;
        var mimetype      = myFile.mimetype;
        var relPath = "../uploads/" + filename;
        model.userModel
            .uploadImage(userId,relPath)
            .then(function(retVal){
                    if(retVal){
                        res.redirect("../#/user/" + userId);
                    }else{
                        res.sendStatus(400);
                    }
                },
                function(err){
                    res.redirect("../#/");
                });
    }

    function deleteUser(req,res){
        var userId = req.params.userId;
        model.userModel
            .deleteUser(userId)
            .then(function(retVal){
                    if(retVal){
                        res.sendStatus(204);
                    }else{
                        res.sendStatus(400);
                    }
                },
                function(err){
                    res.sendStatus(400).send(err);
                });
    }
    function updateUser(req,res){
        var userId = req.params.userId;
        var user = req.body;
        model.userModel
            .updateUser(userId,user)
            .then(function(retVal){
                    if(retVal){
                        res.sendStatus(200);
                    }else{
                        res.sendStatus(400);
                    }
                },
                function(err){
                    res.sendStatus(400).send(err);
                });
    }
    function createUser(req,res){
        var user = req.body;
        model.userModel
            .findUserByUsername(user.username)
            .then(function(retVal) {
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
                function(err){
                    res.sendStatus(400).send(err);
                });
    }

    function findUser(req, res){
        var query = req.query;
        if(!query.username){
            findAllUsers(req,res);
        }else if(query.password && query.username){
            findUserByCredentials(req,res);
        }else if(query.username){
            findUserByUsername(req,res);
        }
    }

    function findAllUsers(req,res){
        model.userModel
            .findAllUsers()
            .then(
                function(retVal){
                    if(retVal){
                        res.send(retVal);
                    }else{
                        res.sendStatus(400);
                    }
                },
                function(err){
                    res.sendStatus(400).send(err);
                });
    }

    function findUserByUsername(req,res){
        var username = req.query.username;
        model.userModel
            .findUserByUsername(username)
            .then(
                function(retVal){
                    if(retVal){
                        res.send(retVal);
                    }else{
                        res.send('0');
                    }
                },
                function(err){
                    res.sendStatus(400).send(err);
                }
            );
    }
    function findUserByCredentials(req,res){
        var username = req.query.username;
        var password = req.query.password;
        model.userModel
            .findUserByCredentials(username,password)
            .then(
                function(retVal){
                    if(retVal){
                        res.send(retVal);
                    }else{
                        res.send('0');
                    }
                },
                function(err){
                    res.sendStatus(400).send(err);
                }
            );
    }
    function findUserById(req,res){
        var userId = req.params.userId;
        model.userModel
            .findUserById(userId)
            .then(
                function(retVal){
                    if(retVal){
                        res.send(retVal);
                    }else{
                        res.send('0');
                    }
                },
                function(err){
                    res.sendStatus(400).send(err);
                }
            );
    }
};