// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise');
cloud.init()

// 云函数入口函数

//默认经纬度城市:北京
let formData = {
  lat: '39.91488908',
  lon: '116.40387397'
};
let url = 'http://apifreelat.market.alicloudapi.com/whapi/json/aliweather/briefforecast3days';
const options = {
  method: 'POST',
  url: url,
  formData: formData,
  headers: {
    'Authorization': 'APPCODE 312a0ea7c23b419e967bbf80f72cbc21'
  }
}

cloud.init()

exports.main = async(event, context) => {
  // 如果不传值，默认北京
  console.log(event)
  if (event.formData) {
    formData = event.formData;
  }
  // url = event.url;
  const result = rp(options).then(function(body) {
    console.log(body)
    return body
  }).catch(function(err) {
    console.log(err)
    return err
  });
  return result

}