// js error
window.onerror = function (errorMessage, scriptURI, lineNumber, columnNumber, errorObj) {
  var requestMessage = 101 + '|' + location.hash + '|' + errorMessage + '|' + scriptURI + '|' + lineNumber + '|' + columnNumber + '|' + navigator.userAgent;
  new Image().src = "//error/?err=" + encodeURIComponent(requestMessage);
}
