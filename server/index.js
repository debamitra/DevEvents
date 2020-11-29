const path = require('path');
const express = require('express');
const mongoose= require('mongoose');
const bodyparser=require('body-parser');
const cookieParser=require('cookie-parser');

const User=require('./models/user');
const Event=require('./models/event');
const {auth} =require('./middlewares/auth');
const db=require('./config/config').get(process.env.NODE_ENV);
const app = express();



const buildPath = path.join(__dirname, '..', 'build');
app.use(express.json());
app.use(express.static(buildPath));

app.use(bodyparser.urlencoded({extended : false}));
app.use(bodyparser.json());
app.use(cookieParser());

mongoose.Promise=global.Promise;
mongoose.connect('mongodb+srv://admin:admin@demo-service.f95h0.mongodb.net/meet?retryWrites=true&w=majority',{ useNewUrlParser: true,useUnifiedTopology:true },function(err){
    if(err) console.log(err);
    console.log("database is connected");
});
var connection = mongoose.connection;

/*const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb+srv://admin:admin@demo-service.f95h0.mongodb.net/meet?retryWrites=true&w=majority', 
    { useUnifiedTopology: true })
.then(client => {
  console.log('Connected to Database')
  const db = client.db('meet')
  const eventCollection = db.collection('event')
  app.post('/send', (req, res) => {
    console.log("req : ",req)
    eventCollection.insertOne(req.body)
      .then(result => {
        console.log("hi there ",result);
      })
      .catch(error => console.error(error))
      res.send(req.body);
  })

  app.get('/events', (req, res) => {
    db.collection('User').find().toArray()
      .then(results => {
        console.log("get result ",results)
        res.send(results);
      })
      .catch(error => console.error(error))
    // ...
  })


 
  
})
.catch(error => console.error(error))*/

app.post('/send', (req, res) => {

    const newevent=new Event(req.body);

    Event.findOne({url:newevent.url},function(err,user){
      console.log("hi");
        //if(user) return res.status(400).json({ auth : false, message :"email exits"});
  
        newevent.save((err,doc)=>{
            if(err) {console.log(err);
                return res.status(400).json({ success : false});}
                console.log("doc: ",doc);
            res.status(200).json({
                succes:true,
                user : doc
            });

        });

    });
})

app.get('/events', (req, res) => {


  Event.find({},function(err,event){
    console.log("hi",event);
      
      
      
        res.send(event);
     

      
  });
  
})



app.post('/api/register',function(req,res){
  // taking a user
  const newuser=new User(req.body);
  console.log(newuser);
  console.log("user:",User);
  

 // if(newuser.password!=newuser.password2)return res.status(400).json({message: "password not match"});
  
  User.findOne({email:newuser.email},function(err,user){
    console.log("hi");
      if(user) return res.status(400).json({ auth : false, message :"email exits"});

      newuser.save((err,doc)=>{
          if(err) {console.log(err);
              return res.status(400).json({ success : false});}
          res.status(200).json({
              succes:true,
              user : doc
          });
      });
  });
});


// login user
app.post('/api/login', function(req,res){
   let token=req.cookies.auth;
   User.findByToken(token,(err,user)=>{
       if(err) return  res(err);
       if(user) return res.status(400).json({
           error :true,
           message:"You are already logged in"
       });
   
       else{
           User.findOne({'email':req.body.email},function(err,user){
               if(!user) return res.json({isAuth : false, message : ' Auth failed ,email not found'});
       
               user.comparepassword(req.body.password,(err,isMatch)=>{
                   if(!isMatch) return res.json({ isAuth : false,message : "password doesn't match"});
       
               user.generateToken((err,user)=>{
                   if(err) return res.status(400).send(err);
                   res.cookie('auth',user.token).json({
                       isAuth : true,
                       id : user._id
                       ,email : user.email,
                       username : user.firstname
                   });
               });    
           });
         });
       }
   });
});

//logout user
app.get('/api/logout',auth,function(req,res){
       req.user.deleteToken(req.token,(err,user)=>{
           if(err) return res.status(400).send(err);
           res.sendStatus(200);
       });

   }); 

// get logged in user
app.get('/api/profile',auth,function(req,res){
       res.json({
           isAuth: true,
           id: req.user._id,
           email: req.user.email,
           name: req.user.firstname + req.user.lastname
           
       })
});





app.listen(3030, () => {
  console.log('server start on port 3030');
});