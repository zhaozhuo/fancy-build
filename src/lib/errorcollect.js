// js error
function collect(errorMessage, scriptURI, lineNumber, columnNumber) {
  const requestMessage = `${window.location.hash}|${errorMessage}|${scriptURI}|${lineNumber}|${columnNumber}|${navigator.userAgent}`
  new Image().src = `/error/?err=${encodeURIComponent(requestMessage)}`
}

module.exports = collect
