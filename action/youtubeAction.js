const { printLog } = require("../utils");



const runYoutube = async function(obj,event){
    printLog(`task(${obj.id}) start run youtube task...,run time: ${event.times}`);
    printLog(`task(${obj.id}) run youtube task ..... end`);
}

module.exports={
    runYoutube
}