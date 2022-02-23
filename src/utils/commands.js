const isCommand = (availableCommands, username) => {
  const exists = (cmd) => availableCommands.indexOf(cmd) > -1
    ? cmd
    : null

  return ({ entities, text, chat: { type } }) => {
    if (entities && entities.length && entities[0].type === 'bot_command') {
      const { offset, length } = entities[0]
      let cmd = text.substr(offset + 1, length - 1)
      if (type === 'private') return exists(cmd)

      const match = text.match(/\/[a-zA-Z0-9]+@([a-zA-Z0-9_]+)/)
      if (!match || (match && match[1] === username)) {
        cmd = cmd.replace(/@[a-zA-Z0-9_]+/, '')
        return exists(cmd)
      }
    }
    return null
  }
}

module.exports = (commands, username) => {
  const getCommand = isCommand(Object.keys(commands), username)
  return (req, res, next) => {
    if (!(res.type === 'message' || res.type === 'edited_message')) return next()
    const cmd = getCommand(req)
    if (!cmd) return next()
    return commands[cmd](req, res)
  }
}