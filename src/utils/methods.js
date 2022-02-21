const { resolveSendParameters } = require('./misc')
const { createSentContext } = require('./context')

const getMethods = (context) => {
  const client = context.client
  return {
    send: (e) => ({ chat: { id: message_chat } }) => {
      let { type, to: chat_id, ...params } = resolveSendParameters(e, context.__sendParams)
      const sent = client['send' + type]({ chat_id: chat_id || message_chat, ...params })
      return createSentContext(context, 'sent', sent)
    },
    reply: (e = {}) => ({ message_id, chat: { id: chat_id } }) => {
      let { type, ...params } = resolveSendParameters(e, context.__sendParams)
      const sent = client['send' + type]({ ...params, chat_id, reply_to_message_id: message_id })
      return createSentContext(context, 'replied', sent)
    },
    forward: () => ({ message_id, chat: { id: from_chat_id } }) => {
      const sent = client.forwardMessage({ from_chat_id, message_id, ...context.__sendParams })
      return createSentContext(context, 'forwarded', sent)
    },
    delete: (msg_id) => ({ message_id: sent_message_id, chat: { id: chat_id } }) =>
      client.deleteMessage({ message_id: msg_id || sent_message_id, chat_id }),
    copy: (e = {}) => ({ message_id, chat: { id: from_chat_id } }) => {
      let { type, chat_id, ...params } = resolveSendParameters(e, context.__sendParams)
      const sent = client.copyMessage({ ...params, from_chat_id, message_id, chat_id, })
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
