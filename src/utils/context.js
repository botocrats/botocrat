const decorateSendParameters = require('./sendParams')

const createContext = (baseContext, message) =>
  decorateSendParameters(require('./methods')(baseContext, message))

module.exports.createSentContext = (existingContext, method, sent) => {
  existingContext.__defineGetter__(method, () => {
    const { client, type } = existingContext
    const baseContext = {
      client, type,
      then: (onfulfilled) => sent.then(onfulfilled),
      prom: sent,
      catch: (onrejected) => sent.catch(onrejected),
    }
    // rather previous context was a service message or not, 
    // sentContext is a message, therefore we add all methods
    return createContext(baseContext, sent)
  })
  return existingContext
}

module.exports.createServiceMessageContext = (client, type, incomingMessage) =>
  createContext(
    { client, type: 'message', service: type },
    incomingMessage)

module.exports.createMessageContext = (client, type, incomingMessage) =>
  createContext({ client, type }, incomingMessage)

module.exports.createInlineQueryContext = (client, { id: inline_query_id }) => ({
  type: 'inline_query',
  client,
  answer: (results, optionalParameters = {}) =>
    client.answerInlineQuery({
      ...optionalParameters,
      inline_query_id,
      results: JSON.stringify(results),
    })
})
