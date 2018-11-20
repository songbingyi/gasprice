// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise');
cloud.init()

// 云函数入口函数
cloud.init()

exports.main = async (event, context) => {
    // if (event.formData) {
    //   let  formData = event.formData;
    // } else {
    //   let  formData = {
    //         lat: '39.91488908',
    //         lon: '116.40387397'
    //     }
    // };
    let options = {
        method: 'POST',
        url: 'http://apifreelat.market.alicloudapi.com/whapi/json/aliweather/briefcondition',
        formData: event.formData,
        headers: {
            'Authorization': 'APPCODE 312a0ea7c23b419e967bbf80f72cbc21'
        }
    }
    const result = rp(options).then(function (body) {
        let obody = JSON.parse(body);
        return obody.data.condition

    }).catch(function (err) {
        console.log(err)
        return err
    });
    return result

}