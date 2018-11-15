// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise');
cloud.init()

// 云函数入口函数
cloud.init()

exports.main = async (event, context) => {
    let options = {
        method: 'GET',
        url: 'http://ali-todayoil.showapi.com/todayoil',
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