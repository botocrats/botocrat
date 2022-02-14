const { createChain } = require('./utils')

module.exports = class Middleware {
  _middlewares = [];
  _middlewareChain = () => Promise.resolve();
  _init() {
    if (this._middlewares) {
      this._middlewares.length &&
        (this._middlewareChain = createChain(this._middlewares));
      delete this._middlewares;
    }
    return this;
  }
  _processUpdate(req, res, callEndpoint) {
    return this._middlewareChain(req, res)
      .then(() => {
        callEndpoint();
        return true;
      });
  }
  use(middleware) {
    if (!this._middlewares) {
      console.error("Can't chain middleware after initialization.");
      process.exit(1)
    }
    this._middlewares.push(middleware)
    return this;
  }
};