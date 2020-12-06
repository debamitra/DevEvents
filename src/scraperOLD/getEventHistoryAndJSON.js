
const cheerio = require("cheerio");
const axios = require("axios");

const fs = require("fs");

var DetectLanguage = require('detectlanguage');

var detectlanguage = new DetectLanguage('7ef7852d3eea4ed94c47ca87baa58bbc');

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


/*async function  isEnglish(text){

  let encoded = encodeURI(text);

  let eventURL = `http://api.languagelayer.com/detect?access_key=89e2b7f7e25a66dd8d8fd6e3f04db97a&query=${encoded}/`;
  axios
  .get(eventURL)
  .then(response => {
    // Load the web page source code into a cheerio instance
    //const $ = cheerio.load(response.data);
    //console.log("text:",text);
   // console.log("response:",response.data.results);
    //if(response !== undefined && response.data !== undefined && response.data.results != undefined && response.data.results[0].language_code == 'en'){
         filtered.push(myMap.get(text)); 
         getList1(myMap.get(text));
         console.log(JSON.stringify(list1));

         fs.writeFile('Output.txt', JSON.stringify(list1), (err) => { 
      
          // In case of a error throw err. 
          if (err) throw err; 
      }) 



    //}
      

      console.log("filter:",filtered);
 
  

  }).catch(function (error) {
    console.log(error);
  });
  
  

}*/



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
          "startDate":jsonObj.startDate,
          "endDate": jsonObj.endDate,
          "url": eventURL,
          "attendeecount": numb
                }
        getMap(jsonObj.name,myData);
        

        

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

         fs.writeFile('Output.txt', JSON.stringify(list1), (err) => { 
      
          // In case of a error throw err. 
          if (err) throw err; 
      }) 

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
 

  fs.writeFile('Output.txt', JSON.stringify(list1), (err) => { 

   // In case of a error throw err. 
   if (err) throw err; 
}) 
  //list.forEach((c) => {
   //isEnglish(c);
  //});
 return JSON.stringify(list1);




 

  
};

scrapeHistoryAndEvents();




