'use strict'
const {createContext, createServiceMessageContext} = require('./utils/context')
const Middleware = require('./Middleware')
const {endpointNotFound} = require("./utils")
const isServiceMessage = require("./utils/serviceMessage")
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
    const serviceMessageType = isServiceMessage(req)
    let res, callback
    if (serviceMessageType) {
      return super._processUpdate(
        req,
        createServiceMessageContext(client, serviceMessageType, req),
        () => this.serviceMessage[serviceMessageType] && this.serviceMessage[serviceMessageType](req, res)
      );
    }

    return super._processUpdate(
      req,
      createContext(client, endpointType, req),
      () => this.endpoints[endpointType] && this.endpoints[endpointType](req, res)
    )
  }
}
module.exports.Commands = require('./utils/commands')