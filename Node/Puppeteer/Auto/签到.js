const { createCanvas, loadImage } = require('./Tools/Node-canvas/lib/index')
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const targetUrl = "https://juejin.cn/user/center/signin?from=gold_browser_extension"


/**
 * combine rgba colors [r, g, b, a]
 * @param rgba1 底色
 * @param rgba2 遮罩色
 * @returns {number[]}
 */
function combineRgba(rgba1, rgba2) {
    const [r1, g1, b1, a1] = rgba1
    const [r2, g2, b2, a2] = rgba2
    const a = a1 + a2 - a1 * a2
    const r = (r1 * a1 + r2 * a2 - r1 * a1 * a2) / a
    const g = (g1 * a1 + g2 * a2 - g1 * a1 * a2) / a
    const b = (b1 * a1 + b2 * a2 - b1 * a1 * a2) / a
    return [r, g, b, a]
}

/**
 * 判断两个颜色是否相似
 * @param rgba1
 * @param rgba2
 * @param t
 * @returns {boolean}
 */
function tolerance(rgba1, rgba2) {
    const [r1, g1, b1] = rgba1
    const [r2, g2, b2] = rgba2
    return (
        r1 > r2 - t && r1 < r2 + t
        && g1 > g2 - t && g1 < g2 + t
        && b1 > b2 - t && b1 < b2 + t
    )
}


function getVerifyPosition(base64, actualWidth) {
    return new Promise((resolve, reject) => {
        const canvas = createCanvas(1000, 1000)
        const ctx = canvas.getContext('2d')
        const img = new Image()
        img.onload = () => {
            const width = img.naturalWidth
            const height = img.naturalHeight
            ctx.drawImage(img, 0, 0)
            const maskRgba = [0, 0, 0, 0.65]
            const t = 10 // 色差容忍值
            let prevPixelRgba = null
            for (let x = 0; x < width; x++) {
                // 重新开始一列，清除上个像素的色值
                prevPixelRgba = null
                for (let y = 0; y < height; y++) {
                    const rgba = ctx.getImageData(x, y, 1, 1).data
                    if (prevPixelRgba) {
                        // 所有原图中的 alpha 通道值都是1
                        prevPixelRgba[3] = 1
                        const maskedPrevPixel = combineRgba(prevPixelRgba, maskRgba)
                        // 只要找到了一个色值匹配的像素点则直接返回，因为是自上而下，自左往右的查找，第一个像素点已经满足"最近"的条件
                        if (tolerance(maskedPrevPixel, rgba, t)) {
                            resolve(x * actualWidth / width)
                            return
                        }
                    } else {
                        prevPixelRgba = rgba
                    }
                }
            }
            // 没有找到任何符合条件的像素点
            resolve(0)
        }
        img.onerror = reject
        img.src = base64
    })
}





; (async () => {
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 30,    //放慢速度
        ignoreHTTPSErrors: true,//忽略https错误
        devtools: true,//不自动打开控制台（浏览器显示时有效）
        defaultViewport: {
            width: 1600,
            height: 800
        },
        // args: ['--start-fullscreen'] //全屏打开页面
        //   debuggingPort: 9999
    })
    //设置可视区域大小
    const page = await browser.newPage(); // 创建一个新页面
    // await page.setViewport({ width: 1920, height: 800 });
    await page.goto(targetUrl, {
        timeout: 0
        // waitUntil: 'networkidle2',
    });

    // 登录
    await page.waitForSelector('.login-button');
    const eleLoginBtn = await page.$('.login-button')
    await eleLoginBtn.click()

    // 切换方式
    await page.waitForSelector('.clickable');
    const eleSwitchType = await page.$('.clickable')
    await eleSwitchType.click()

    await page.waitForSelector('input[name="loginPhoneOrEmail"]');
    const eleName = await page.$('input[name="loginPhoneOrEmail"]')
    const elePwd = await page.$('input[name="loginPassword"]')
    const eleSubmit = await page.$('.panel .btn')

    await Promise.all([
        await eleName.type('442996276@qq.com', { delay: 0 }),
        await elePwd.type('huse.123', { delay: 0 }),
        await eleSubmit.click(),
        // await page.waitForNavigation(),
    ]);

    console.log(1111111111)
    // return
    // 机器滑块验证
    await page.waitForSelector('#captcha-verify-image')
    // const dragBtn = await page.$('.secsdk-captcha-drag-icon')

    // 验证码图片（带缺口）
    const img = await page.$('#captcha-verify-image')


    console.log(img, '7888888')
    // 获取缺口左x坐标
    const distance = await getVerifyPosition(
        await page.evaluate(element => element.getAttribute('src'), img),
        await page.evaluate(element => parseInt(window.getComputedStyle(element).width), img)
    )
    // 滑块
    const dragBtn = await page.$('.captcha_verify_img_sliden')
    const dragBtnPosition = await page.evaluate(element => {
        // 此处有 bug，无法直接返回 getBoundingClientRect()
        const { x, y, width, height } = element.getBoundingClientRect()
        return { x, y, width, height }
    }, dragBtn)
    // 按下位置设置在滑块中心
    const x = dragBtnPosition.x + dragBtnPosition.width / 2
    const y = dragBtnPosition.y + dragBtnPosition.height / 2

    if (distance > 10) {
        // 如果距离够长，则将距离设置为二段（模拟人工操作）
        const distance1 = distance - 10
        const distance2 = 10
        await page.mouse.move(x, y)
        await page.mouse.down()
        // 第一次滑动
        await page.mouse.move(x + distance1, y, { steps: 30 })
        await page.waitFor(500)
        // 第二次滑动
        await page.mouse.move(x + distance1 + distance2, y, { steps: 20 })
        await page.waitFor(500)
        await page.mouse.up()
    } else {
        // 否则直接滑到相应位置
        await page.mouse.move(x, y)
        await page.mouse.down()
        await page.mouse.move(x + distance, y, { steps: 30 })
        await page.mouse.up()
    }
    // 等待验证结果
    await page.waitFor(3000)


    // 签到
    const eleClockIn = await page.$('.code-calender')
    await eleClockIn.click()
    fs.mkdir('assets', () => { })
    await page.screenshot({ // 调用截图功能
        path: path.resolve(__dirname, 'assets', `${Date.now()}签到结果.png`),
        // type: 'png',
        fullPage: true, //边滚动边截图
    })
    await page.close();
    await browser.close();
})()


