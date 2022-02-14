
const Promise = require('bluebird')
const unique = (i=[]) => Array.from(new Set(i))
const WHERE = (key, value) => (item) => item[key] === value
module.exports.extractMentions = ({ entities, text }) =>
  entities && (entities.length < 20 )
    ? unique(entities
    .filter(WHERE("type", "mention"))
    .map(({ offset, length }) =>
      text.substr(offset + 1, length - 1)))
    : []
module.exports.createChain = (middlewareList) => {
  let len = middlewareList.length
  if(len === 0){throw Error("no middleware")}
  return (...args) => new Promise((resolve, reject) => {
    const process = (i) => {
      if (i === len) return resolve()

      try {
        middlewareList[i](...args, () => process(i+1))
      }
      catch (e) {
        reject(e)
      }
    }
    process(0)
  })
}

module.exports.endpointNotFound = (type) => Promise.reject({code: 418, description: type + " handler not defined"})
