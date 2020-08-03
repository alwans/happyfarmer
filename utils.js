
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

// console.log(random(3,6));


module.exports={
    currentTime,
    getUUID,
    printLog,
    random
}






