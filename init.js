const {launchBrowser} = require('./launchBrowser');
const puppeteer = require('puppeteer');
const {runAction} = require('./actionHandler');
const { printLog,i_wait, random,promiseTimeout } = require('./utils');
const { runGmail } = require('./action/gmailAction');
const googleTrends = require('google-trends-api');
const {runSearch} = require('./action/serachAction');
const { link } = require('fs');
const { resolve } = require('path');
const { ADDRGETNETWORKPARAMS } = require('dns');
const { runWatchNews } = require('./action/newsAction');

const tasks = [];


const start = async function(){
    // let infos = [];
    // let info = {
    //     userDataDir:'C:\\Users\\wl\\AppData\\Local\\Google\\test',
    //     proxy:''
    // }
    // let info2 = {
    //     userDataDir:'',
    //     proxy:''
    // }
    // infos.push(info);
    // // infos.push(info2);
    // await init(infos);
    // tasks.map((obj) =>{
    //     runGmail(obj,{times:10});
    //     // intervalTask(obj,1000);
    // });
    const browser = await puppeteer.connect({
        'browserWSEndpoint':'ws://127.0.0.1:9222/devtools/browser/519df336-45ea-4d66-8ce3-6e273a8fb1a0',
        'ignoreHTTPSErrors ':true,
        defaultViewport:{width:1920,height:1080}
    });
    let pages = await browser.pages();
    let page = pages[0];
    let obj = {id:'0001','browser':browser,'page':page,news:{
        homeNews:[]
    }};
    // await runSearch(obj,{times:15});
    // await runGmail(obj,{times:3});
    await runWatchNews(obj,{times:30});



    // await items[items.length-1].click();
    console.log('--------------------------------');
    // const innerWidth = await page.evaluate(_ => { return window.innerWidth} );
    // const innerHeight = await page.evaluate(_ => { return window.innerHeight} );
}
async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 120);
        });
    });
}

const init = async function(infos){
    for(info of infos){
        let obj = await launchBrowser(info);
        tasks.push(obj);
    }
}

const loginAccount = async function(){

}

const intervalTask = function(obj,poll_time){
    let timeInt = setInterval(async function(){
        clearInterval(timeInt);
        obj.taskCount++;
        let poll_time = await runAction(obj);
        printLog(`task(${obj.id}) start sleep ,sleep time: ${poll_time} min`);
        intervalTask(obj,poll_time*60*1000);
    },poll_time);
    // clearInterval(timeInt);
}


start();