const {launchBrowser} = require('./launchBrowser');
const {runAction} = require('./actionHandler');
const { printLog } = require('./untils');

const tasks = [];


const start = async function(){
    let infos = [];
    let info = {
        userDataDir:'',
        proxy:''
    }
    let info2 = {
        userDataDir:'',
        proxy:''
    }
    infos.push(info);
    infos.push(info2);
    await init(infos);
    tasks.map((obj) =>{
        intervalTask(obj,1000);
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