var express = require('express');
var app =express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');


var jwt = require('jsonwebtoken');
var config = require('./config');
var User = require('./app/models/user');


var port = process.env.PORT||8080;
mongoose.connect(config.database);
app.set('SuperSecret',config.secret);

app.use(bodyParser.urlencoded({
  extended: true
}));


app.use(morgan('dev'));


app.get('/',function(req,res) {
    
    res.send('hellow');
    
    
});


app.get('/set',function(req,res) {
    var us = new User({
        name:'Mani',
        passWord:'passWord',
        admin:true
        
    });
    
    
    
    us.save(function(error) {
        if(error) throw error;
        console.log('created successfully');
        res.json({success:true});
    })
});


var api = express.Router();

api.get('/', function(req, res) {
  res.json({ message: 'Welcome to the coolest API on earth!' });
});

api.get('/Users',function (req,res) {
    User.find({},function (error,users) {
        res.json(users);
    })
});


api.post('/auth',function (req,res) {
    User.findOne({name:req.body.name},function(error,user) {
        if(error) throw error;
        if(!user){res.json({success:false,message:'Auth failed user not found'})}
        else if (user){if(user.passWord != req.body.passWord){res.json({success:false,message:'Wrong pass'})} else{
            
            var token =jwt.sign(user,app.get('SuperSecret'));
            
            res.json({success:true,message:'token issued',toke:token});
            
        }}
    })
});

api.use(function(req,res,next) {
    debugger;
    var token = req.body.token || req.query.token|| req.headers['x-access-token'];
    
    if(token){
        jwt.verify(token,app.get('SuperSecret'),function (error,decoded) {
            if(error){return res.json({success:false,message:'failed'})}
            else{req.decoded = decoded};next();
        })
    }
    else{
        return res.status(403).send({success:false,message:'token not provided'})
    }
})

app.use('/api',api);
app.listen(port);
