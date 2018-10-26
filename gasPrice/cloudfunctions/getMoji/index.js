// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise');

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  // http://apifreelat.market.alicloudapi.com/whapi/json/aliweather/briefcondition
  return new Promise((resolve, reject) => {
    request({
      url: 'http://apifreelat.market.alicloudapi.com/whapi/json/aliweather/briefcondition',
        method: "POST",
        json: true,
        formData: event.data,
        headers: {
          'Host': 'freecityid.market.alicloudapi.com',
          'gateway_channel': 'http',
          'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
          'Authorization': 'APPCODE 8cf194b472bb43758532e1792e891fa8'
        },
        appcode: '312a0ea7c23b419e967bbf80f72cbc21'
      },
      function(error, response, body) {
        console.log(event)
        return resolve(body)

      }
    )
  })

}