const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
  })
  const page = await browser.newPage(); // 创建一个新页面
  console.log(JSON.stringify(page), 66666)
//   await page.goto('https://juejin.cn'); // 新页面跳转到知道地址
  // await page.goto('http://192.168.204.113:3000', {
  //   waitUntil: 'networkidle2',
  // }); // 新页面跳转到知道地址

  await page.goto('https://www.marineonline.com/explore-marine-online/general?lang=en_US', {
    waitUntil: 'networkidle2',
  }); // 新页面跳转到知道地址

  await page.screenshot({ // 调用截图功能
    path: path.resolve(__dirname, 'assets', `${ Date.now() }.png`)
  })
  await page.pdf({
    path: path.resolve(__dirname, 'assets', `${ Date.now() }.pdf`)
  })
  browser.close();
})()