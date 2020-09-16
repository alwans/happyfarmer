const {launchBrowser, launchWebkit} = require('./launchBrowser');
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
const {runYoutube} = require('./action/youtubeAction');
const { map } = require('puppeteer/DeviceDescriptors');

const tasks = [];

const webkitStart = async function(){
    let info = {
        gmail:'anthony6roberts65a@gmail.com',
        password:'yC59P9DRxC',
        proxy:'127.0.0.1:1080'
    }
    let obj = await launchWebkit(info);
    let page = obj.page;
    // await i_wait(10000);
    // await runSearch(obj,{times:15});
    // await runGmail(obj,{times:15});
    // await runWatchNews(obj,{times:15});
    // await runYoutube(obj,{times:15});
    // try{
    //     const [popup] = await Promise.all([
    //         page.waitForEvent('popup'),
    //         // page.evaluate(() => window.open('https://example.com')),
    //     ]);
    // }catch(e){

    // }
    // // console.log(popup);
    // // console.log(await popup.evaluate('location.href'));
    // console.log(obj.context.pages().length);
    // await obj.context.pages()[1].close();
    await i_wait(1*60000);
    await obj.context.close();
    await obj.browser.close();

}

// webkitStart();

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
        // 'browserWSEndpoint':'ws://127.0.0.1:9222/devtools/browser/405f6546-8b8b-488f-82be-af99488ac340',//通过http://127.0.0.1:9222/json/version获取
        defaultViewport:{width:1920,height:1080}
        // defaultViewport:null,
    });
    let pages = await browser.pages();
    let page = pages[0];
    let obj = {id:'0001','browser':browser,'page':page,news:{
        homeNews:[]
    }};
    await page.goto('https://www.footlocker.com/');
    // await runSearch(obj,{times:15});
    // await runGmail(obj,{times:3});
    // await runWatchNews(obj,{times:30});
    // await runYoutube(obj,{times:30});

    await i_wait(1*60000);
    // intervalTask(obj,1000);
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
async function resizeWindow(browser_obj,width, height) {
	let browser = browser_obj.browser;
	let page = browser_obj.page;
	// await page.setViewport({ width: width, height: height });

	// Window frame - probably OS and WM dependent.
	height += 85;

	// Any tab.
	const {targetInfos: [{targetId}]} = await browser._connection.send(
		'Target.getTargets'
	);

	// Tab window. 
	const {windowId} = await browser._connection.send(
		'Browser.getWindowForTarget',
		{targetId}
	);

	// Resize.
	await browser._connection.send('Browser.setWindowBounds', {
		bounds: {height, width},
		windowId
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