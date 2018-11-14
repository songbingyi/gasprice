//index.js
const app = getApp()

Page({
    data: {
        hiddenLocation: false, //是否获得经纬度
        requestResult: '',
        week: "周三",
        region: ['中国', '北京市', ''], //位置信息初始值
        formatTime: { //当前日期
            m: '',
            d: '',
            w: ''
        },
        weekName: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天']
    },

    onLoad: function() {
        this.formaTime() //获取当前日期
        wx.getLocation({
            success: (res) => {
                this.setData({
                    hiddenLocation: false
                })
            },
            fail: (res) => {
                this.setData({
                    hiddenLocation: true
                })
            }
        })
        wx.cloud.callFunction({
            name: 'getWeatherInfo',
            data: {
                url: 'http://apifreelat.market.alicloudapi.com/whapi/json/aliweather/briefforecast3days',
                formData: {
                    lat: "39",
                    lon: "116"
                },
            },
            success: res => {
                console.log(res)
            },
            fail: err => {
                console.error('[云函数] [login] 调用失败', err)
            }
        })
    },
    //设置允许授权地理位置后的回调
    handle: function(e) {
        if (e.detail.authSetting["scope.userLocation"]) {
            this.setData({
                hiddenLocation: false
            })
        } else {
            this.setData({
                hiddenLocation: true
            })
        }
    },
    bindRegionChange: function(e) {
        console.log(e)
    },
    //获取当前日期
    formaTime: function() {
        let nowDate = new Date();
        this.setData({
            formatTime: {
                m: nowDate.getMonth() + 1,
                d: nowDate.getDate(),
                w: this.data.weekName[nowDate.getDay() - 1]
            }
        })
    }
})