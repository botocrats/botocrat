import { ITelegramClient, ITUpdate, ITServiceMessage, ITMessage } from '@botocrat/telegram'
import { IBotResponseContext, IBotServiceMessageContext, IBotInlineQueryContext } from './context'

export type TBotHandler<T extends keyof ITUpdate> = (req: ITUpdate[T] , res: T extends "inline_query" ? IBotInlineQueryContext : IBotResponseContext<T>) => any

export declare const Commands : (commands: {
  [Command: string]: TBotHandler<"message">
}) => TBotMiddleware<"message">

export declare type TBotMiddleware<T extends keyof ITUpdate> = (req: ITUpdate[T], res: IBotResponseContext<T>, next: () => void) => any

export default class Botocrat {
  private _init: () => void
  private _proccessUpdate: (update: ITUpdate, client: ITelegramClient) => void
  use: <T extends keyof ITUpdate>(middleware: TBotMiddleware<T>) => this
  on: <T extends keyof ITServiceMessage>(type: T, handler: (req: ITMessage & Pick<ITServiceMessage, T>, res: IBotServiceMessageContext<T>, value: ITServiceMessage[T])=>void) => this
  get: <T extends keyof ITUpdate>(endpoint:T, handler:TBotHandler<T>) => this
}
