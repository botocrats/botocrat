const isCommand = (availableCommands, username) =>
  ({ entities, text }) => {
    if (entities && entities.length && entities[0].type === 'bot_command') {
      const { offset, length } = entities[0]
      const match = text.match(/@([a-zA-Z0-9]+)/)
      if (!match || (match && match[1] === username)) {
        const cmd = text
          .substr(offset + 1, length - 1)
          .replace(/@[a-zA-Z0-9]+/, '')
        return availableCommands.indexOf(cmd) > -1
          ? cmd
          : null
      }
    }
    return null
  }

module.exports = (commands) => {
  const getCommand = isCommand(Object.keys(commands))
  return (req, res, next) => {
    if(res.type !== "message") return next()
    const cmd = getCommand(req);
    if(!cmd) return next()
    commands[cmd](req, res)
  }
}