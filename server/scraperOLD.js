const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
const axios = require("axios");

const fs = require("fs");

const url = 'https://www.youtube.com/c/DudePerfect/videos';
//const url = 'https://www.meetup.com/find/events/?allMeetups=false&keywords=tech&radius=Infinity&userFreeform=Hyderabad%2C+India&mcId=z1018096&mcName=Hyderabad%2C+IN&eventFilter=all';
const string = 'Trick Shots';


async  function fetchFromYoutube(resp) {
    const browser = await puppeteer.launch()
    const page = await  browser.newPage()
    await page.goto(url)
    resp(await page.content())
    browser.close()
}

function getLatestTitle(data) {
  const $ = cheerio.load(data);
    /*let links=[];
   
    console.log("Scraping EventIDs from Meetup");
    $("a").each((index, value) => {
      var link = $(value).attr("href");
      if (/\/[0-9]+\//.test(link)){
        links.push(link);
      } 
    });*/

    let VideoTitles = []
    $('div #details')
      .children('div #meta')
      .children('h3')
      .children('a')
      .each(function (i, el) {
        VideoTitles.push({ title: $(el).text(), link: $(el).attr('href') })
      })
      console.log("Video titles", JSON.stringify(VideoTitles));
    return VideoTitles[0]
  }

  function fetchdata () {
  fetchFromYoutube((data)=>{
      console.log(getLatestTitle(data));
  })
}

fetchdata();

var CronJob = require('cron').CronJob;
var job = new CronJob('0 */10 * * * *', fetchdata
, null, true, 'America/Los_Angeles');
job.start();