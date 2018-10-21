// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise');
const request = require('request');

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
    // http://apifreelat.market.alicloudapi.com/whapi/json/aliweather/briefcondition
    return new Promise((resolve,reject) =>{
        request(
            {
                url: 'http://apifreelat.market.alicloudapi.com/whapi/json/aliweather/briefcondition',
                method:"POST",
                json:true,
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(event),
                appcode:'312a0ea7c23b419e967bbf80f72cbc21'
            },
            function (error,response,body) {
                console.log(event)
                return resolve(body)
                
            }
        )
    })

}