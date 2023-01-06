const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
(async () => {
  const browser = await puppeteer.launch({
    headless: 'chrome',
    // headless: true,
  })
  const page = await browser.newPage(); // 创建一个新页面
  // page.setUserAgent('Googlebot')
await page.goto('http://localhost:3000/chartering/vessel-finder', {
  // await page.goto('http://localhost:3000/marine-supply/my-order', {
    timeout: 0
  // waitUntil: 'networkidle2',
  }); // 新页面跳转到知道地址
  await page.screenshot({ // 调用截图功能
    path: path.resolve(__dirname, 'assets3', `${ Date.now() }.png`)
  })
  const bodyHandle = await page.$('html');
  const html = await page.evaluate(body => body.innerHTML, bodyHandle);
  fs.writeFile('text2.html', html, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
  await bodyHandle.dispose();
//   const dimensions = await page.evaluate((res) => {
//     return {
//         text: document.documentElement.outerHTML
//     };
//   });

  // console.log('Dimensions:', JSON.stringify(dimensions));

  browser.close();
})()