const { printLog, durationTime, random, i_wait,stayForTime,rateRun } = require("../utils");
const {clearText, autoScroll, mouseRandomWheel, mouseRandomMove, goto_url} = require('../launchBrowser');
const search_url = 'https://www.google.com/';


const runSearch = async function(obj,event){
    printLog(`task(${obj.id}) start run search task...,run time: ${event.times}min`);
    let startTime = Date.now();
    let imageWords = ['rugby player','football palyer','basketball player'];
    let words = ['java == equals','puppeteer api','tiktok followers'];
    while(durationTime(startTime,event.times)){
        if(rateRun(4)){
            await image_search(obj,obj.page,imageWords[random(0,3)]);
        }else{
            await word_search(obj,obj.page,words[random(0,3)]);
        }
    }
    printLog(`task(${obj.id}) run search task ..... end`);
}

const image_search = async function(obj,page,keyWord){
    printLog(`task(${obj.id}) search image keyword: ${keyWord}`);
    await search_keyWord(obj,page,keyWord);
    // console.log('search is complete');
    await i_wait(2000);
    let search_types = await page.$$('.hdtb-mitem');
    // console.log(search_types);
    if(search_types.length>0){
        for(let v of search_types){
            if(await (await v.getProperty('innerText')).jsonValue()=='Images'){
                await v.click();
                await page.waitForSelector('a[jsname="sTFXNd"]');
                break;
            }
        }
    } 
    let pos = 0;
    let counts = random(10,15);
    printLog(`task(${obj.id}) start click image...`);
    while(pos<counts){
        marks = await page.$$('a[jsname="sTFXNd"]');
        // console.log('marks counts: ',marks.length);
        let index = random(0,marks.length>=80?80:marks.length);
        // console.log('index: ',index);
        boundingBox = await marks[index].boundingBox();
        // let h = boundingBox.y-900>0?boundingBox.y-700:0;
        let page_height = await page.evaluate(_ =>{return window.screen.availHeight})
        // let h = boundingBox.y-900;
        let h = boundingBox.y-page_height;
        // console.log('h: ',h);
        if(h>500){
            while(h>500){
                let h1 = random(300,500);
                // console.log('h1: ',h1);
                await page.mouse.wheel({ deltaY:h1});
                await page.mouse.move(0,10);
                await i_wait(random(500,1500));
                h = h -h1;
                console.log('new h: ',h);
            }
        }else if(h<-500){
            while(h<-500){
                let h1 = random(300,500);
                await page.mouse.wheel({ deltaY:h1-h1*2});
                await page.mouse.move(0,10);
                await i_wait(random(500,1500));
                h = h + h1;
            }
        }
        // console.log('last h: ',h);
        await page.mouse.wheel({ deltaY:h});
        marks = await page.$$('a[jsname="sTFXNd"]');
        boundingBox = await marks[index].boundingBox();
        // console.log(boundingBox);
        await page.mouse.move(0,10);
        marks = await page.$$('a[jsname="sTFXNd"]');
        boundingBox = await marks[index].boundingBox();
        // console.log(boundingBox);
        await i_wait(random(3000,5000));
        await page.mouse.click(boundingBox.x,boundingBox.y);
        let t1 = random(5*1000,15*1000);//random(5*1000,30*1000);
        printLog(`task(${obj.id}) look up image, stay time: ${t1/1000}s`);
        await i_wait(t1);
        let pages = await obj.browser.pages();
        if(pages.length>1){
            console.log('close other link');
            for(let i= 1;i<pages.length;i++){
                await pages[i].close();
            }
            await page.bringToFront()
        }
        pos++;
    }
    printLog(`task(${obj.id}) image keyword: ${keyWord} result look up end`);
}

const word_search = async function(obj,page,keyWord){
    printLog(`task(${obj.id}) search keyword: ${keyWord}`);
    await search_keyWord(obj,page,keyWord);
    await watchResult(obj,page);
    printLog(`task(${obj.id}) keyword: ${keyWord} result look up end`);
}

const search_keyWord = async function(obj,page,keyWord){
    // let page = obj.page;
    await goto_search_page(obj,page);
    // console.log('----------------------------->');
    await i_wait(3000);
    const searchBox = await page.$("input[type=text]");
    await clearText(page,searchBox,"input[type=text]");
    await searchBox.type(keyWord,{delay:100});
    await stayForTime(2,1,3);
    let flag = -1;
    if(rateRun(4)){
        printLog(`task(${obj.id}) look up lenovo search result...`);
        flag = await lenovo_keyWord(obj,page);
        await page.waitForNavigation();
    }
    if(flag==-1){
        await page.keyboard.press('Enter');
        await page.waitForNavigation();
    }

}

const watchResult = async function(obj,page){
    let results = await page.$$('h3');//search result list
    if(results.length>10){
        results = results.splice(0,10);
    }
    let result_index = random(0,results.length-1);
    // console.log(result_index);
    let boundingBox =  await results[result_index].boundingBox();
    let pos = 0;
    let h = await page.evaluate(_ =>{return document.body.scrollHeight;});
    let h1 = h/5;
    // console.log(boundingBox);
    let counts = random(2,5);
    while(pos<counts){
        // console.log('wheel run...');
        pos++;
        let h2 = h1;
        if(rateRun(2)){
            h2 = random(h1-100>0?h1:0,h1);
        }else{
            let h3 =  random(h1-100>0?h1:0,h1);
            h2 = h3 - h3*2;
        }
        await page.mouse.wheel({ deltaY:h2});
        await page.mouse.move(random(0,200),random(0,200));
        await i_wait(3000);
    }
    // if(boundingBox==null){
    //     boundingBox =  await results[random(0,2)].boundingBox();
    // }
    await page.mouse.click(boundingBox.x,boundingBox.y);
    try{
        await page.waitForNavigation({timeout:15000 });
    }catch(e){
    }
    // await wheelClick(obj,page,boundingBox);
    let current_url = await page.evaluate(_ =>{return document.URL});
    if(current_url.indexOf('https://www.google.com/search?')>-1){
        // console.log(results[result_index]);
        await results[result_index].click();
        try{
            await page.waitForNavigation();
        }catch(e){
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
            await results[0].click();
            try{
                await page.waitForNavigation({timeout:5000});
            }catch(e){

            }
        }
    }
    printLog(`task(${obj.id}) look up search result detail page...`);
    switch(random(0,3)){
        case 0:{
            // printLog(`task(${obj.id}) autoScroll look up page...`);
            // await autoScroll(page);
            // break;
            printLog(`task(${obj.id}) mouse wheel look up page...`);
            await mouseRandomWheel(page);
            break;
        }
        case 1:{
            printLog(`task(${obj.id}) mouse wheel look up page...`);
            await mouseRandomWheel(page);
            break;
        }
        default:{
            printLog(`task(${obj.id}) page stay time: 10s`);
            await i_wait(10000);
        }
    }
    await mouseRandomMove(page);
    let t = random(1*60*1000,5*60*1000);
    printLog(`task(${obj.id}) page stay time: ${t/1000}s`);
    await i_wait(t);
}

const wheelClick = async function(obj,page,boundingBox){
    await page.mouse.click(boundingBox.x,boundingBox.y);
    try{
        await page.waitForNavigation({timeout:3000 });
    }catch(e){
        await page.mouse.wheel({ deltaY:500});
        await wheelClick(obj,page,boundingBox);
    }
}

const lenovo_keyWord = async function(obj,page){
    const items = await page.$$('.sbct');
    let item_index = random(0,items.length-2);
    let boundingBox = await items[item_index].boundingBox(); 
    if(boundingBox==null){
        printLog(`task(${obj.id}) lenovo keyWord item is invisable...!`);
        return -1;
    }
    await page.mouse.move(boundingBox.x,boundingBox.y);
    await page.mouse.click(boundingBox.x,boundingBox.y);
}

const goto_search_page = async function(obj,page){
    // let page = obj.page;
    let current_url = await page.evaluate(_ =>{return document.URL});
    if(current_url!=search_url && current_url.indexOf('https://www.google.com/search?')<0){
        await page.goBack({
            timeout :0,
            waitUntil :['domcontentloaded','networkidle2']
        }); 
        try{
            await page.waitForNavigation({timeout:3000});
        }catch(e){

        }
        current_url = await page.evaluate(_ =>{return document.URL});
    }
    if(current_url!=search_url && current_url.indexOf('https://www.google.com/search?')<0){
        await goto_url(obj,search_url);
    }
}

module.exports={
    runSearch
}