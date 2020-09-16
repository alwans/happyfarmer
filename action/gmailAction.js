const { printLog, random, i_wait,durationTime,rateRun } = require("../utils");
const { goto_url,i_wheel, mouseRandomWheel, mouseRandomMove,page_scroll } = require("../launchBrowser");

const gmail_url = 'https://www.gmail.com';
const gmail_homePage_url = 'https://mail.google.com/mail/u/0/#inbox';

let firtRunGmail = true;
const runGmail = async function(obj,event){
    printLog(`task(${obj.id}) start run gmail task...,run time: ${event.times} min`);
    let startTime = Date.now();
    firtRunGmail = true;
    while(durationTime(startTime,event.times)){
        switch(random(0,7)){
            case 0:{
                await goto_mailList_page(obj);
                let t1 = random(50*1000,2*60*1000);
                printLog(`task(${obj.id}) start current page sleep, sleep time: ${parseInt(t1/1000)} s`);
                await i_wait(t1);
                break;
            }
            case 1:{
                if(rateRun(4)){
                    await deleteGmail(obj);
                }else{
                    await goto_mailList_page(obj);
                    let t1 = random(3*1000,10*1000);
                    printLog(`task(${obj.id}) start current page sleep, sleep time: ${parseInt(t1/1000)} s`);
                    await i_wait(t1);
                }
                break;
            }
            case 2:{
                let mails = [];
                let list = await mailList(obj);
                mails.push(list.unReadGmail);
                mails.push(list.readGmail);
                if(rateRun(5)){
                    await watchGmail(obj,mails[1]);
                }else{
                    await watchGmail(obj,mails[0]);
                }
                break;   
            }
            default:{
                let mails = [];
                let list = await mailList(obj);
                mails.push(list.unReadGmail);
                mails.push(list.readGmail);
                if(rateRun(5)){
                    await watchGmail(obj,mails[1]);
                }else{
                    await watchGmail(obj,mails[0]);
                }
                break;   
            }
        }
    }
    printLog(`task(${obj.id}) run gmail task ..... end`);
}

const deleteGmail = async function(obj){
    printLog(`task(${obj.id}) start delete gmail`);
    let page = obj.page;
    await goto_mailList_page(obj);
    let checks=[];
    let btn_delete='';
    try{
        // checks = await page.$$('.oZ-x3');
        checks = await page.$$('.oZ-jc');
    }catch(e){
        printLog(`task(${obj.id}) get checks ele is error, err: ${e}`);
        return -1;
    }
    if(checks.length==0) return -1;
    let index = random(0,checks.length);
    if(obj.platform='webkit'){
        await checks[index].scrollIntoViewIfNeeded();
    }
    await checks[index].click();
    try{
        if(checks[index].getAttribute('aria-checked')=='true'){
            btn_delete = await page.waitForSelector('div[act="10"]');
            await btn_delete.click();
        }else{
            printLog(`task(${obj.id}) check is failed, delete gmail is no execute`);
        }
    }catch(e){
        printLog(`task(${obj.id}) get delete btn ele is error, err: ${e}`);
        return -1;
    }
    printLog(`task(${obj.id}) delete gmail is success`);

}

const watchGmail = async function(obj,mailList){
    printLog(`task(${obj.id}) start watch mail`);
    let page = obj.page;
    await goto_mailList_page(obj);
    // let unReadGmail = await (await maliList(obj)).unReadGmail;
    // let readGmail= await (await maliList(obj)).readGmail;
    if(mailList.length>0){
        let num  = random(0,mailList.length>20?20:mailList.length);
        console.log('selected mail index: ',num);
        let isOpen = false;
        while(!isOpen && num<mailList.length){
            try{
                printLog(`task(${obj.id}) open selected gmail`);
                if(obj.platform=='webkit'){
                    await mailList[num].scrollIntoViewIfNeeded();
                }
                const [response] = await Promise.all([
                    page.waitForNavigation({timeout:15000}), // The promise resolves after navigation has finished
                    mailList[num].click({timeout:10000}), // Clicking the link will indirectly cause a navigation
                ]);
                // await mailList[num].click();//open selected gmail
                isOpen = true;
            }catch(e){
                printLog(`task(${obj.id}) open mail details page is error, err: ${e}`);
                num++;
            }
        }
        if(num>=mailList.length){
            printLog(`task(${obj.id}) open mail details page is error`);
            return -1;
        }else{
            await i_wait(1000);
            let var2 = random(0,4);
            switch(var2){
                case 0:{
                    await mouseRandomMove(page);
                    let t1 = random(5*1000,10*1000);
                    printLog(`task(${obj.id}) stay page : ${t1/1000}s`);
                    await i_wait(t1);
                    break;
                }
                case 1:{
                    await mouseRandomMove(page);
                    let t2 = random(30*1000,120*1000);
                    printLog(`task(${obj.id}) space page..., stay page: ${t2/1000}s`);
                    await page.keyboard.press('Space');
                    await i_wait(t2);
                    break;
                }
                case 2:{
                    await mouseRandomMove(page);
                    let t3 = random(50*1000,150*1000);
                    printLog(`stay page : ${t3/1000}s`);
                    await i_wait(t3);
                    break;
                }
                case 3:{
                    await mouseRandomMove(page);
                    let t4 = random(50*1000,150*1000);
                    if(obj.platform=='webkit'){
                        t4 = random(30*1000,60*1000);
                        let pos = 0;
                        let counts = random(2,5);
                        while(pos<counts){
                            pos++;
                            if(rateRun(5)){
                                console.log('uuuuuuu');
                                await page_scroll(page,3,'ArrowUp');
                            }else{
                                console.log('dddddd');
                                await page_scroll(page,3,'ArrowDown');
                            }
                            await page.mouse.move(random(0,200),random(0,200));
                        }
                    }else{
                        await mouseRandomWheel(page);
                    }
                    printLog(`task(${obj.id}) page scroll read..., stay page: ${t4/1000}s`);
                    await i_wait(t4);
                    break;
                }
            }
        }
    }else{
        printLog(`only stay page : 5s`);
        await i_wait(5000);
    }
    printLog(`task(${obj.id}) watch gmail is end`);
    await goto_mailList_page(obj);
    
}

const goto_mailList_page = async function(obj){
    let page = obj.page;
    let current_url = await page.evaluate(_ =>{return document.URL});
    // console.log(current_url);
    if(!firtRunGmail && current_url !=gmail_homePage_url){
        if(obj.platform=='webkit'){
            await page.goBack({
                timeout:0,
                waitUntil:'domcontentloaded'
            });
        }else{
            await page.goBack({
                timeout :0,
                waitUntil :['domcontentloaded','networkidle2']
            }); 
            // await page.waitForNavigation();
        }
        await page.waitForSelector('.aim', { timeout: 0 });
        current_url = await page.evaluate(_ =>{return document.URL});
    }
    if(current_url !=gmail_homePage_url){
        await goto_url(obj,gmail_url);
        // await page.waitForNavigation();
    }
    firtRunGmail = false;
}

const mailList = async function(obj){
    let page = obj.page;
    await goto_mailList_page(obj);
    let unReadGmail = [];
    let readGmail = [];
    try{
        unReadGmail = await page.$$('.zF');
        readGmail = await page.$$('.yP');
    }catch(e){
        printLog(`task(${obj.id}) get mail list is error,err: ${e}`);
    }
    unReadGmail.map((v,index) =>{
        if(index%2==0){
            unReadGmail.splice(index,1);
        }
    });
    readGmail.map((v,index) =>{
        if(index%2==0){
            unReadGmail.splice(index,1);
        }
    });
    return {unReadGmail:unReadGmail,readGmail:readGmail};
}

module.exports={
    runGmail
}