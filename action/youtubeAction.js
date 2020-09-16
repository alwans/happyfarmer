const { printLog, random, durationTime, i_wait, rateRun } = require("../utils");
const {page_scroll, goto_url} = require('../launchBrowser');

const youtube_url = 'https://www.youtube.com/';
var runTimes ='';

const runYoutube = async function(obj,event){
    let page = obj.page;
    runTimes = event.times;
    printLog(`task(${obj.id}) start run youtube task...,run time: ${event.times}`);
    let startTime = Date.now();
    let flag = true;
    while(durationTime(startTime,event.times)){
        if(flag){
            flag = false;
            if(obj.platform=='webkit'){
                await webkit_selectedVideo(obj);
            }else{
                await selectedVideo(obj);
            }
        }else{
            let ele = await obj.page.$('.ytp-time-current');
            let boundingBox = await ele.boundingBox();
            // console.log('boundingBox: ',boundingBox);
            await page.mouse.move(boundingBox.x+100,boundingBox.y-100);
            let current_time = await obj.page.$('.ytp-time-current');
            let end_time = await obj.page.$('.ytp-time-duration');
            current_time = await current_time.innerText();
            end_time = await end_time.innerText();
            // console.log('current_time: ',current_time);
            // console.log('end_time: ',end_time);
            if(current_time==end_time){
                flag = true;
            }
        }
        await i_wait(60*1000);
    }
    printLog(`task(${obj.id}) run youtube task ..... end`);
    await goto_url(obj,'https://www.google.com');
}

const webkit_selectedVideo = async function(obj){
    let page = obj.page;
    await page.goto(youtube_url,{
        timeout: 0,
        waitUntil: 'domcontentloaded',
    });
    await i_wait(random(1000,4000));
    if(rateRun(2)){
        await page_random_scroll(obj);
    }
    var list = await page.$$('ytd-rich-item-renderer');
    console.log('list counts : ',list.length);
    let index = random(0,list.length);
    await list[index].scrollIntoViewIfNeeded();
    await i_wait(random(500,2000));
    list.length = 0;
    list = await page.$$('ytd-rich-item-renderer');
    let boundingBox = await list[index].boundingBox()
    printLog(`task(${obj.id}) start click video...`);
    try{
        const [response] = await Promise.all([
            page.waitForNavigation(), // The promise resolves after navigation has finished
            page.mouse.click(boundingBox.x,boundingBox.y), // Clicking the link will indirectly cause a navigation
        ]);
    }catch(e){
        printLog(`task(${obj.id}) click video is failed, clcik next`);
        await webkit_selectedVideo(obj);
        return -1;
    }
    let arr = await randomEvent(obj);

}

const page_random_scroll = async function(obj){
    console.log('page random scroll...');
    let page = obj.page;
    let pos = 0;
    let counts = random(2,5);
    // console.log('counts: ',counts);
    while(pos<counts){
        pos++;
        if(rateRun(7)){
            // console.log('uuuuuuu');
            await page_scroll(page,3,'ArrowUp');
        }else{
            // console.log('dddddd');
            await page_scroll(page,3,'ArrowDown');
        }
        await page.mouse.move(random(0,200),random(0,200));
        await i_wait(random(3000,6000));
    }
}
const selectedVideo = async function (obj) {
    let page = obj.page;
    await page.goto(youtube_url,{
        timeout: 0,
        waitUntil: ['domcontentloaded','networkidle2']
    });
    let pos =0;
    let counts = random(1,6);
    while(pos<=counts){
        pos++;
        let h = random(300,700);
        await page.mouse.wheel({ deltaY:h});
        await page.mouse.move(1000,100);
    }
    await i_wait(random(1000,5000));
    //selected video
    var list = await page.$$('ytd-rich-item-renderer');
    console.log('list counts : ',list.length);
    let index = random(0,list.length);
    let boundingBox = await list[index].boundingBox()
    let h = boundingBox.y-700;
    // let h = boundingBox.y-page_height;
    console.log('start h: ',h);
    let flag = false;
    if(h>500){
        flag = true;
        while(h>500){
            let h1 = random(300,500);
            console.log('h1: ',h1);
            await page.mouse.wheel({ deltaY:h1});
            await page.mouse.move(0,10);
            await i_wait(random(500,1500));
            h = h -h1;
            console.log('new h: ',h);
        }
    }else if(h<-500){
        flag = true;
        while(h<-500){
            let h1 = random(300,500);
            await page.mouse.wheel({ deltaY:h1-h1*2});
            await page.mouse.move(0,10);
            await i_wait(random(500,1500));
            h = h + h1;
            console.log('new h: ',h);
        }
    }
    if(flag){
        console.log('last h: ',h);
        await page.mouse.wheel({ deltaY:h});
        await page.mouse.move(random(100,300),random(200,500));
        list.length=0;
        list = await page.$$('ytd-rich-item-renderer');
        boundingBox = await list[index].boundingBox();
    }
    await i_wait(random(1000,3000));
    await page.mouse.move(boundingBox.x,boundingBox.y);
    printLog(`task(${obj.id}) start click video...`);
    await page.mouse.click(boundingBox.x,boundingBox.y);
    try{
        await page.waitForNavigation();
    }catch(e){
        printLog(`task(${obj.id}) click video is error`);
        return -1;
    }
    let arr = await randomEvent(obj);
//     if(rateRun(15)){
//         await next_btn(obj);
//         try{
//             await page.waitForNavigation();
//         }catch(e){}
//         if(arr[0]!=''){
//             clearInterval(arr[0]);
//         }
//         if(arr[0]!=''){
//             clearInterval(arr[0]);
//         }
//     }
}

const randomEvent = async function(obj){
    let t1 = '';
    let t2 = '';
    await skip_adv(obj);
    // if(rateRun(5)){
    //     t1= setInterval(async function(){
    //         clearInterval(t1);
    //         await fastForward(obj);
    //     },random(30*1000,120*1000));
    // }else if(rateRun(8)){
    //     t2= setInterval(async function(){
    //         clearInterval(t2); 
    //         await fastBackward(obj);
    //     },random(60*1000,150*1000));
    // }
    // if(rateRun(10)){
    //     await playAndStop_btn(obj);
    //     await i_wait(random(15*1000,60*1000));
    //     await playAndStop_btn(obj);
    // }
    return [t1,t2]
}

const skip_adv = async function(obj){
    await i_wait(random(6000,9000));
    console.log('click skip adv...1111');
    let page = obj.page;
    let skip_btn = await page.$('.ytp-ad-skip-button-text');
    console.log(skip_btn);
    if(skip_btn!=null){
        await skip_btn.click();
    }
    // console.log(await skip_btn.boundinxBox());
    // if(skip_btn!=null && await skip_btn.boundinxBox()!=null){
    //     console.log('click skip adv...');
    //     let boundinxBox =  await skip_btn.boundinxBox();
    //     await page.mouse.move(boundinxBox.x,boundinxBox.y);
    //     await page.mouse.click(boundinxBox.x,boundinxBox.y);
    // }
}

const fastForward = async function(obj){
    console.log('run fastForward');
    let page = obj.page;
    let pp = await page.$$('.ytp-progress-bar-padding');
    let boundingBox = await pp.pop().boundingBox();
    let point = await page.$$('.ytp-scrubber-container');
    let point_boundingBox = await point.pop().boundingBox();
    // console.log(boundingBox);
    if(boundingBox.width-point_boundingBox.x>200){
        let new_x = boundingBox.width-point_boundingBox>500?500:boundingBox.width-point_boundingBox;
        new_x = random(point_boundingBox.x+100,new_x);
        await page.mouse.move(new_x,boundingBox.y);
        await page.mouse.click(new_x,boundingBox.y);
    }
}

const fastBackward = async function(obj){
    console.log('run fastBackward');
    let page = obj.page;
    let pp = await page.$$('.ytp-progress-bar-padding');
    let boundingBox = await pp.pop().boundingBox();
    let point = await page.$$('.ytp-scrubber-container');
    let point_boundingBox = await point.pop().boundingBox();
    // console.log(boundingBox);
    if(point_boundingBox.x-boundingBox.x>400){
        new_x = random(boundingBox.x+100,point_boundingBox.x-100);
        await page.mouse.move(new_x,boundingBox.y);
        await page.mouse.click(new_x,boundingBox.y);
    }
}

const playAndStop_btn = async function(obj){
    console.log('run playAndStop_btn');
    let page = obj.page;
    let play_btn = await page.$$('.ytp-play-button');
    let boundinxBox = await play_btn.pop().boundingBox();
    // console.log(await play_btn.pop().boundingBox());
    await page.mouse.move(boundinxBox.x,boundinxBox.y+16);//+16
    await page.mouse.click(boundinxBox.x,boundinxBox.y+16);
}

const next_btn = async function(obj){
    let page = obj.page;
    let next_btn = await page.$$('.ytp-next-button');
    let boundingBox = await next_btn.boundingBox();
    // console.log(await next_btn.pop().boundingBox());
    await page.mouse.move(boundinxBox.x,boundinxBox.y+16);//+16
    await page.mouse.click(boundinxBox.x,boundinxBox.y+16);
}

const fullscreen_btn = async function(obj){
    let page = obj.page;
    if(rateRun(5)){
        await page.keyboard.press('f');
    }else{
        let fullscreen_btn = await page.$('.ytp-fullscreen-button');
        let boundingBox = await fullscreen_btn.boundingBox();
        await page.mouse.move(boundinxBox.x,boundinxBox.y+16);//+16
        await page.mouse.click(boundinxBox.x,boundinxBox.y+16);
    }
}

const quitFullscreen = async function(obj){
    let page = obj.page;
    await page.keyboard.press('Escape');
}

const search_video = async function(obj,keyword){
    let page = obj.page;
    await page.waitForSelector("#container input#search");
    await page.type("#container input#search", keyword, { delay: 70 });
    await Promise.all([page.keyboard.press("Enter"), page.waitForNavigation({ waitUntil: "networkidle2" })]);
    await page.waitForSelector("#contents a#video-title")
}

module.exports={
    runYoutube
}