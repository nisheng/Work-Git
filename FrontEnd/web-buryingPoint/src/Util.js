/*
 * @Author: nisheng nisheng@bwoil.com
 * @Date: 2022-09-15 18:32:34
 * @LastEditors: nisheng nisheng@bwoil.com
 * @LastEditTime: 2022-09-17 18:40:33
 * @FilePath: /web-buryingPoint/src/Util.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/* eslint-disable*/
const getUserInfo = (() => {
  const {
    userId: user_id,
    userName: user_name,
    companyName: user_company,
    userEmail: user_email,
    chan_scene,
    chan_id,
    component_id,
    component_name,
    component_index,
  } = JSON.parse(localStorage.getItem('MOL//user.basic.details')) || {}
  const _info = {
    user_id,
    user_name,
    user_company,
    user_email,
    chan_scene,
    chan_id,
    component_id,
    component_name,
    component_index,
  }
  return _info
})()

export default getUserInfo
