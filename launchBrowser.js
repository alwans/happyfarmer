const puppeteer = require('puppeteer');
const { getUUID, random, i_wait, printLog,rateRun } = require('./utils');


const browser_param_init = function(proxy){
    let p =  proxy.split(':');
    let params=[
            '--disable-dev-shm-usage',         // 创建临时文件共享内存
            '--disable-accelerated-2d-canvas', // canvas渲染
            '--disable-gpu',                   // GPU硬件加速
            '--proxy-server=http://'+p[0]+':'+p[1]
        ];
    return params;
}

const launchBrowser = async function(info){
    let browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome',
        userDataDir:info.userDataDir||'',
        defaultViewport:null,
        handleSIGINT:true,//是否可以使用 CTRL+C 关闭并退出浏览器
        timeout:0,//等待 Chrome 实例启动的最长时间。默认为30000（30秒）。如果传入 0 的话则不限制时间
        headless: false,
        ignoreDefaultArgs: ["--enable-automation"],
        args: info.proxy==''? []: browser_param_init(info.proxy)
    });
    const pages = await browser.pages();
    const page = pages[0];
    if(info.proxy!=''){
        let p = info.proxy.split(':');
        await page.authenticate({
            username: p[1],
            password: p[2],
        });
    }
    return {
        id:getUUID(),
        browser:browser,
        page:page,
        taskCount:0,//every data task run count
        sumCount:random(100,150)
    }
}

const goto_url = async function(obj,url){
    await obj.page.goto(url, {
        timeout: 0,
        waitUntil: ['domcontentloaded','networkidle2']
    });
}

/**
 * 
 * @param {*} obj 
 * @param {*} rateNum 
 * @param {*} counts 
 * @param {*} piex 
 * @param {*} minTime /s
 * @param {*} maxTime /s
 */
const scrollPageForWheel = async function(page,rateNum,counts,piex,minTime,maxTime){
    if(rateRun(rateNum)){
        for(let i=0;i<counts;i++){
            await page.mouse.wheel({ deltaY: piex });
            let t = random(minTime*1000,maxTime*1000);
            printLog(`wheel: sleep time: ${t/1000} s`);
            await i_wait(t);
        }
    }
}

/**
 * 
 * @param {*} ojb 
 * @param {*} rateNum 
 * @param {*} counts 
 * @param {*} minTime /s
 * @param {*} maxTime /s
 */
const scrollPageForSpace = async function(page,rateNum,counts,minTime,maxTime){
    if(rateRun(rateNum)){
        for(let i=0;i<counts;i++){
            await page.keyboard.press('Space');
            let t = random(minTime*1000,maxTime*1000);
            printLog(`space: sleep time: ${t/1000} s`);
            await i_wait(t);
        }
    }
}

/**
 * 
 * @param {*} page :puppeteer.page
 * @param {*} ele :ElementHandle
 * @param {*} selector :str
 */
const clearText = async function(page,ele,selector){
    if(await page.$eval(selector, el => el.value)==''){
        return true;
    }
    await ele.click();
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyA');
    await page.keyboard.up('Control')
    await page.keyboard.press('Backspace');
}

const i_wheel = async function(page,info){
    let pos = 0;
    while(pos<info.counts){
        pos++;
        printLog(`sleep time: ${info.timeout/1000} s`);
        await i_wait(info.timeout);
        await page.mouse.wheel({ deltaY: info.piex });
    }
}

/**
 * fullpage scroll
 * @param {*} page 
 */
const autoScroll = async function(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var h1 = document.body.scrollHeight;
            var distance = h1/8;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 15000);
        });
    });
}

const mouseRandomMove = async function(page){
    let pos = 0;
    while(pos<3){
        pos++;
        await page.mouse.move(random(500,1000),random(300,700));
    }
}

const mouseRandomWheel = async function(page){
    let pos = 0;
    let counts = random(1,5);
    while(pos<counts){
        pos++;
        let h = random(80,500);
        if(rateRun(3)){
            h = h - h*2;
        }
        await page.mouse.wheel({ deltaY:h});
        await page.mouse.move(random(0,200),random(0,300));
        await i_wait(random(300,5000));
    }
}

module.exports = {
    launchBrowser,
    goto_url,
    i_wheel,
    autoScroll,
    clearText,
    mouseRandomMove,
    mouseRandomWheel 
}