// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise');
cloud.init()

// 云函数入口函数
cloud.init()

exports.main = async (event, context) => {
    if (event.formData) {
        formData = event.formData;
    } else {
        formData = {
            lat: '39.91488908',
            lon: '116.40387397'
        }
    };
    let options = {
        method: 'POST',
        url: event.url,
        formData: formData,
        headers: {
            'Authorization': 'APPCODE 312a0ea7c23b419e967bbf80f72cbc21'
        }
    }
    const result = rp(options).then(function (body) {
        return body

    }).catch(function (err) {
        console.log(err)
        return err
    });
    return result

}