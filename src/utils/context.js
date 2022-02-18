const resolveElement = (e, params={}) => {
  if (typeof e === 'string') {
    e = {text: e, type: 'Message'}
  }
  !e.type && (e.type = 'Message')

  return {...e, ...params}
}

module.exports.createContext = (client, type, message) => {
  const returnContext = {
    type,
    client,
    to(chat_id){
      returnContext.__sendParams = { to: chat_id }
      return this
    },
    send(e) {
      let { type, to: chat_id, ...params } = resolveElement(e, returnContext.__sendParams)
      return createSubMessageContext(returnContext, client, 'sent', client['send' + type]({chat_id: chat_id || message.chat.id, ...params}))
    },
    forward: (disable_notification=false) =>
      createSubMessageContext(returnContext, client,'forwarded', client.forwardMessage({
        from_chat_id: message.chat.id,
        chat_id: returnContext.__sendParams.to || message.chat.id,
        disable_notification,
        message_id: message.message_id
      })),
    delete: (message_id) => client.deleteMessage({chat_id: message.chat.id, message_id: message_id||message.message_id}),
    copy: (optParams = {}) => {
      const { message_id, chat_id: from_chat_id } = message
      const chat_id = returnContext.__sendParams.to
      return createSubMessageContext(returnContext, client, 'copied', client.copyMessage({ from_chat_id, message_id, chat_id, ...optParams }))
    },
    reply: (e) => {
      const { type, ...params } = resolveElement(e)
      const { chat: { id: chat_id }, message_id: reply_to_message_id } = message
      return createSubMessageContext(returnContext, client, 'replied', client['send' + type]({ chat_id, reply_to_message_id, ...params }))
    }
  }
  return returnContext
}
module.exports.createServiceMessageContext = (client, type, message) => {
  const returnContext = {
    type: 'message',
    service: type,
    client,
    to(chat_id){
      returnContext.__sendParams = {to: chat_id}
    },
    send(e) {
      let { type, to: chat_id, ...params } = resolveElement(e, returnContext.__sendParams)
      
      return createSubMessageContext(returnContext, client, 'sent', client['send' + type]({ chat_id: chat_id || message.chat.id, ...params }))
    },
    delete: (message_id) =>
      client.deleteMessage({
        chat_id: message.chat.id,
        message_id: message_id || message.message_id
      })
  }
  return returnContext
}
const createSubMessageContext = (ctx, client, method, sent) => {
  ctx.__defineGetter__(method, () => {
    const subContext = {
      client,
      then: (onfulfilled) => sent.then(onfulfilled),
      prom: sent,
      catch: (onrejected) => sent.catch(onrejected),
      to(chat_id) {
        subContext.__sendParams = { to: chat_id }
        return subContext
      },
      send: (e) => createSubMessageContext(subContext, client, 'sent', sent.then((message) => {
        let { type, to: chat_id, ...params } = resolveElement(e, subContext.__sendParams)
        return client['send' + type]({ chat_id: chat_id || message.chat.id, ...params })
      })),
      reply: (e) =>
        createSubMessageContext(subContext, client, 'replied', sent.then(({ message_id, chat: { id: chat_id } }) => {
          let { type, ...params } = resolveElement(e)
          return client['send' + type]({ chat_id, ...params, reply_to_message_id: message_id })
        })),
      forward: (disable_notification= false) =>
        createSubMessageContext(subContext, client, 'forwarded', sent.then((message) => {
          const { message_id, chat: {id:from_chat_id} } = message
          const chat_id = subContext.__sendParams.to
          return client.forwardMessage({ from_chat_id, message_id, chat_id, disable_notification })
        })),
      delete: (msg_id) => sent
        .then(({ message_id: sent_message_id, chat: { id: chat_id } }) =>
          client.deleteMessage({ message_id: msg_id || sent_message_id, chat_id })),
      copy: (optParams = {}) => createSubMessageContext(subContext, client, 'copied', sent.then((message) => {
        const { message_id, chat_id: from_chat_id } = message
        const chat_id = subContext.__sendParams.to
        return client.copyMessage({ from_chat_id, message_id, chat_id, ...optParams })
      }))
    }
    return subContext
  })
  return ctx
}

module.exports.createInlineQueryContext = (client, type, message) => ({
  type,
  client,
  answer: (results, options = {}) =>
    client.answerInlineQuery({inline_query_id: message.id, results: JSON.stringify(results), ...options})
})
