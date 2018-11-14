//index.js
const app = getApp()

Page({
  data: {
    hasLocation:true, //是否获得经纬度
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    week: "周三"
  },

  onLoad: function() {
    wx.getLocation({
      success: function(res) {
          
      },
      fail:function(res){
        this.setData({
            hasLocation:false
        })
      }
    })
      wx.cloud.callFunction({
          name: 'getCity',
          data: {
            url:'http://apifreelat.market.alicloudapi.com/whapi/json/aliweather/briefforecast3days',
            formData:{
              lat: "108",
              lon: "116"
            },
            userInfo: {
              "appId": "wxc3f44eb0460fbdfe",
              "openId": "oaoLb4qz0R8STBj6ipGlHkfNCO2Q"
            }
              },
          success: res => {
              console.log(res)
          },
          fail: err => {
              console.error('[云函数] [login] 调用失败', err)
          }
      })
  },
    handle:function(e){
        console.log(e)
    },
})