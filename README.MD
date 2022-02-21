# Botocrat Framework

[![NodeJS][nodejs-image]][npm-url]
[![npm][npm-image]][npm-url]
[![size][size-image]][npm-url]
[![last commit][lastcommit-image]][github-url]
[![license mit][license-image]][github-url]
![vulnerabilities][vulnerabilities-image]
[![Total alerts][alerts-image]][alerts-url]
[![Code quality][quality-image]][quality-url]

![Botocrat animation][animation-url]

Botocrat is a minimal and flexible Telegram bot framework that provides `context oriented programming` API along with express-like middlewares.


Botocrat has following packages you can use or replace with your own.

| Package | |
|-|-|
| [@botocrat/telegram][client-pkg] | Telegram Bot Client |
| [@botocrat/poller][poller-pkg] | Polls Telegram server to .getUpdates() |
| [@botocrat/express][express-pkg] | Express middleware to receive updates from webhook |

## Features

- [Context Oriented][context-wiki] Approach
- Flexible ( You can [create & share middlewares][middleware-wiki] )
- [Lightest][size-comparison] & low-overhead
- Typescript Support

## Quick Start (cli)

```bash
npm exec botocrat my-telegram-bot
```

## Quick Start (manual)

```bash
npm i @botocrat/core @botocrat/telegram @botocrat/poller --save
```

```typescript
import Botocrat from '@botocrat/core'
import createClient from '@botocrat/telegram'
import poller from '@botocrat/poller'

const client = createClient({token: TELEGRAM_BOT_TOKEN})

const bot = new Botocrat()
  .get('message', (req, res) => {
    res.reply(`Hello ${req.from.first_name}!`)
  })

poller(bot, client).poll()

```

## Documentation

Read the detailed documentation on [GitHub Wiki][github-wiki]

## License

MIT License

[middleware-wiki]: https://github.com/botocrats/botocrat/wiki/Middlewares
[context-wiki]: https://github.com/botocrats/botocrat/wiki/Message-Context
[github-wiki]: https://github.com/botocrats/botocrat/wiki
[client-pkg]: https://npmjs.com/@botocrat/telegram
[poller-pkg]: https://npmjs.com/@botocrat/poller
[express-pkg]: https://npmjs.com/@botocrat/express

[license-image]: https://img.shields.io/github/license/botocrats/botocrat?style=flat-square
[size-image]: https://img.shields.io/bundlephobia/min/@botocrat/core?style=flat-square
[nodejs-image]: https://img.shields.io/badge/library-NodeJS-darkgreen.svg?style=flat-square
[npm-image]: https://img.shields.io/npm/v/@botocrat/core.svg?style=flat-square
[lastcommit-image]: https://img.shields.io/github/last-commit/botocrats/botocrat?style=flat-square
[vulnerabilities-image]: https://img.shields.io/snyk/vulnerabilities/npm/@botocrat/core

[npm-url]: https://npmjs.org/package/@botocrat/core
[github-url]: https://github.com/botocrats/botocrat
[size-comparison]: https://packagephobia.com/result?p=%40botocrat%2Fcore%2Ctelegraf%2Cnode-telegram-bot-api%2Cslimbot%2Ctelebot
[animation-url]: https://user-images.githubusercontent.com/17167342/154324948-8df5edf2-7216-41b9-889b-5b025ddf89a8.gif
[alerts-url]: https://lgtm.com/projects/g/botocrats/botocrat/alerts/
[alerts-image]: https://img.shields.io/lgtm/alerts/g/botocrats/botocrat.svg?logo=lgtm&logoWidth=18
[quality-image]: https://img.shields.io/lgtm/grade/javascript/g/botocrats/botocrat.svg?logo=lgtm&logoWidth=18
[quality-url]: https://lgtm.com/projects/g/botocrats/botocrat/context:javascript
