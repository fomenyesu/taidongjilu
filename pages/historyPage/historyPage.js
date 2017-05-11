// pages/history/history.js
var util = require('../../utils/util.js')
Page({
  data:{
    logs:[],
    historyData:[]
  },
  deleteById:function(e){
    // 页面初始化 options为页面跳转所带来的参数
    console.log(e);
    var dataset = e.target.dataset;
    var url = "https://api.dll0.com/api/taidong/"+dataset.id;
    var _this = this;
    wx.showModal({
      title: '提示',
      content: '确定删除记录？',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          util.ajaxRequest("DELETE", url, {}, function (resp) {
            console.log(resp)
            _this.data.historyData.splice(dataset.index,1);
            _this.setData({
              historyData : _this.data.historyData
            })
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 2000
            })
          },function (err) {
            console.log(err)
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  onLoad:function(options){
    console.log(options);
    // 页面初始化 options为页面跳转所带来的参数
    var param = {
      openId : options.openid
    }
    console.log(param);
    var url = "https://api.dll0.com/api/taidong";
    var _this = this;
    util.ajaxRequest("GET", url, param, function (resp) {
      console.log(resp)
        _this.setData({
          historyData:resp.data.record,
        })
    },function (err) {
      console.log(err)
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})