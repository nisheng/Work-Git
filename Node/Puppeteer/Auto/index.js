// 链接：https://juejin.cn/post/7182965703962542135
// 链接: https://zhuanlan.zhihu.com/p/76237595

// 模拟操作
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        // slowMo: 100,    //放慢速度
        ignoreHTTPSErrors: true,//忽略https错误
        devtools: false,//不自动打开控制台（浏览器显示时有效）
        defaultViewport: {
            width: 1200,
            height: 800
        },
        // args: ['--start-fullscreen'] //全屏打开页面
        //   debuggingPort: 9999
    })
    //设置可视区域大小
    const page = await browser.newPage(); // 创建一个新页面
    await page.setViewport({ width: 1920, height: 800 });
    await page.goto('https://git.pm.bwoilmarine.com/MarineOnline_Frontend_Library/mol-homepage', {
        timeout: 0
        // waitUntil: 'networkidle2',
    });

    await page.waitForSelector('#user_name');

    // 登录
    const eleName = await page.$('#user_name')
    const elePwd = await page.$('#password')
    const eleCheck = await page.$('.checkbox')
    const eleSubmit = await page.$('.button')

    await eleName.type('nisheng@bwoil.com', { delay: 0 });
    await elePwd.type('nisheng', { delay: 0 });

    await Promise.all([
        eleCheck.click(),
        eleSubmit.click(),
        page.waitForNavigation()
    ]);

    // 发起合并请求
    const eleMergeLink = await page.$('.octicon-git-pull-request')
    console.log(eleMergeLink, '啊啊啊')
    eleMergeLink.click()

    // // 创建合并请求
    // const eleGenerateMerge = await page.$('.ui.green.button')
    // console.log(eleGenerateMerge, '2222')


    // fs.rm(path.resolve(__dirname, 'assets'), {recursive: true} , (err)=>{
    //     console.log(err,'rmdir Error')
    // })
    
    fs.mkdir('assets',()=>{})
    
    await page.screenshot({ // 调用截图功能
        path: path.resolve(__dirname, 'assets', `${Date.now()}.png`),
        // type: 'png',
        fullPage: true, //边滚动边截图
    })

    await page.pdf({
        path: path.resolve(__dirname, 'assets', `${Date.now()}.pdf`)
    })
    // await page.close();
    // await browser.close();
})()