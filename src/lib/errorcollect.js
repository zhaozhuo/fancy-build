

window.mi_log_wt = +new Date - mi_log_st;
window.onerror = function(errorMessage, scriptURI, lineNumber,columnNumber,errorObj) {

  var requestMessage = 101 + '|' + location.hash + '|' + errorMessage + '|' + scriptURI + '|' + lineNumber + '|' + columnNumber + '|' + navigator.userAgent;
  new Image().src="//a.stat.xiaomi.com/js/pprof.js?err=" + encodeURIComponent(requestMessage);
}
