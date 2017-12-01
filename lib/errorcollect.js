// js error
window.onerror = function _err(errorMessage, scriptURI, lineNumber, columnNumber) {
  const requestMessage = `101|${window.location.hash}|${errorMessage}|${scriptURI}|${lineNumber}|${columnNumber}|${navigator.userAgent}`
  new Image().src = `/error/?err=${encodeURIComponent(requestMessage)}`
}
