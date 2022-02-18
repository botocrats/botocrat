'use strict'
const {createContext, createServiceMessageContext} = require('./utils/context')
const Middleware = require('./Middleware')
const isServiceMessage = require('./utils/serviceMessage')
module.exports = class Botocrat extends Middleware {
  endpoints = {}
  serviceMessage = {}
  get(endpoint, handler) {
    this.endpoints[endpoint] = handler
    return this
  }
  on(service_endpoint, callback){
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
        req, res,
        () => this.serviceMessage[serviceMessageType] && this.serviceMessage[serviceMessageType](req, res))
    }
    res = createContext(client, endpointType, req)
    return super._processUpdate(
      req, res,
      () => this.endpoints[endpointType] && this.endpoints[endpointType](req, res))
  }
}
module.exports.Commands = require('./utils/commands')