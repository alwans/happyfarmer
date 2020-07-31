const puppeteer = require('puppeteer');
const { getUUID, random } = require('./untils');


const browser_param_init = function(proxy){
    let p =  proxy.split(':');
    let params=[
            '--disable-dev-shm-usage',         // 创建临时文件共享内存
            '--disable-accelerated-2d-canvas', // canvas渲染
            '--disable-gpu',                   // GPU硬件加速
            '--proxy-server=http://'+p[0]+':'+p[1]
        ];
    return params;
}

const launchBrowser = async function(info){
    let browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome',
        userDataDir:info.userDataDir||'',
        defaultViewport:null,
        handleSIGINT:true,//是否可以使用 CTRL+C 关闭并退出浏览器
        timeout:0,//等待 Chrome 实例启动的最长时间。默认为30000（30秒）。如果传入 0 的话则不限制时间
        headless: false,
        ignoreDefaultArgs: ["--enable-automation"],
        args: info.proxy==''? []: browser_param_init(info.proxy)
    });
    const pages = await browser.pages();
    const page = pages[0];
    if(info.proxy!=''){
        let p = info.proxy.split(':');
        await page.authenticate({
            username: p[1],
            password: p[2],
        });
    }
    return {
        id:getUUID(),
        browser:browser,
        page:page,
        taskCount:0,//every data task run count
        sumCount:random(100,150)
    }
}

module.exports = {
    launchBrowser
}