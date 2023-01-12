###

    *  数据结构: 共有属性(publicDetail,固定|dyPublicDetail,可变)，私有属性:privateDetail
    *  只有第一次上报 或者 固定公有属性发生变化时才上传publicDetail数据
    *  使用方式
       *  构建后生成btag.js会将Report挂载到window上
       *  const report = new Report('Crewing')
       *  report.bTag(data? data1: data2, type)

```javascript
  [
    {
        "publicDetail"： {
        	"country": null,
      		"city": null,
      		"ip": null,
        },
        "dyPublicDetail": {
        
        },
        "privateDetail": {
        
        }
    },
    ...
  ]
```

---
流程:

初始化数据： sessionId, devicedId，

1.获取IP地址，解析国家，城市

2.生成sessionId,devicedId

3.获取User信息

4.获取url， title

5.Pid 与 deviceId共用


已实现功能：
  * 监听属性(见assembleData)
  * 监听PV
  * 事件上报
  * 实时上报， 定时上报， 数据累积上报