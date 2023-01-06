const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
// const pageUrl = 'https://www.marineonline.com/explore-marine-online/general?lang=en_US'
// const pageUrl = 'http://192.168.204.113:3000/explore-marine-online/general?lang=en_US'
// const pageUrl = 'http://localhost:3000/explore-marine-online/general?lang=en_US'
const pageUrl = 'https://www.marineonline.com/company-info/home/226753828781817870/MARINE%20ONLINE%20(SINGAPORE)%20PTE.%20LTD.'
;(async () => {
  const browser = await puppeteer.launch({
    // headless: 'chrome',
    // headless: true,
    headless: false,
    ignoreHTTPSErrors: true,//忽略https错误
    devtools: false,//不自动打开控制台（浏览器显示时有效）
  })
  const page = await browser.newPage(); // 创建一个新页面
  page.setUserAgent('Googlebot')
  await page.goto(pageUrl, {
    timeout: 0
  // waitUntil: 'networkidle2',
  }); 
  const bodyHandle = await page.$('html');
  const html = await page.evaluate(body => body.innerHTML, bodyHandle);
  fs.writeFile('test.html', html, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
  await bodyHandle.dispose();
  // browser.close();
})()