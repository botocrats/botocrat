const methods = {
  allow: 'allow_sending_without_reply',
  protect: 'protect_content',
  silent: 'disable_notification'
}
const methodNames = Object.keys(methods)

module.exports = (obj) => {
  const sendParams = {}
  const assign = (key, value) => {
    sendParams[key] = value
    return obj
  }
  methodNames.forEach((method) =>
    obj.__defineGetter__(method, () => assign(methods[method], true)))
  obj.__defineGetter__('__sendParams', () => {
    const params = { ...sendParams }
    delete sendParams.wait
    return params
  })

  return Object.assign(obj, {
    to: (chat_id) => assign('chat_id', chat_id),
    wait: (ms) => assign('wait', ms),
  })
}
