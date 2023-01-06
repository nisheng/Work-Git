const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,//忽略https错误
    devtools: true,//不自动打开控制台（浏览器显示时有效）
    defaultViewport: {
        width: 0,
        height: 0
      },
    //   debuggingPort: 9999
  })
  const page = await browser.newPage(); // 创建一个新页面
  await page.goto('https://git.pm.bwoilmarine.com/MarineOnline_Frontend_Library/mol-homepage', {
    // timeout: 0
    waitUntil: 'networkidle2',
  }); // 新页面跳转到知道地址

//   await page.waitForSelector('#username');

//   const $username = await page.$('#username');
//   await $username.type('1111111', {
//     delay: 100
//   });
  
//   const $password = await page.$('#password');
//   await $password.type('testtest', {
//     delay: 100
//   });
  
//   const $button = await page.$('button[type="submit"]');
//   await $button.click();

// 作者：zxg_神说要有光
// 链接：https://juejin.cn/post/7182965703962542135
// 来源：稀土掘金
// 著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。




  await page.screenshot({ // 调用截图功能
    path: path.resolve(__dirname, 'assets', `${ Date.now() }.png`)
  })
  await page.pdf({
    path: path.resolve(__dirname, 'assets', `${ Date.now() }.pdf`)
  })
//   browser.close();
})()