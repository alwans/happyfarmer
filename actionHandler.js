const untils = require("./utils")
const { printLog, random } = require("./utils")

const longTimeEvent = ['youtubeEvent'];
const masterEvent=['gmailEvent','nwesEvent'];
const branchEvent=['translateEvent','searchEvent'];

const runAction = async function(obj){
    let runTime = untils.random(20,50);
    let poll_time = getPollTime(runTime);
    let events = pipeEvent(runTime);
    for(event of events){

    }
    // let type = untils.random(1,3);
    // switch(type){
    //     case type=1:{
    //         runGmailEvent(obj);
    //         break;
    //     }
    //     case type=2:{
    //         runYoutubeEvent(obj);
    //         break;
    //     }
    //     case type=3:{
    //         runNewsEvent(obj);
    //         break;
    //     }
    //     case type=4:{
    //         runTranslateEvent(obj);
    //         break;
    //     }
    //     case type=5:{
    //         runSearchEvent(obj);
    //         break;
    //     }
    // }
    return poll_time;
}

const pipeEvent = function(runTime){
    let preNum =0
    let events = [];
    let oriEvents = masterEvent.concat(branchEvent).concat(longTimeEvent);
    let isIncludeYoutube = false;
    for(let n in random(3,6)){
        let num = random(0,5);
        while(preNum==num){
            num = random(0,5);
        }
        preNum = num;
        if(oriEvents[num]=='youtubeEvent'){
            isIncludeYoutube = true;
        }
        events.push({eventName:oriEvents[num]});
    }
    if(runTime>=35 && !isIncludeYoutube){
        events.push({eventName:longTimeEvent[0]});
    }
    return setEventRunTime(events);
}
const setEventRunTime = function(events){
    // if
    return events;
}

const getPollTime = function(runTime){
    let hour = untils.currentTime().split(':')[0];
    let min = untils.currentTime().split(':')[1];
    let poll_time = 1000;
    if(hour<9){
        obj.taskCount=0; //reset every day run counts
        obj.sumCount=untils.random(100,150) //reset every day run max counts
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