
const UUID = require('uuid');
const log4js = require('log4js');

log4js.configure({
    appenders: {
      console:{ type: 'console' },
      cheeseLogs:{ type: 'file', filename: './log.log', categories:'' }
    },
       categories: {
          default: {appenders: ['console','cheeseLogs'], level: 'info'}
      }
  });
var logger = log4js.getLogger('console');

/**
 * get current time
 * return time:hh:mm:ss (24h)
 */
const currentTime = function(){
    let time= new Date().toLocaleTimeString();
    return time;
}

const getUUID = function(){
    return UUID.v1();
}

const printLog = function(content){
    logger.info('[farmer log] '+content);
}

const random = function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

const i_wait = async function(timeInt){
	return new Promise((resolve,reject) =>{
		setTimeout(function(){
			let n = null;
			resolve();
		},timeInt);
	});
}

/**
 * 
 * @param {*} num 
 */
const rateRun = function(num){
    switch(random(0,num)){
        case 0:{
            return true;
        }
        default:{
            return false;
        }
    }
}

/**
 * 
 * @param {int} num 
 * @param {*} minTime /s
 * @param {*} maxTime /s
 */
const stayForTime = async function (rateNum,minTime,maxTime){
    if(rateRun(rateNum)){
        let t = random(minTime*1000,maxTime*1000);
        await i_wait(t);
    }
}

const durationTime = function(startTime,times){
    let endTime = Date.now();
    let interval = (endTime - startTime)/1000/60;
    return times>interval ? true: false;
}

/**
 * if timeout return -1
 * @param {*} promise 
 * @param {*} delay 
 */
const promiseTimeout = async function (promise, delay){
    let timeout = new Promise(function(reslove, reject){
        setTimeout(function(){
            reslove(-1)
        }, delay)
    })
    return Promise.race([timeout, promise])
}

/**
 * only use for playwright 
 * @param {} proxy 
 */
const formatProxy = function(proxy){
    let proxy_obj = null;
    if(proxy.split(':').length>2){
        let p = proxy.split(':');
        proxy_obj = {
            server: p[0].indexOf('http')>-1 ? `${p[0]}:${p[1]}`:`http://${p[0]}:${p[1]}`,
            username: p[2],
            password: p[3]
        }
    }else{
        proxy_obj = {
            server:proxy.indexOf('http')>-1 ? proxy:`http://${proxy}`
        }
    }
    return proxy_obj;
}

// console.log(random(3,6));


module.exports={
    currentTime,
    getUUID,
    printLog,
    random,
    i_wait,
    durationTime,
    stayForTime,
    rateRun,
    promiseTimeout,
    formatProxy

}






