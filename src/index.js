const fs = require('fs')
const path = require('path')
const readGlob = require('read-glob')

const { inputFolder, outputFolder } = require('./config')
const patterns = require('./regex')

const cert = [
  'C:',
  'Users',
  'justin.lyon',
  'Documents',
  'workspace',
  'ant-jobs',
  'sabre',
  'sabre-cert2',
  'src',
  'reports'
]

const outputFileName = 'matches.json'

const inputPath = path.join(...inputFolder)
const pattern = `${inputPath}/**/*.report`

const getReportAndFolder = fullPath => {
  const describe = path.parse(fullPath)
  const reportFolder = describe.dir.split('/').slice(-1)[0]
  const report = describe.base
  console.log('reportFolder', reportFolder + '/' + report)
  return path.join(reportFolder, report)
}

const doGlob = () => {
  const fileMatches = []
  readGlob(pattern, 'utf8').subscribe({
    start () {
      console.log('Starting...')
    },
    next (result) {
      console.log('...Processing')

      const hasMatch = search(result)

      if (hasMatch) {
        const report = getReportAndFolder(result.path)
        fileMatches.push(report)
      }
    },
    complete () {
      console.log('Done.')
      const matchFile = path.join(...outputFolder, outputFileName)
      const writer = fs.createWriteStream(matchFile)
      writer.write(JSON.stringify(fileMatches, null, 2))
      writer.end();
    }
  })
}

const readFile = () => {
  const reportPath = path.join(inputPath, 'TN_Sales_Report', 'All_Sabre_by_Forecast_Category.report')
  return new Promise((resolve, reject) => {
    fs.readFile(reportPath, 'utf8', (err, data) => {
      if (err) reject(err)

      resolve(data)
    })
  })
}

const getFields = (pattern, content) => {
  const hasMatch = pattern.test(content)
  if (!hasMatch) return []

  const match = content.match(pattern)
  const fields = match.map(m => {
    return patterns.field.exec(m)
      .map(field => field.replace('<field>', ''))
      .map(field => field.replace('</field>', ''))
  })
  .reduce((acc, fields) => {
    return acc.concat(...fields)
  }, [])

  return fields
}

const search = ({ path, contents }) => {
  const aggFields = getFields(patterns.aggregate, contents)
  // console.log('aggFields', aggFields)

  const downFields = getFields(patterns.groupingsDown, contents)
  // console.log('downFields', downFields)

  const acrossFields = getFields(patterns.groupingsAcross, contents)
  // console.log('acrossFields', acrossFields)

  const isGroupedByAggregate = aggFields.reduce((acc, field) => {
    const hasGroupedDown = downFields.includes(field)
    const hasGroupedAcross = acrossFields.includes(field)

    return acc && (hasGroupedDown || hasGroupedAcross)
  }, aggFields.length > 0)

  if (isGroupedByAggregate) {
    console.log('Found Match: ', path)
  }
  return isGroupedByAggregate
}

doGlob()

// readFile()
//   .then(content => {
//     console.log('fs readfile', content)
//   })