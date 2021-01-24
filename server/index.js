const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');

const User = require('./models/user');
const Event = require('./models/event');
const { auth } = require('./middlewares/auth');

require('dotenv').config();

const cheerio = require('cheerio');

const axios = require("axios");

const app = express();
const moment = require('moment-timezone');



const buildPath = path.join(__dirname, '..', 'build');
app.use(express.json());
app.use(express.static(buildPath));

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cookieParser());


function next30days() {
  let today = new Date();//indian time...blah blah gmt
  let year = today.getFullYear();
  let month = today.getMonth();
  let date = today.getDate();
  for (let i = 0; i < 30; i++) {
    let day = new Date(year, month, date + i);
    year = day.getFullYear();
    month = day.getMonth();
    date = day.getDate();
    console.log(day);

  }

}

//let  meetupURL = `https://www.meetup.com/find/events/tech/?allMeetups=false&radius=Infinity&userFreeform=Hyderabad%2C+India&mcId=z1018096&mcName=Hyderabad%2C+IN&month=${mm}&day=${dd}&year=${yy}`
//////////////////MEETUP SCRAPING CODE///////////////////////////

//let MEETUP_DATE_RANGE_SEARCH_URL = `https://www.meetup.com/find/in--hyderabad/?eventType=online&keywords=tech&customStartDate=${sd}T13%3A30-05%3A00&customEndDate=${ed}T13%3A29-05%3A00`

//const MEETUP_SEARCH_URL = "https://www.meetup.com/find/events/tech/?allMeetups=false&radius=Infinity&userFreeform=Hyderabad%2C+India&mcId=z1018096&mcName=Hyderabad%2C+IN&eventFilter=all"
var list = new Array;


function getList(value) {

  list.push(value);
}



const delay = ms => new Promise(res => setTimeout(res, ms));

let mySet = new Set();

async function getHistory(MEETUP_SEARCH_URL) {
  let eventCount = 0;
  let links = [];

  await axios
    .get(MEETUP_SEARCH_URL)
    .then(response => {
      // Load the web page source code into a cheerio instance
      const $ = cheerio.load(response.data);
      console.log("Scraping EventIDs from Meetup");
      $("a").each((index, value) => {
        var link = $(value).attr("href");

        if (/\/[0-9]+\//.test(link)) {
          if (!mySet.has(link)) {
            mySet.add(link);
            scrapeEvent(link)
          }

          //links.push(link);

        }

        eventCount++;


      });


    }).catch((error) => {
      console.log("error in scrapping,", error);
      // error handling (you cannot access the response body) 
    })
  console.log("end scraping");
}


function scrapeEvent(eventURL) {

  axios.get(eventURL).then(response => {

    const $ = cheerio.load(response.data);
    const attendee = $('h3').children('span').text();
    const scriptJSON = $('script[type="application/ld+json"]').html();
    //console.log("scriptjson: ",scriptJSON);
    const jsonObj = JSON.parse(scriptJSON);
    if (jsonObj !== null && jsonObj.location !== undefined && jsonObj.location.url !== undefined) {
      //if(isEnglish(encodeURI(jsonObj.name)))
      //console.log("event data: ",jsonObj);
      getList(jsonObj.name);

      var numb = attendee.match(/\d/g);
      console.log("", numb);
      numb = numb.join("");

      const myData = {
        "name": jsonObj.name,
        "startdatetime": jsonObj.startDate,
        "enddatetime": jsonObj.endDate,
        "url": eventURL,
        "description": jsonObj.description,
        "postedby": 'guest',
        "tags": ['meetup'],
        //"attendeecount": numb
      }

      //write to database

      const newevent = new Event(myData);


      Event.findOne({ url: newevent.url }, function (err, user) {

        if (user) { console.log("already present in db", user.url); return; }

        newevent.save((err, doc) => {
          console.log("inserted : ", doc);
          if (err) {
            console.log(err);
            return;
          }

        });

      });

    }
  }).catch((error) => {
    console.log("error whilw scraping", error);
    // error handling (you cannot access the response body) 
  })
}



const scrapeHistoryAndEvents = async () => {
  let today = new Date();//indian time...blah blah gmt
  let year = today.getFullYear();
  let month = today.getMonth() + 1;
  let date = today.getDate();


  for (let i = 0; i < 30; i++) {

    let meetupURL = `https://www.meetup.com/find/events/tech/?allMeetups=false&radius=Infinity&userFreeform=Hyderabad%2C+India&mcId=z1018096&mcName=Hyderabad%2C+IN&month=${month}&day=${date}&year=${year}`
    getHistory(meetupURL);
    await delay(100000)
    console.log("rl", meetupURL);
    let day = new Date(year, month, date + 1);
    year = day.getFullYear();
    month = day.getMonth();
    date = day.getDate();
    console.log(day);

  }

};


///////////run cron job for scraping//////////////////////////

var CronJob = require('cron').CronJob;
var job = new CronJob('0 */50 * * * *', scrapeHistoryAndEvents
  , null, true, 'America/Los_Angeles');
console.log("cron job");
job.start();


/////////////////////////////////////////////////////////////


mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
  if (err) console.log(err);
  console.log("database is connected");
});
var connection = mongoose.connection;

/* submit an event*/
app.post('/api/send', (req, res) => {

  const newevent = new Event(req.body);

  Event.findOne({ url: newevent.url }, function (err, user) {
    //if(user) return res.status(400).json({ auth : false, message :"email exits"});

    newevent.save((err, doc) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ success: false });
      }

      res.status(200).json({
        succes: true,
        user: doc
      });

    });

  });
})

/*get events*/
app.get('/api/events', (req, res) => {
  console.log("sort by : ", req.query.sortby);
  //Event.find({}).sort({createDate: -1}).execFind(function(err,docs){ console.log(docs)});

  //check the state of filter form as well, tags and date
  Event.find({}, function (err, event) {
    let sortedEvents = [];
    if (req.query.sortby == 58) {
      console.log("insidew sortby server");
      sortedEvents = event.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      sortedEvents = event.slice().sort((a, b) => new Date(a.startdatetime) - new Date(b.startdatetime));
    }

    res.send(sortedEvents);

  });

})

function currentevents(story) {
  //console.log("hiiiii in ondate", new Date(story.startdatetime));
  return Date.parse(new Date(story.startdatetime)) >= Date.parse(new Date())
}

app.post('/api/search', (req, res) => {

  console.log("inside /search ", req.body);
  const { selectedOptionTags, dates, timezone } = req.body;
  //console.log("timezone in index.js:", timezone);

  function ondateEvents(story) {
   // console.log("timezone in index.js:", moment(story.startdatetime).tz(timezone).format('DD'));
    //console.log("timezone in index.js:", moment(story.startdatetime).tz(timezone).format());

    return (
      (moment(story.startdatetime).tz(timezone).format('MM') === moment(dates).tz(timezone).format('MM')) &&
      (moment(story.startdatetime).tz(timezone).format('DD') === moment(dates).tz(timezone).format('DD')));
  }

  

  if (selectedOptionTags != null && selectedOptionTags.length != 0) {
    const findtags = selectedOptionTags.map((item) => (item.value))

    Event.find({ tags: { $all: findtags } }, function (err, event) {

      console.log("another finf :", event);
      let fil = [];
      if(dates != null)
         fil = event.filter(ondateEvents);
      else 
        fil = [].concat(event);
      const filt1 = fil.filter(currentevents);
      res.send(filt1);
      //console.log(event.op[0]._id.getTimeStamp())


    });
  }
  else {


    Event.find({}, function (err, event) {

      console.log("another finf no tags  evet.length:", event.length);
      console.log("another f :", req.body);

      let currEvents = [];
      if(dates != null)
        currEvents = event.filter(ondateEvents);
      else 
      currEvents = [].concat(event);
      const filt2 = currEvents.filter(currentevents);
      let sortedEvents = [];
      if (req.body.selectedOptionSortBy.value == 58) {
        console.log("insidew sortby server");
        sortedEvents = filt2.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else {
        sortedEvents = filt2.slice().sort((a, b) => new Date(a.startdatetime) - new Date(b.startdatetime));
      }
      console.log("anothercurrEvents.length :", currEvents.length);
      console.log("another filt2.length :", filt2.length);

      res.send(sortedEvents);
      //console.log(event.op[0]._id.getTimeStamp())


    });

  }
})

app.get('/api/tags', (req, res) => {

  Event.find().distinct('tags', function (error, tagTitles) {
    console.log("all tagtitles :", tagTitles);
    const tagTitlesFilter = tagTitles.filter((item) => { return item != null })
    //const fil = tagTitlesFilter.filter(currentevents);
    console.log("all upcoming tagtitles :", tagTitlesFilter);
    res.send(tagTitlesFilter);
    //respond with the results array
    // res.json(results);
  });
})


app.get('/new', (req, res) => {

  Event.find({}, function (err, event) {
    const sortedEvents = event.slice().sort((a, b) => new Date(a.startdatetime) - new Date(b.startdatetime));
    //console.log("new :",event);
    //console.log(event.op[0]._id.getTimeStamp())
    res.send(sortedEvents);

  });




  Event.find({ tags: { $in: ['helllo', 'me'] } }, function (err, event) {

    console.log("another finf :", event);
    //console.log(event.op[0]._id.getTimeStamp())


  });


  Event.find().distinct('tags', function (error, tagTitles) {
    console.log("another tagtitles :", tagTitles);

    //respond with the results array
    // res.json(results);
  });

})


/*register user*/
app.post('/api/register', function (req, res) {

  const newuser = new User(req.body);

  // if(newuser.password!=newuser.password2)return res.status(400).json({message: "password not match"});

  User.findOne({ email: newuser.email }, function (err, user) {

    if (user) return res.json({ success: false, message: "email already exists" });

    newuser.save((err, doc) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ success: false });
      }
      res.status(200).json({
        success: true,
        user: doc
      });
    });
  });
});


// login user
app.post('/api/login', function (req, res) {
  let token = req.cookies.auth;
  User.findByToken(token, (err, user) => {
    if (err) return res(err);
    if (user) return res.status(400).json({
      error: true,
      message: "You are already logged in"
    });

    else {
      User.findOne({ 'email': req.body.email }, function (err, user) {
        if (!user) return res.json({ isAuth: false, message: ' Auth failed ,email not found' });

        user.comparepassword(req.body.password, (err, isMatch) => {
          if (!isMatch) return res.json({ isAuth: false, message: "password doesn't match" });

          user.generateToken((err, user) => {
            if (err) return res.status(400).send(err);
            res.cookie('auth', user.token).json({
              isAuth: true,
              id: user._id
              , email: user.email,
              username: user.firstname
            });
          });
        });
      });
    }
  });
});

//logout user
app.get('/api/logout', auth, function (req, res) {
  req.user.deleteToken(req.token, (err, user) => {
    if (err) return res.status(400).send(err);
    res.sendStatus(200);
  });

});

// get logged in user
app.get('/api/profile', auth, function (req, res) {
  res.json({
    isAuth: true,
    id: req.user._id,
    email: req.user.email,
    name: req.user.firstname + req.user.lastname

  })
});

app.get(['/submit', '/login', '/signup'], (req, res) => {
  //console.log("path esolve",path.resolve(__dirname, '../build', 'index.html'));                  
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});







const PORT = process.env.PORT || 3030;

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});


