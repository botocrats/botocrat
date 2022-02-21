'use strict'
const { createMessageContext, createServiceMessageContext } = require('./utils/context')
const Middleware = require('./Middleware')
const { isServiceMessage } = require('./utils/misc')

const bind = (callback, ...args) => callback ? () => callback(...args) : null
module.exports = class Botocrat extends Middleware {
  endpoints = {}
  serviceMessage = {}
  get(endpoint, handler) {
    this.endpoints[endpoint] = handler
    return this
  }
  on(service_endpoint, callback) {
    this.serviceMessage[service_endpoint] = callback
    return this
  }
  _processUpdate(update, client) {
    const [endpointType, req] = Object.entries(update)[0]
    const serviceMessageType = endpointType === "message" && isServiceMessage(req);
    let res
    if (serviceMessageType) {
      res = createServiceMessageContext(client, serviceMessageType, req)
      return super._processUpdate(
        req,
        res,
        bind(this.serviceMessage[serviceMessageType], req, res)
      )
    } else {
      res = createMessageContext(client, endpointType, req)
      return super._processUpdate(
        req,
        res,
        bind(this.endpoints[endpointType], req, res)
      )
    }
  }
}
module.exports.Commands = require('./utils/commands')