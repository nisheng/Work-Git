/* eslint-disable*/

import { v4 as uuidv4 } from "uuid";

const _uuid = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'

const generateDevicedId = ((_uuid) => {
  let deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    deviceId = _uuid;
    localStorage.setItem("deviceId", deviceId);
  }
  if(window._globalDeviceId){
    window._globalDeviceId = {
      deviceId,
    };
  }
  return deviceId
})(_uuid); 

const generateBwoilPointSId = ((_uuid) => {
  let bwoilPointSId = sessionStorage.getItem("bwoilPointSId");
  if (!bwoilPointSId) {
    bwoilPointSId = _uuid;
    sessionStorage.setItem("bwoilPointSId", bwoilPointSId);
  }
  window._globalBwoilPointSId = {
    bwoilPointSId,
  };
  return bwoilPointSId
})(_uuid);

export {
  generateDevicedId,
  generateBwoilPointSId,
};
