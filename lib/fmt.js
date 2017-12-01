
const fmt = {
  mobile(str, t) {
    return str.replace(/(\d{3})(\d{4})(\d{4})/, t ? ['$1', '$2', '$3'].join(t) : '$1****$2')
  },
  email(str) {
    return str.replace(/(.{0,2})(.+)(@.+)/g, '$1****$3')
  },
  // 首字母大写 其他字母变小写
  capitalize(str) {
    return str.toLowerCase().replace(/(\w)/, v => v.toUpperCase())
  },
  billid(a, b) {
    let c = a + '' + b
    if (c.length != 10) return a
    return c.replace(/(\d{5})(\d{5})/, '$1 $2')
  },
  // 数字格式化
  number(num) {
    num = Number(num);
    let yi = Math.pow(10, 8)
    let wan = Math.pow(10, 4)
    if (num >= yi) return Number((num / yi).toFixed(2)) + '亿'
    if (num >= wan) return String(Number((num / wan).toFixed(1))).replace(/(\d*)\.?(\d*)/, function (a, b, c) {
      return b + '万' + (c ? c + '千' : '')
    });
    return num
  },
  // 12345 => $12,345.00
  currency(value, sign, decimals) {
    value = parseFloat(value)
    if (!isFinite(value) || !value && value !== 0) return ''

    sign = sign || '$'
    decimals = decimals || 2

    let _str = Math.abs(value).toFixed(decimals)
    let _int = decimals ? _str.slice(0, -1 - decimals) : _str

    let i = _int.length % 3;
    let head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? ',' : '') : ''
    let _float = decimals ? _str.slice(-1 - decimals) : ''
    return (value < 0 ? '-' : '') + sign + head + _int.slice(i).replace(/(\d{3})(?=\d)/g, '$1,') + _float
  },
  stringCut(str, len, dot = '') {
    dot = (dot && str.length > len) ? dot : ''
    return str.slice(0, len).replace(/([^\x00-\xff])/g, "$1a").slice(0, len).replace(/([^\x00-\xff])a/g, "$1") + dot
  },
  datetime(time = '', hms = true, sep = '--') {
    let date = !isNaN(Date.parse(time)) ? new Date(time) : new Date(),
      y = date.getFullYear(),
      m = date.getMonth() + 1,
      d = date.getDate(),
      h = date.getHours(),
      i = date.getMinutes(),
      s = date.getSeconds();

    m = (m < 10 ? '0' : '') + m;
    d = (d < 10 ? '0' : '') + d;
    h = (h < 10 ? '0' : '') + h;
    i = (i < 10 ? '0' : '') + i;
    s = (s < 10 ? '0' : '') + s;
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
    h = (h < 10 ? '0' : '') + h;
    i = (i < 10 ? '0' : '') + i;
    s = (s < 10 ? '0' : '') + s;
    return [h, i, s].join(':')
  },
  //获取n天后的日期
  dateOffset(date, num, hms, sep) {
    date = !isNaN(Date.parse(date)) ? new Date(date) : Date.now()
    date.setDate(date.getDate() + num)
    return this.time(date, hms, sep)
  },
  timeRemain(starttime, endtime) {
    let t = endtime - starttime
    if (t <= 0) return 0
    let seconds = Math.floor((t / 1000) % 60)
    let minutes = Math.floor((t / 1000 / 60) % 60)
    let hours = Math.floor((t / (1000 * 60 * 60)) % 24)
    let days = Math.floor(t / (1000 * 60 * 60 * 24))

    hours = (hours < 10 ? '0' : '') + hours
    minutes = (minutes < 10 ? '0' : '') + minutes
    seconds = (seconds < 10 ? '0' : '') + seconds
    return (days > 0 ? (days + '天 ') : '') + [hours, minutes, seconds].join(':')
  },
  treeData(arr, idKey = 'id', pidKey = 'pid', childKey = 'child') {
    if (Array.isArray(arr)) {
      if (idKey && pidKey) {
        let res = []
        let tmp = []
        let len = arr.length
        for (let i = 0; i < len; i++) {
          tmp[arr[i][idKey]] = arr[i]
        }
        for (let i = 0; i < len; i++) {
          if (tmp[arr[i][pidKey]] && arr[i][idKey] != arr[i][pidKey]) {
            if (!tmp[arr[i][pidKey]][childKey]) {
              tmp[arr[i][pidKey]][childKey] = []
            }
            tmp[arr[i][pidKey]][childKey].push(arr[i])
          } else {
            res.push(arr[i])
          }
        }
        return res
      }
      return arr
    }
    return []
  },
}

module.exports = fmt
