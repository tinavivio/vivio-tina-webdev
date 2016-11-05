module.exports = function(app) {
    var users = [
        {_id: "123", username: "alice",    password: "alice",    firstName: "Alice",  lastName: "Wonder"  },
        {_id: "234", username: "bob",      password: "bob",      firstName: "Bob",    lastName: "Marley"  },
        {_id: "345", username: "charly",   password: "charly",   firstName: "Charly", lastName: "Garcia"  },
        {_id: "456", username: "jannunzi", password: "jannunzi", firstName: "Jose",   lastName: "Annunzi" }
    ];
    app.get('/assignment/api/user', findUser);
    app.get('/assignment/api/user/:userId', findUserById);
    app.post('/assignment/api/user', createUser);
    app.delete('/assignment/api/user/:userId',deleteUser);
    app.put('/assignment/api/user/:userId',updateUser);
    function deleteUser(req,res){
        var userId = req.params.userId;
        for(var i = 0; i < users.length; i++){
            if(parseInt(users[i]._id)===parseInt(userId)){
                users.splice(i,1);
                res.sendStatus(200);
                return;
            }
        }
    }
    function updateUser(req,res){
        var userId = req.params.userId;
        var user = req.body;
        for(var i = 0; i < users.length; i++){
            if(parseInt(users[i]._id)===parseInt(userId)){
                user._id = users[i]._id;
                user.username = users[i].username;
                user.password = users[i].password;
                users.splice(i,1,user);
                res.sendStatus(200);
                return;
            }
        }
    }
    function createUser(req,res){
        var user = req.body;
        user._id = parseInt(users[users.length-1]._id) + 1;
        users.push(user);
        res.send(user);
    }
    function findUser(req, res){
        var query = req.query;
        if(query.password && query.username){
            findUserByCredentials(req,res);
        }else if(query.username){
            findUserByUsername(req,res);
        }
    }
    function findUserByUsername(req,res){
        var username = req.query.username;
        for (var i = 0; i < users.length; i++){
            if(users[i].username === username){
                res.send(users[i]);
                return;
            }
        }
        res.send('0');
    }
    function findUserByCredentials(req,res){
        var username = req.query.username;
        var password = req.query.password;
        for (var i = 0; i < users.length; i++){
            if(users[i].username === username && users[i].password === password){
                res.send(users[i]);
                return;
            }
        }
        res.send('0');
    }
    function findUserById(req,res){
        var userId = req.params.userId;
        for (var i = 0; i < users.length; i++){
            if(parseInt(users[i]._id) === parseInt(userId)){
                res.send(users[i]);
                return;
            }
        }
        res.send('0');
    }
};