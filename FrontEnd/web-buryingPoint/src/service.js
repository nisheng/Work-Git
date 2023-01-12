/* eslint-disable*/

import axios from "axios";

const postUrl =  process.env.NODE_ENV === 'development' ? '//bigdata.dev.emarineonline.com/api/bgDataAnalytics/report/reportDataV2 ' : '//dapi.marineonline.com/api/bgDataAnalytics/report/reportDataV2'
const reportDerailUrl = '/api/basic-service/config/client/queryConfigContent/EVENT_TRACKING_CONTROL'

export const getIpServer = async () => {
  let resp = await axios.get('https://api64.ipify.org/?format=json', {})
  return new Promise((resolve, reject)=>{
    if (resp?.status === 200) {
      resolve(resp?.data?.ip)
    }else{
      console.log(resp, '三方接口ip获取出错')
      resolve(null)
    }
  })
 }


export const postData = async (params) => {
  console.log('上报数据=>：', params)
  let resp = await axios.post(postUrl, params)
  return new Promise((resolve, reject)=>{
    if (resp?.status === 200 && resp?.data?.status === "S") {
      console.log('上报成功',resp)
      resolve(resp?.data?.status)
    }else{
      console.log('上报失败', resp)
      reject(resp?.data?.msg)
    }
  })
 }


 export const getReportDerail = async () => {
  let resp = await axios.get(reportDerailUrl)
  return new Promise((resolve, reject)=>{
    if (resp?.status === 200 && resp?.data?.status === "S") {
      resolve(resp?.data?.data?.configContent === 'on' ? true : false)
    }else{
      resolve(false)
    }
  })
 } 