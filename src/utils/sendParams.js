module.exports = (obj) => {
  const sendParams = {}
  const assign = (params) => {
    Object.assign(sendParams, params)
    return obj
  }
  return Object.assign(obj, {
    to: (chat_id) => assign({ chat_id }),
    get protect() {
      return assign({ protect_content: true })
    },
    get silent() {
      return assign({ disable_notification: true })
    },
    get __sendParams() {
      return sendParams
    }
  })
}
