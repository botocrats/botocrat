const identifiers = require('../identifiers.json')
const findKey = (keys) => (obj) => {
  let found = false
  Object
    .keys(obj)
    .some(key => keys.indexOf(key) > -1 ? found = key : false)
  return found
}

const resolver = findKey(Object.keys(identifiers.object))
const resolveMethod = (params) => {
  const hasSpecificKey = resolver(params)
  return hasSpecificKey
    ? identifiers.object[hasSpecificKey]
    : "Message"
}
module.exports.resolveSendParameters = (e, params = {}) => {
  if (typeof e === 'string') {
    e = { text: e, type: 'Message' }
  } else if (!e) {
    e = { type: 'Message' }
  }

  !e.type && (e.type = resolveMethod(e))
  return { ...e, ...params }
}
module.exports.isServiceMessage = findKey(identifiers.serviceMessage)