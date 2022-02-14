import {
  ITelegramClient, ITMessage, ITSendParams, ITServiceMessage,
  ITUpdate, ITCopyMessageParams, ITAnswerInlineQueryParameters, TTInlineQueryResult,
} from "@botocrat/telegram";
type TTChatIdType = number | string

export type IBotResponseContext<T extends keyof ITUpdate, Ctx = {}, ChatId = {chat_id?: number | string}> = {
  client: ITelegramClient
  type: T
  to: (chat_id: TTChatIdType) => IBotResponseContext<T, Ctx, {}>
  copy: (params: Omit<ITCopyMessageParams, "from_chat_id" | "message_id" | "chat_id"> & ChatId) => IBotResponseContext<T, {copied: IBotResponseContext<"message", Ctx>}>
  forward: (params: {disable_notification?: boolean} & ChatId) => IBotResponseContext<T, {forwarded: IBotResponseContext<"message", Ctx>}>
  reply: (params: string | Omit<ITSendParams["Message"], "chat_id" | "reply_to_message_id">) =>  IBotResponseContext<T, {replied: IBotResponseContext<"message",Ctx>}>
  send: (params: string | (Omit<ITSendParams["Message"], "chat_id"> & ChatId)) => IBotResponseContext<T, {sent: IBotResponseContext<"message", Ctx>}>
  delete: (message_id?: number) => Promise<boolean>
} & Ctx

export interface IBotServiceMessageContext<T extends keyof ITServiceMessage> {
  type: T
  client: ITelegramClient
  delete: (message_id?: number) => Promise<boolean>
  to: (chat_id: TTChatIdType) => Omit<IBotServiceMessageContext<T>, "send"> & {send: (params: Omit<ITSendParams["Message"], "chat_id">) => Promise<ITMessage>}
  send: (params: ITSendParams["Message"]) => Promise<ITMessage>
}

export interface IBotInlineQueryContext {
  type: "inline_query",
  client: ITelegramClient
  answer: (results: TTInlineQueryResult[], options?: Omit<ITAnswerInlineQueryParameters, "inline_query_id" | "results">) => Promise<boolean>
}