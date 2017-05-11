function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//发起ajax请求
function ajaxRequest(meth, url, req, cbOk, cbErr) {
  console.debug(url,req);
  wx.request({
      url : url,
      data : req,
      dataType : 'json',
      method : meth,
      header: {
          'Content-Type': 'application/json'
      },
      success : function(res){
          if (cbOk) cbOk(res.data);
      },
      fail : function(res){
          setTimeout(function(){
              var errInfo = "请求服务器失败,请检查你的网络是否正常";
              var error = tool.getReturnError(errInfo, -2);
              //if (!isLongPolling && cbErr) cbErr(error);
              if (cbErr) cbErr(error);
          },16);
      }
  });
}
module.exports = {
  formatTime: formatTime,
  ajaxRequest: ajaxRequest
}
