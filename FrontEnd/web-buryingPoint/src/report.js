/* eslint-disable*/
import routeChanged from 'route-changed'
import { getIpServer, postData, getReportDerail } from './service'
import getUserInfo from './Util'
import {
  generateDevicedId,
  generateBwoilPointSId,
} from "./generateInfo"

const MAX_CACHE_LENGTH = 6;
// const INTERVAL_TIME = .03 * 60 * 1000 
const INTERVAL_TIME = 10000

const _getTime = () => new Date().getTime()
let _this
class Report {
    #reportDerail = false
    #lastTagTimeStamp = null
    #sTime = null
    #intervalTimer = null
    #timeObj = {}
    #timerId = 1
    #tagKey = 1         // 公共属性tagKey, 为1需要携带新的公共可变属性，非1不携带
    #queue = []         // 上报队列
    #queneHandler = {  // 代理数组存在bug， set get方法会执行两次
        set: (target, property, value, receiver ) =>  {
            // 缓存数据
            localStorage.setItem('bTagData', JSON.stringify(target))
            if(target.length >= MAX_CACHE_LENGTH && _this.#tagKey !== 1){
                _this.initTagKey()
                // 上报
                _this.handleReport()
            }else{
                _this.#tagKey += 1
            }
            return Reflect.set(target,property,value,receiver)
        }
    }

    // 非可变公共属性
    #publicDetail = {
        country: null,
        city: null,
        ip: null,
        platform: 'web',
        operating_system: null,
        client_version: null,
        device_brand: null,
        device_model: null,
        imel: null,
        sdk_version: "1.0.0",
        user: getUserInfo,
        chan: null,
        extra: null,
    }
    #publicDetailHandler = {
        set(target, property, value, receiver ) {
          target[property] = value
          _this.#tagKey = 1 //修改公有不变数据，需要重新携带这部分数据，重置key为1
          return Reflect.set(target,property,value,receiver)
        }
    }

    //可变公共属性
    #dyPublicDetail = {
        // page: window.location.href,
        // page_title: document.title,
        // language: (navigator.language || navigator.browserLanguage).toLowerCase(),
        // session_id: generateBwoilPointSId,
        // 'time': _getTime(),
        // component: null,
        // pid: generateDevicedId,
        // pu_id: getUserInfo?.user_id,
        // version: "v_1",
        // element: "",
        // length_of_stay: "",
    }
    #dyPublicDetailHandler = {
        get(target, property, value, receiver ) {
            return {
                page: window.location.href,
                page_title: document.title,
                language: (navigator.language || navigator.browserLanguage).toLowerCase(),
                session_id: generateBwoilPointSId,
                'time': _getTime(),
                component: null,
                pid: generateDevicedId,
                pu_id: getUserInfo?.user_id,
                version: "v_1",
                element: "",
                length_of_stay: "",
            }
        }
    }
    

    constructor(module){
        console.log('成功载入埋点SDK, 加载业务模块:', module)
        _this = this
        this.module = module // 预留模块名  暂未用到
        window.queneProxy = this.queneProxy = new Proxy(this.#queue, this.#queneHandler) 
        window.publicDetailProxy = this.publicDetailProxy = new Proxy(this.#publicDetail, this.#publicDetailHandler) 
        window.dyPublicDetailProxy = this.dyPublicDetailProxy = new Proxy(this.#dyPublicDetail, this.#dyPublicDetailHandler) 
        this.init()
    }
    

    async init(){
        this.setIp()
        this.#reportDerail = await getReportDerail()
        const cacheData = this.getCacheData();
        if(!cacheData.length) {
            this.routerWatched()
            routeChanged(this.routerWatched)
            return
        }
        // this.#lastTagTimeStamp = cacheData?.slice()?.pop()?.['dyPublicDetail']?.time
        this.#lastTagTimeStamp = this.popParamFromCacheData('time', cacheData, 'dyPublicDetail')

        let currentTime = this.#sTime = _getTime()
        let timeDiff = currentTime - this.#lastTagTimeStamp
        console.log('SDK初始化&&取回缓存数据', this.queneProxy, this.publicDetailProxy, cacheData)

        // 区分刷新页面or页面停留、重新打开页面
        // 无缓存数据则不处理
        // 时差 > INTERVAL_TIME   则立即上报
        // if(!cacheData.length) return
        if( timeDiff >= INTERVAL_TIME ){
            console.log('取回数据立马上报')
            cacheData?.length > 0 && this.handleReport()
        }else {
            console.log('取回数据加入队列')
            // 加入待上报数据队列
            // this.queneProxy.push(this.assembleData([...cacheData]))
            this.queneProxy.push(...cacheData)
            this.#intervalTimer = this.interval(INTERVAL_TIME - timeDiff)
            // this.#intervalTimer = this.interval(1000)
        }
        this.routerWatched()
        routeChanged(this.routerWatched)
    }
   

    getCacheData = () => JSON.parse(localStorage.getItem('bTagData')) || []

    popParamFromCacheData = (param, data, pData) => data?.slice()?.pop()?.[pData]?.[param] || null

    initTagKey = () => {
        this.#tagKey = 1
    }

    routerWatched = (url) => {
        // 获取上一条数据的Url
        const refer_page = this.popParamFromCacheData('page',this.getCacheData(), 'dyPublicDetail')
        this.bTag({
            evtName: 'page_browser',
            evtInfo: {
                refer_page,
                is_newly_open: refer_page ? true : false  
            }
        })
    }

    async setIp(){
        if(!this.publicDetailProxy.ip){
            this.publicDetailProxy.ip = await getIpServer()
        }
        
    }

    timeout(time, cb){
        let timer = setTimeout(()=>{
            // 上报
            this.handleReport()
            cb && cb()
            this.timeout(INTERVAL_TIME, clearTimeout(timer))
        }, time)
    }

    interval = (time) => {
        // if(this.#intervalTimer){
        //     return
        // }
        let timeId = this.#timerId 
        this.#timerId ++
        const timeout = async () => {
            // timeId = this.#timerId
            console.log(this.#timeObj[timeId], '------', '开始任务')
            this.handleReport()
            // this.#timerId ++
            this.#timeObj[timeId] = setTimeout(timeout, INTERVAL_TIME)
        }
        this.#timeObj[timeId] = setTimeout(timeout, time)
        return timeId
    }

    clearTimer(){
        console.log(this.#timeObj, '定时器对象', this.#intervalTimer)
        clearTimeout(this.#timeObj[this.#intervalTimer])
        delete this.#timeObj[this.#intervalTimer]
        this.#intervalTimer = null
    }

    getDyPublicDetail(){
        //可变公共属性
        return {
            page: window.location.href,
            page_title: document.title,
            language: (navigator.language || navigator.browserLanguage).toLowerCase(),
            session_id: generateBwoilPointSId,
            'time': _getTime(),
            component: null,
            pid: generateDevicedId,
            pu_id: getUserInfo?.user_id,
            version: "v_1",
            element: "",
            length_of_stay: "",
        }
    }

    //  组装数据
    assembleData(params){
        let _data
        if( this.#tagKey === 1){
            _data = {
                publicDetail: this.publicDetailProxy,
                // dyPublicDetail: this.getDyPublicDetail(),
                dyPublicDetail: this.dyPublicDetailProxy.getinfo,
                privateDetail: params,
            }
        }else if(this.#tagKey !== 1){
            _data = {
                // publicDetail: this.publicDetailProxy,
                dyPublicDetail: this.dyPublicDetailProxy.getinfo,
                privateDetail: params,
            }
        }
        return _data
    }

    // 直接上报数据
    handleReport = async (type, params) => {
        let _reportData = null
        if(type === 'immediately'){ // 立即上报
            _reportData = [this.assembleData(params)]
        }else{ // 加入队列 || 取回缓存上报
            _reportData = this.queneProxy
        }
        _reportData.length && postData(_reportData)
        .finally(()=>{
            if(type === 'immediately') return
            this.handlerResetQuene()
            this.clearTimer()
            console.log('上报完成，清空数据,清空定时器')
        })
    }

    // 打点
    bTag = (data, type) => {
        if(!this.#reportDerail) return
        if( type === 'immediately' ){
          // 立即上报(执行一次上报事件，不处理待上报数据, 不打断原有流程)   拿到私有数据，组装上报
          this.handleReport('immediately',data)
        }else { 
          // 加入待上报数据队列   拿到私有数据，组装加入待上报队列
          // 限制只有一个开启中的定时器
          this.queneProxy.push(this.assembleData(data))
          if(!this.#intervalTimer) this.#intervalTimer = this.interval(INTERVAL_TIME)
          //   localStorage.setItem('bTagData', JSON.stringify(this.queneProxy))
        }
    }

      // 清空数据
    handlerResetQuene(){
    this.queneProxy.length = 0
    localStorage.removeItem('bTagData')
    }
}

export default Report