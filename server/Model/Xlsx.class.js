const xlsxReader = require('xlsx')

class Model extends require('./Model.class') {
  constructor() {
    super()
  }

  // parse xlsx file
  // return array
  getData(filepath, startRow = 1) {
    let res = []
    let rowIndex = startRow + 1
    try {
      let workbook = xlsxReader.readFile(filepath)
      let worksheet = workbook.Sheets[workbook.SheetNames[0]]
      let ref = worksheet["!ref"].split(':')
      // let len = parseInt(ref[1].replace(/[^\d]/ig, ''))
      for (var i in worksheet) {
        if (i.indexOf('!') === -1) {
          let col = i.replace(/\d/ig, '') + String(startRow)
          let row = parseInt(i.replace(/[^\d]/ig, ''))
          if (row > startRow) {
            if (!res[row - rowIndex]) {
              res[row - rowIndex] = []
            }
            res[row - rowIndex].push({
              title: worksheet[col] ? worksheet[col].v : col,
              value: worksheet[i].v,
              origin: worksheet[i],
            })
          }
        }
      }
      return res
    }
    catch (e) {
      this.logger.error("getXlsxData error:" + e)
      return false
    }
  }

  // export xlsx file
  // return string filepath
  setData(filepath, headers, data, sheetname = 'sheet', title = false) {
    let tmp = []
    let start = 1
    let _title = {}
    if (title) {
      _title = { 'A1': { v: title } }
      start = 2
    }
    for (let i in headers) {
      tmp.push({ title: i, key: headers[i] })
    }
    let _headers = Object.keys(headers)
      .map((v, i) => ({
        v: v,
        position: (i > 25 ? String.fromCharCode(64 + Math.floor(i / 26)) : '') + String.fromCharCode(65 + i % 26) + start
      }))
      .reduce((prev, next) => Object.assign({}, prev, {
        [next.position]: {
          v: next.v,
          s: {
            patternType: 'solid',
            fgColor: { theme: 8, tint: 0.3999755851924192 },
            bgColor: { indexed: 64 }
          }
        }
      }), {})

    let _data = data
      .map((v, i) => tmp.map((k, j) => ({
        v: v[k.key],
        position: (j > 25 ? String.fromCharCode(64 + Math.floor(j / 26)) : '') + String.fromCharCode(65 + j % 26) + (i + start + 1)
      })))
      .reduce((prev, next) => prev.concat(next))
      .reduce((prev, next) => Object.assign(prev, { [next.position]: { v: next.v } }), {})

    let output = Object.assign({}, _title, _headers, _data)
    // 获取所有单元格的位置
    let outputPos = Object.keys(output)
    // 计算范围
    let ref = outputPos[0] + ':' + outputPos[outputPos.length - 1]
    let workbook = {
      SheetNames: [sheetname],
      Sheets: {}
    }
    workbook.Sheets[sheetname] = Object.assign({}, output, { '!ref': ref })
    try {
      xlsxReader.writeFile(workbook, filepath, { cellStyles: true })
      return filepath
    }
    catch (e) {
      this.logger.error("setXlsxData error:" + e)
      return false
    }
  }

}
module.exports = new Model()
