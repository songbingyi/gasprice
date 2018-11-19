//index.js
const app = getApp();
let QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
let qqmapsdk;

Page({
    data: {
        hiddenLocation: false, //是否获得经纬度
        week: "周三",
        formatTime: { //当前日期
            m: '',
            d: '',
            w: ''
        },
        latlon: {}, //当前经纬度 
        weekName: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'],
        currentCityInfo: {
            province: '定位中...',
            city: ''
        }, //如果没有地理位置 显示北京
        hasLocationInfo: false,
        loading: false,
        CurrentcityGasPriceInfo: {
            p92: '',
            p95: '',
            p98: '',
            p0: ''
        }

    },

    onLoad: function() {
        qqmapsdk = new QQMapWX({
            key: 'NUXBZ-EOOH4-CC3UB-XRTRO-ZYH46-URBRX'
        });
        this.formaTime() //获取当前日期
        wx.getLocation({
            success: (res) => {
                this.geTXLocation(res.latitude, res.longitude) //调用腾讯位置API
                // this.geTXLocation('40', '116') 

                this.setData({
                    latlon: {
                        lat: res.latitude,
                        lon: res.longitude,
                    },
                    hiddenLocation: false //获取到经纬度，隐藏提示
                })
                this.getWeatherInfo()
            },
            fail: (res) => { //如果获取经纬度失败，则显示中国北京,出现提示
                this.setData({
                    hiddenLocation: true,
                    currentCityInfo: {
                        province: '中国',
                        city: '北京'
                    },
                })
            }
        })

    },
    //用户设置允许授权地理位置后的回调
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
    },

    getGasPrice: function() {
        let OprovinceName = this.data.currentCityInfo.province.replace(/省/, "");
        let provinceName = OprovinceName.replace(/市/, "");
        wx.cloud.callFunction({

            name: 'getGasPrice',
            data: {
                prov: provinceName
            },
            success: res => {
                console.log('getGasPrice', res)
                this.setData({
                    CurrentcityGasPriceInfo: {
                        p92: res.result.p92,
                        p95: res.result.p95,
                        p98: res.result.p98,
                        p0: res.result.p0,
                    }
                })

            },
            fail: err => {
                console.error('[云函数] [getWeatherInfo] 调用失败', err)
            }
        })
    },
    getWeatherInfo: function() {
        wx.cloud.callFunction({
            name: 'getWeatherInfo',
            data: {
                formData: this.data.latlon
            },
            success: res => {
                // console.log(res)
            },
            fail: err => {
                console.error('[云函数] [getWeatherInfo] 调用失败', err)
            }
        })
    },
    geTXLocation: function(lat, lon) {
        var that = this;
        qqmapsdk.reverseGeocoder({
            location: {
                latitude: lat,
                longitude: lon
            },
            success: function(res) {
                console.log(res.result.address_component)
                that.setData({
                    currentCityInfo: { //当前城市省份信息
                        province: res.result.address_component.province,
                        city: res.result.address_component.city
                    },
                    hasLocationInfo: true
                })
                console.log(res);
            },
            fail: function(res) {
                console.log(res);
            },
        });
    }
})