module.exports.createChain = (middlewareList) => {
  let len = middlewareList.length
  if(len === 0){throw Error("no middleware")}
  return (...args) => new Promise((resolve, reject) => {
    const process = (i) => {
      if (i === len) return resolve()

      try {
        middlewareList[i](...args, () => process(i+1))
      }
      catch (e) {
        reject(e)
      }
    }
    process(0)
  })
}
