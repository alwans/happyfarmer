const untils = require("./utils")
const { printLog, random } = require("./utils");
const { runYoutube } = require("./action/youtubeAction");
const { runGmail } = require("./action/gmailAction");
const { runWatchNews } = require("./action/newsAction");
const { runSearch } = require("./action/serachAction");

const longTimeEvent = ['youtubeEvent'];
const masterEvent=['gmailEvent','nwesEvent'];
const branchEvent=['searchEvent'];//'translateEvent',

const runAction = async function(obj){
    // console.log(obj);
    let runTime = untils.random(20,50);
    let poll_time = getPollTime(obj,runTime);
    let events = pipeEvent(runTime);
    for(event of events){
        switch(event.eventName){
            case 'youtubeEvent':{
                await runYoutube(obj,event);
                break;
            }
            case 'gmailEvent':{
                await runGmail(obj,event);
                break;
            }
            case 'nwesEvent':{
                await runWatchNews(obj,event);
                break;
            }
            case 'searchEvent':{
                await runSearch(obj,event);
                break;
            }
        }
    }
    return poll_time;
}

const pipeEvent = function(runTime){
    console.log('runTime: ',runTime);
    let preNum =[];
    let events = [];
    let oriEvents = masterEvent.concat(branchEvent).concat(longTimeEvent);
    let isIncludeYoutube = false;
    let for_num = random(3,5)
    while(for_num>0){
        let num = random(0,4);
        while(preNum.indexOf(num)>-1){
            num = random(0,4);
        }
        preNum.push(num);
        if(!isIncludeYoutube && oriEvents[num]=='youtubeEvent'){
            isIncludeYoutube = true;
        }
        events.push({eventName:oriEvents[num],times:0});
        for_num--;
    }
    if(runTime>=35 && !isIncludeYoutube){
        events.push({eventName:longTimeEvent[0],times:0});
    }
    return setEventRunTime(events,runTime);
}
const setEventRunTime = function(events,runTime){
    if(runTime>35){
        events.map((obj) =>{
            if(obj.eventName==longTimeEvent[0]){
                obj.times = random(20,30);
                runTime = runTime-obj.times;
            }
        });
    }
    let pos = 0;
    events.map((obj,index) =>{
        let svgTime = parseInt(runTime/(events.length-pos));
        pos++;
        if(obj.times==0){
            if(index==events.length-1){
                obj.times = runTime;
            }else{
                obj.times = random(parseInt(svgTime/2),svgTime*2);
                runTime = runTime - obj.times;
            }
        }
    });
    return events;
}

const getPollTime = function(obj,runTime){
    let hour = untils.currentTime().split(':')[0];
    let min = untils.currentTime().split(':')[1];
    let poll_time = 1000;
    if(hour<9){
        obj.taskCount=0; //reset every day run counts
        obj.sumCount=untils.random(100,150) //reset every day run max counts
        obj.news.homeNews.length=0;
        poll_time = ((9-hour)*60+untils.random(10,30)-min);
        printLog(`task(${obj.id}) reset counts,taskcout: ${obj.taskCount}, sumCount: ${obj.sumCount}`);
    }else if(obj.taskCount<=obj.sumCount){
        let min = untils.random(150,200);
        let max = untils.random(240,300);
        if(runTime<=25){
            min = untils.random(60,90);
            max = untils.random(120,150);
        }else if(runTime<=30){
            min = untils.random(150,180);
            max = untils.random(210,240);
        }else if(runTime<=40){
            min = untils.random(180,210);
            max = untils.random(240,300);
        }else if(runTime<=50){
            min = untils.random(240,300);
            max = untils.random(400,500);
        }else{
            min = untils.random(180,200);
            max = untils.random(240,300);
        }
        poll_time = untils.random(min,max);
    }else{
        poll_time = (24-hour+1)*60;
        printLog(`task(${obj.id}) run more than max counts...`);
    }
    return poll_time;
}


module.exports ={
    runAction
}