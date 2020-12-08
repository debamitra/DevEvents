const path = require('path');
const express = require('express');
const mongoose= require('mongoose');
const bodyparser=require('body-parser');
const cookieParser=require('cookie-parser');

const User=require('./models/user');
const Event=require('./models/event');
const {auth} =require('./middlewares/auth');
const db=require('./config/config').get(process.env.NODE_ENV);

const { exec } = require('child_process');

const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const axios = require("axios");

const fs = require("fs");

const app = express();



const buildPath = path.join(__dirname, '..', 'build');
app.use(express.json());
app.use(express.static(buildPath));

app.use(bodyparser.urlencoded({extended : false}));
app.use(bodyparser.json());
app.use(cookieParser());

/////////////////////////////////////run cron job for scraping




var list=new Array; ///this one way of declaring array in javascript

var myMap = new Map();
function getMap(key, value){
  myMap.set(key,value);
}

function getList(value){

list.push(value);//push function will insert values in the list array
}


var list1=new Array; ///this one way of declaring array in javascript


function getList1(value){

list1.push(value);//push function will insert values in the list array
}

var filtered=new Array; ///this one way of declaring array in javascript





const delay = ms => new Promise(res => setTimeout(res, ms));

let mySet = new Set()

async function getHistory() {
  // Will scrape the eventIDs for the last 10 events
  // and add them to a Queue table on MySQL

  let eventCount = 0;
  let links=[];

  await axios
    .get("https://www.meetup.com/find/events/tech/?allMeetups=false&radius=Infinity&userFreeform=Hyderabad%2C+India&mcId=z1018096&mcName=Hyderabad%2C+IN&month=12&day=2&year=2020&eventFilter=all")
    .then(response => {
      // Load the web page source code into a cheerio instance
      const $ = cheerio.load(response.data);
      console.log("Scraping EventIDs from Meetup");
     $("a").each((index, value) => {
        var link = $(value).attr("href");

        //links.push(link);

        if (/\/[0-9]+\//.test(link)){
          links.push(link);
           
          //console.log(link);
        }

        eventCount++;
      
         
      });

      
      
      links.forEach((c) => {
        mySet.add(String(c));
      });
      console.log("myset",mySet);
      mySet.forEach( (url) => {
        scrapeEvent(url);
      })
      

    });
    console.log("end scraping");
}


 function scrapeEvent(eventURL) {
  
  axios.get(eventURL).then(response => {
    // Load the web page source code into a cheerio instance
   // console.log("res: ", response);
   let VideoTitles = []
    const $ = cheerio.load(response.data);
    const attendee = $('h3').children('span').text();
     console.log("attendee: ", attendee);

    const scriptJSON = $('script[type="application/ld+json"]').html();
    //console.log("scriptjson: ",scriptJSON);
    const jsonObj = JSON.parse(scriptJSON);
    //const eventJSON = `./json/${eventID}.json`;  
    if(jsonObj !== null && jsonObj.location !== undefined && jsonObj.location.url !== undefined){
      //if(isEnglish(encodeURI(jsonObj.name)))
        //console.log("event data: ",jsonObj);
        getList(jsonObj.name);
        console.log(jsonObj.startDate);
        console.log(jsonObj.endDate);
    
var numb = attendee.match(/\d/g);
numb = numb.join("");
console.log("numb: ",numb);
        const myData = {
          "name":jsonObj.name,
          "startdatetime":jsonObj.startDate,
          "enddatetime": jsonObj.endDate,
          "url": eventURL,
          "description":jsonObj.description,
          "postedby":'guest',
          "attendeecount": numb
                }
        getMap(jsonObj.name,myData);

          //write to database

  const newevent=new Event(myData);

  Event.findOne({url:newevent.url},function(err,user){
    console.log("hi");
      if(user){ console.log("hi",user.url);return ;}

      newevent.save((err,doc)=>{
        console.log("hello",doc.url);
          if(err) {console.log(err);
              return ;}

      });

  });
        

        

    }
      
    
  });
}

function  isEnglish(text){
  detectlanguage.detect(text).then(function(result) {
    console.log(JSON.stringify(result));
    if(result[0].language == 'en'){

      filtered.push(myMap.get(text)); 
         getList1(myMap.get(text));
         console.log(JSON.stringify(list1));

         /*fs.writeFile('Output.json', JSON.stringify(list1), (err) => { 
      
          // In case of a error throw err. 
          if (err) throw err; 
      }) */

    }
    
  });


}

 const scrapeHistoryAndEvents = async () => {

  getHistory();
  await delay(50000);
  //console.log(list);  
  //console.log("map: ",myMap);
   list.forEach((text) => {
    filtered.push(myMap.get(text)); 
         getList1(myMap.get(text));
        // console.log(JSON.stringify(list1));
  })
  console.log("about to writtent to file");

 

  fs.writeFile('../hacker-stories/public/Output.json', JSON.stringify(list1), (err) => { 
    console.log("writtent to file");
   // In case of a error throw err. 
   if (err) throw err; 
  
}) 
  //list.forEach((c) => {
   //isEnglish(c);
  //});
 return JSON.stringify(list1);




 

  
};

//scrapeHistoryAndEvents();


var CronJob = require('cron').CronJob;
var job = new CronJob('0 */10 * * * *', scrapeHistoryAndEvents
, null, true, 'America/Los_Angeles');
job.start();


///////////////////////////

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
    const sortedActivities = event.slice().sort((a, b) => new Date(a.startdatetime) - new Date(b.startdatetime));
      
      
      
        res.send(sortedActivities);
     

      
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



const PORT = process.env.PORT || 3030;

app.listen(PORT, () => {
  console.log(`Listening on ${ PORT }`);
});