// 链接：https://juejin.cn/post/7182965703962542135
// 链接: https://zhuanlan.zhihu.com/p/76237595

// 模拟操作
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const targetUrl = "http://1.1.1.2/ac_portal/default/pc.html?tabs=pwd"
;(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 30,    //放慢速度
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
    await page.goto(targetUrl, {
        timeout: 0
        // waitUntil: 'networkidle2',
    });
    await page.waitForSelector('#password_name');

    // 登录
    const eleName = await page.$('#password_name')
    const elePwd = await page.$('#password_pwd')
    const eleRemember = await page.$('#rememberPwd')
    const eleSubmit = await page.$('#password_submitBtn')

    await Promise.all([
        await eleName.type('nisheng', { delay: 0 }),
        await elePwd.type('pass123!', { delay: 0 }),
        await eleRemember.click(),
        await eleSubmit.click(),
        await page.waitForNavigation(),
    ]);
    await page.close();
    await browser.close();
})()