module.exports.createChain = (middlewareList) => {
  let len = middlewareList.length
  const execute = (fn, args, cb) => {
    try {
      fn(...args, cb)
    }
    catch (e) {
      console.error(error, "Error while running middleware", fn.toString())
    }
  }
  return len === 0
    ? (req, res, next) => next && next()
    : (req, res, next) => {
      const process = (index = 0) =>
        (index === len)
          ? next && next()
          : execute(middlewareList[index], [req, res], () => process(index + 1))
      process()
    }
}
