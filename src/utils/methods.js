const { resolveSendParameters } = require('./misc')
const { createSentContext } = require('./context')

const wait = (ms, cb) => !ms
  ? cb()
  : new Promise((resolve, reject) => setTimeout(() =>
    cb().then(resolve).catch(reject), ms))

const getMethods = (context) => {
  const client = context.client
  return {
    send: (e) => ({ chat: { id: message_chat } }) => {
      let { type, chat_id, wait: ms, ...params } = resolveSendParameters(e, context.__sendParams)
      const sent = wait(ms, () => client['send' + type]({ chat_id: chat_id || message_chat, ...params }))
      return createSentContext(context, 'sent', sent)
    },
    reply: (e = {}) => ({ message_id, chat: { id: chat_id } }) => {
      let { type, wait: ms, ...params } = resolveSendParameters(e, context.__sendParams)
      const sent = wait(ms, () => client['send' + type]({ ...params, chat_id, reply_to_message_id: message_id }))
      return createSentContext(context, 'replied', sent)
    },
    forward: () => ({ message_id, chat: { id: from_chat_id } }) => {
      const { wait, ...params } = context.__sendParams
      const sent = wait(ms, () => client.forwardMessage({ from_chat_id, message_id, ...params }))
      return createSentContext(context, 'forwarded', sent)
    },
    delete: (msg_id) => ({ message_id: sent_message_id, chat: { id: chat_id } }) => {
      const { wait: ms } = context.__sendParams
      return wait(ms, () => client.deleteMessage({ message_id: msg_id || sent_message_id, chat_id }))
    },
    copy: (e = {}) => ({ message_id, chat: { id: from_chat_id } }) => {
      let { type, chat_id, wait: ms, ...params } = resolveSendParameters(e, context.__sendParams)
      const sent = wait(ms, () => client.copyMessage({ ...params, from_chat_id, message_id, chat_id }))
      return createSentContext(context, 'copied', sent)
    }
  }
}

module.exports = (context, message) => {
  const methods = getMethods(context)
  Object.keys(methods).forEach(
    message instanceof Promise
      ? (name) =>
        context[name] = (e) => {
          message.then(methods[name](e))
          return context
        }
      : (name) =>
        context[name] = (e) => {
          methods[name](e)(message)
          return context
        })
  return context
}
