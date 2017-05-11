//index.js
//获取应用实例
var util = require('../../utils/util.js')
var app = getApp()
Page({
  data: {
    openid:'',
    session_key:'',
    js_code:'',
    loginRes:'',
    userInfo: {},
    defaultSize: 'default',
    primarySize: 'default',
    warnSize: 'default',
    disabled: false,
    plain: false,
    loading: false,
    currentTime:'',
    startString:'',
    objectArray: [],
    historyData:{},
  },
  saveData:function () {
    var countStr = JSON.stringify(this.data.objectArray);
    var param = {
      openid:this.data.openid,
      session_key:this.data.session_key,
      encryptedData:this.data.loginRes.encryptedData,
      iv:this.data.loginRes.iv,
      nickName:this.data.userInfo.nickName,
      avatarUrl:this.data.userInfo.avatarUrl,
      countDate:this.data.currentTime.substr(0,10),
      startString:this.data.startString,
      countStr:countStr,
      totalCount:this.data.objectArray.length
    }
    var url = "https://api.dll0.com/api/taidong";
    var _this = this;
    util.ajaxRequest("POST", url, param, function (resp) {
      console.log(resp)
      if(_this.data.openid==''){
        _this.setData({
          openid:resp.data.openid,
          session_key:resp.data.session_key,
        })
      }
      _this.openAlert("保存成功！")
      // this.resetCount();
    },function (err) {
      _this.openAlert("保存失败！")
      console.log(err)
    })
  },
  getHistory:function(){
    wx.navigateTo({
      url: '../historyPage/historyPage?openid='+this.data.openid
    })
  },
  resetCount:function () {
    this.setData({
      startString: '',
      objectArray:[]
    })
  },
  startCount:function(){
    this.setData({
      startString: util.formatTime(new Date())
    })
  },
  count: function(e) {
    const length = this.data.objectArray.length+1
    if (length==1) {
      this.startCount()
    }
    this.data.objectArray = [
      {id: length, content: '第'+length+'次', datatime:util.formatTime(new Date())}
     ].concat(this.data.objectArray)
    this.setData({
      objectArray: this.data.objectArray
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  openAlert: function (contstr) {
      wx.showModal({
          content: contstr,
          showCancel: false,
          success: function (res) {
              if (res.confirm) {
                  console.log('用户点击确定')
              }
          }
      });
  },
  loadOpenId:function(js_code){
    wx.showToast({
      title: '加载中...',
      mask: true,
      icon:'loading'
    })
    var param = {
      js_code : js_code
    }
    var that = this;
    var url = "https://api.dll0.com/api/taidongLogin";
    util.ajaxRequest("POST", url, param, function (resp) {
      console.log(resp)
      wx.hideToast();
      if(that.data.openid==''){
        that.setData({
          openid:resp.message.openid,
          session_key:resp.message.session_key,
        })
      }
      console.log("保存成功！")
      // this.resetCount();
    },function (err) {
      wx.hideToast();
      wx.showToast({
        title: '网络接口错误，请检查网络正常后再试。',
        icon: 'success',
        duration: 2000
      })
      console.log("保存失败！")
      console.log(err)
    })
  },
  onShareAppMessage: function () {
    return {
      title: '胎动记录器',
      path: '/pages/index/index',
      success: function(res) {
        // 分享成功
        wx.showToast({
          title: '分享成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: function(res) {
        // 分享失败
      }
    }
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(res,js_code){
      //更新数据
      that.setData({
        userInfo:res.userInfo,
        loginRes:res,
        js_code:js_code
      })
      that.loadOpenId(js_code);
    })
    setInterval(function () {
      that.setData({
        currentTime : util.formatTime(new Date())
      })
    },1000);
  }
})
