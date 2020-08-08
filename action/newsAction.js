const { printLog, random, i_wait,promiseTimeout, rateRun,durationTime } = require("../utils");
const { goto_url } = require("../launchBrowser");

const news_url = 'https://news.google.com/';


const runWatchNews = async function(obj,event){
    printLog(`task(${obj.id}) start run watch news...,run time: ${event.times} min`);
        let startTime = Date.now();
        while(durationTime(startTime,event.times)){
            let index = random(0,3);
            switch(index){
                case 0:{
                    let current_url = await page.evaluate(_ =>{return document.URL});
                    if(current_url.indexOf('https://news.google.com/topstories?')<0){
                        await obj.page.goto(news_url,{
                            timeout: 0,
                            waitUntil: ['domcontentloaded','networkidle2']
                        });
                        // await page.waitForNavigation();
                    }
                    await homePageNews(obj);
                    break;
                }
                case 1:{
                    await hotsNews(obj);
                    break;
                }
                case 2:{
                    await itemNews(obj);
                    break;
                }
                default:{
                    await itemNews(obj);
                    break;
                }
            }
        }

    printLog(`task(${obj.id}) run watch news task ..... end`);
}

const homePageNews = async function(obj){
    let page = obj.page;
    // await goto_news_homePage(obj);
    let pos = 0;
    let counts = random(1,4);
    printLog(`task(${obj.id}) start browse homepage news...`);
    while(pos<counts){
        let links=[];
        try{
            await i_wait(3000);
            await page.mouse.move(random(100,300),random(200,500));
            links = await page.$$('.VDXfz');
        }catch(e){
            printLog(`task(${obj.id}) get homepage news is err, err: ${e}`);
            return -1;
        }
        // console.log(links.length);
        var news = [];
        for(let i=0;i<links.length;i++){
            // console.log(await links[i].boundingBox());
            if(await links[i].boundingBox()!=null){
                news.push(links[i]);
            }
        }
        if(news.length==0) return -1;
        let index = random(0,news.length);
        // while(index in obj.news.homeNews ){
        //     if(obj.news.homeNews.length==news.length){
        //         printLog(`task(${obj.id}) homepage news has been read today`);
        //         return -1;
        //     }
        //     index = random(0,news.length);
        // }
        // obj.news.homeNews.push(index);
        console.log('news count: ',news.length);
        console.log('selected index: ',index);
        let boundingBox = await news[index].boundingBox();
        // console.log(boundingBox);
        // let page_height = await page.evaluate(_ =>{return window.screen.availHeight})
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
                await i_wait(random(3000,5000));
                h = h -h1;
                console.log('new h: ',h);
            }
        }else if(h<-500){
            flag = true;
            while(h<-500){
                let h1 = random(300,500);
                await page.mouse.wheel({ deltaY:h1-h1*2});
                await page.mouse.move(0,10);
                await i_wait(random(1500,5000));
                h = h + h1;
                console.log('new h: ',h);
            }
        }
        if(flag){
            console.log('last h: ',h);
            await page.mouse.wheel({ deltaY:h});
            await page.mouse.move(random(100,300),random(200,500));
            links.length=0;
            news.length=0;
            links = await page.$$('.VDXfz');
            // console.log(links.length);
            news = [];
            for(let i=0;i<links.length;i++){
                // console.log(await links[i].boundingBox());
                if(await links[i].boundingBox()!=null){
                    news.push(links[i]);
                }
            }
            boundingBox = await news[index].boundingBox();
            // console.log(boundingBox);
            await page.mouse.move(random(100,500),random(200,500));
            // links.length=0;
            // news.length=0;
            // links = await page.$$('.VDXfz');
            // // console.log(links.length);
            // news = [];
            // for(let i=0;i<links.length;i++){
            //     // console.log(await links[i].boundingBox());
            //     if(await links[i].boundingBox()!=null){
            //         news.push(links[i]);
            //     }
            // }
            // boundingBox = await news[index].boundingBox();
            // console.log(boundingBox);
        }
        await i_wait(random(3000,5000));
        printLog(`task(${obj.id}) start click news url...`);
        await page.mouse.click(boundingBox.x,boundingBox.y);
        let newPage = await promiseTimeout(newPagePromise(obj), 30000);
        if(newPage==-1){
            printLog(`task(${obj.id}) click open news details page is error, start browse next news`);
            // return -1;
        }else{
            printLog(`task(${obj.id}) goto news detail page...`);
            try{
                await newPage.waitForNavigation();
            }catch(e){}
            let pages = await obj.browser.pages();
            if(pages.length>1){
                await watchDetailsPage(newPage);
            }
            pages = await obj.browser.pages();
            if(pages.length>1){
                printLog(`task(${obj.id}) close news page`);
                for(let i= 1;i<pages.length;i++){
                    await pages[i].close();
                }
                await page.bringToFront()
            }
            let t1 = random(3*1000,8*1000);//random(5*1000,30*1000);
            printLog(`task(${obj.id}) go back news home page, stay time: ${t1/1000}s`);
            await i_wait(t1);
            pos++;
        }
    }
    printLog(`task(${obj.id}) browse homepage news...end`);

}

const hotsNews = async function(obj){
    let page = obj.page;
    let current_url = await page.evaluate(_ =>{return document.URL});
    if(current_url.indexOf('https://news.google.com/topstories?')<0){
        await obj.page.goto(news_url,{
            timeout: 0,
            waitUntil: ['domcontentloaded','networkidle2']
        });
        // await page.waitForNavigation();
    }
    await i_wait(5000);
    let topics = await page.$$('.boy4he');
    await topics[random(0,topics.length)].click();
    await page.waitForNavigation();
    printLog(`task(${obj.id}) start browse topics news`);
    await homePageNews(obj);
    printLog(`task(${obj.id}) start browse topics news...end`);
}

const watchDetailsPage = async function(page){
    await i_wait(5000);
    let scroll_height = await page.evaluate(_ => document.body.scrollHeight)-random(700,900);
    if(scroll_height<2000){
        scroll_height = scroll_height - random(100,300);
    }else if(scroll_height<4000){
        scroll_height = scroll_height - random(500,1000);
    }else if(scroll_height<6000){
        scroll_height = scroll_height - random(900,1800);
    }else if(scroll_height<10000){
        scroll_height = scroll_height - random(2000,3000);
    }else if(scroll_height<15000){
        scroll_height = scroll_height - random(3000,4000);
    }else{
        scroll_height = random(10000,15000);;
    }
    scroll_height = scroll_height>0?scroll_height:0;
    console.log('scroll_height= ',scroll_height);
    let pos = 0;
    while(scroll_height>0){
        pos++;
        // console.log('scroll_height= ',scroll_height);
        if(rateRun(5)){
            h = random(200,500);
            h = h - h*2;   
            await page.mouse.wheel({deltaY:h});
            await page.mouse.move(random(500,500),random(900,700));
            scroll_height = scroll_height - h;
            await i_wait(random(5000,10000));
        }else{
            let h = random(200,700);    
            await page.mouse.wheel({deltaY:h});
            await page.mouse.move(random(500,500),random(900,700));
            scroll_height = scroll_height - h;
            if(h>500){
                await i_wait(random(10*1000,20*1000));
            }else{
                await i_wait(random(5000,10*1000));
            }
        }
    }
    if(pos<5){
        await i_wait(random(10*1000,30*1000));
    }
}

const itemNews = async function(obj){
    let page = obj.page;
    await goto_news_homePage(obj);
    var items = await page.$$('.ICsaqd');
    // console.log(items.length);
    itmes = items.reverse();
    items.splice(0,6);
    items = items.reverse();
    items.splice(0,1);//delete default item
    items.splice(1,2);
    let index = random(0,items.length);
    await items[index].click();
    printLog(`task(${obj.id}) start browse ${index} item news`);
    await homePageNews(obj);
    printLog(`task(${obj.id}) start browse ${index} item news...end`);
}

const searchNews = async function(obj){

}

const searchWord = async function(obj,page,keyWord){

}

const goto_news_homePage = async function(obj){
    let page = obj.page;
    let current_url = await page.evaluate(_ =>{return document.URL});
    if(current_url!=news_url && current_url.indexOf(news_url)<0){
        printLog(`task(${obj.id}) goto news home page...`);
        await goto_url(obj,news_url);
    }
}

const newPagePromise = async function (obj){
    return new Promise(res => 
        obj.browser.once('targetcreated', 
          target => res(target.page())
        )
    );
}

module.exports={
    runWatchNews
}