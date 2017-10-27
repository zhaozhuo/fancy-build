const Store  = window.localStorage || null

function getItem(key) {
  try {
    return JSON.parse(Store.getItem(PREFIX + key))
  } catch (e) {}
  return false
}

function setItem(key, value) {
  try {
    return Store.setItem(PREFIX + key, JSON.stringify(value))
  } catch (e) {}
}

function removeItem(key) {
  try {
    return Store.removeItem(PREFIX + key)
  } catch (e) {}
}

function clear() {
  try {
    return Store.clear()
  } catch (e) {}
}

module.exports = {
  clear: clear,
  getItem: getItem,
  setItem: setItem,
  removeItem: removeItem,
}
