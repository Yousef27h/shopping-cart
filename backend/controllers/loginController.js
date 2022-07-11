const User = require('../models/User');

exports.signin = (req, res, next) =>{
    let user = User.checkUser(req.body.username, req.body.password);

    if(user){
        res.json({accessToken: `${user.id}-${user.username}-${Date.now().toString()}`});
    } else {
        res.json({error: 'Invalid username and password!'});
    }
}