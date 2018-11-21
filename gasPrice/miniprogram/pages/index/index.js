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
    },
    todayWeatherInfo: {
      condition: '...',
      temp: '...',
      icon: ''
    },
    weatherIcontoday: '',
    weatherTomorrowInfo: {},
    weatherIcontoTomorrow: '',
    priceChangeText:''

  },

  onLoad: function() {
    qqmapsdk = new QQMapWX({
      key: 'NUXBZ-EOOH4-CC3UB-XRTRO-ZYH46-URBRX'
    });
    this.formaTime() //获取当前日期
    this.getlonlat() //获取当前经纬度

    const db = wx.cloud.database()
    let that = this;
    db.collection('priceNextChange').doc('W_U4VifIZl09sRwE').get({
      success: function(res) {
        console.log('db',res.data)
        that.setData({
          priceChangeText:res.data.text
        })
      },
      fali: function(res) {
        console.log(res.data)
      }
    })


  },
  //用户设置允许授权地理位置后的回调
  handle: function(e) {
    if (e.detail.authSetting["scope.userLocation"]) {
      this.setData({
        hiddenLocation: false
      })
      qqmapsdk = new QQMapWX({
        key: 'NUXBZ-EOOH4-CC3UB-XRTRO-ZYH46-URBRX'
      });
      this.getlonlat() //获取当前经纬度

    } else {
      this.setData({
        hiddenLocation: true
      })
    }
  },
  /**@name选择城市后的回调 */
  bindRegionChange: function(e) {
    console.log(e)
    let OprovinceName = e.detail.value[0].replace(/省/, "");
    let provinceName = OprovinceName.replace(/市/, "");
    this.getGasPrice(provinceName)
    this.setData({
      currentCityInfo: {
        province: e.detail.value[0],
        city: e.detail.value[1]
      },
    })

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
  //获取当前城市油价
  getGasPrice: function(provinceName) {
    wx.showLoading({
      title: '更新数据中',
    })
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
        wx.hideLoading()
      },
      fail: err => {
        console.error('[云函数] [getWeatherInfo] 调用失败', err)
        wx.hideLoading()
      }
    })
  },
  //获取明天天气
  getWeatherInfo: function() {
    wx.cloud.callFunction({
      name: 'getWeatherInfo',
      data: {
        formData: this.data.latlon
      },
      success: res => {
        this.setData({
          weatherTomorrowInfo: res.result,
          weatherIcontoTomorrow: '../../images/icon/W' + res.result.conditionId_day + '.png'
        })
        console.log('getWeatherInfo', res.result)
      },
      fail: err => {
        console.error('[云函数] [getWeatherInfo] 调用失败', err)
      }
    })
  },
  /**@name 根据经纬度获取城市名字 */
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
        let OprovinceName = res.result.address_component.province.replace(/省/, "");
        let provinceName = OprovinceName.replace(/市/, "");
        that.getGasPrice(provinceName)
        // console.log(res);
      },
      fail: function(res) {
        console.log(res);
      },
    });
  },
  /**@name 获取城市经纬度 */
  getlonlat: function() {
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
        this.getCurrentWeather()
      },
      fail: (res) => { //如果获取经纬度失败，则显示中国北京,出现提示
        this.setData({
          hiddenLocation: true,
          currentCityInfo: {
            province: '中国',
            city: '北京'
          },
        })
        this.getGasPrice('北京')
      }
    })
  },
  //获取当前天气
  getCurrentWeather: function() {
    wx.cloud.callFunction({
      name: 'getCurrentWeather',
      data: {
        formData: this.data.latlon
      },
      success: res => {
        console.log('getCurrentWeather', res)
        this.setData({
          todayWeatherInfo: res.result,
          weatherIcontoday: '../../images/icon/W' + res.result.icon + '.png'
        })
        wx.hideLoading()
      },
      fail: err => {
        console.error('[云函数] [getWeatherInfo] 调用失败', err)
        wx.hideLoading()
      }
    })
  }
})