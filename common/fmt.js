
const fmt = {
  mobile(str) {
    return str.replace(/(\d{3})(\d{6})(\d{2})/, '$1******$3')
  },
  email(str) {
    return str.replace(/(.{0,2})(.+)(@.+)/g, '$1****$3')
  },
  datetime(time = '', hms = true, sep = '--') {
    let date = time ? new Date(time) : new Date()
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    let d = date.getDate()
    let h = date.getHours()
    let i = date.getMinutes()
    let s = date.getSeconds()

    m = (m < 10 ? '0' : '') + m
    d = (d < 10 ? '0' : '') + d
    h = (h < 10 ? '0' : '') + h
    i = (i < 10 ? '0' : '') + i
    s = (s < 10 ? '0' : '') + s
    let a = sep.split('')
    let nyr = y + a[0] + m + (a[1] || a[0]) + d + (a[2] || '')
    return nyr + (hms ? (' ' + [h, i, s].slice(0, hms === true ? 3 : hms).join(':')) : '')
  },
  dateYm(date) {
    let v = date ? new Date(date) : new Date()
    let m = v.getMonth() + 1
    return String(v.getFullYear()).slice(2) + (m < 10 ? '0' : '') + m
  },
  dateHis(date) {
    let v = date ? new Date(date) : new Date()
    let h = v.getHours()
    let i = v.getMinutes()
    let s = v.getSeconds()
    h = (h < 10 ? '0' : '') + h
    i = (i < 10 ? '0' : '') + i
    s = (s < 10 ? '0' : '') + s
    return [h, i, s].join(':')
  },
}

export default fmt
