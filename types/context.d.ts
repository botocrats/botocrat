import {
  ITelegramClient, ITMessage, ITSendParams, ITServiceMessage,
  ITUpdate, ITCopyMessageParams, ITAnswerInlineQueryParameters,
  TTInlineQueryResult,
  ITSendParameters
} from "@botocrat/telegram";
type TTChatIdType = number | string
type BaseSentParameters = Omit<ITSendParameters, "allow_sending_without_reply"|"reply_markup"|"reply_to_message_id">
type SentContext={
  prom: Promise<ITMessage>
  then: (onfullfilled: (m: ITMessage)=> void) => void
  catch: (onrejected: (err: any) => void) => void
}
type Fields<T extends keyof ITUpdate, fields, X=string> = 
  keyof ITUpdate[T] extends "message_id" ? X | fields : fields & {message_id: number}
export type IBotResponseContext<T extends keyof ITUpdate, Ctx = {}, Discard={} , SendParams = BaseSentParameters> = Omit<{
  client: ITelegramClient
  type: T
  to: (chat_id: TTChatIdType) => IBotResponseContext<T, Ctx, Discard, Omit<SendParams, "chat_id">>
  silent: IBotResponseContext<T, Ctx, Discard & {silent: any}, Omit<SendParams, "disable_notification">>
  protect: IBotResponseContext<T, Ctx, Discard & {protect: any}, Omit<SendParams, "protect_content">>
  copy: (params: Omit<ITCopyMessageParams, keyof BaseSentParameters | "from_chat_id" | "message_id" | "chat_id"> & SendParams & keyof ITUpdate[T] extends "message_id" ? {} : {message_id:number}) =>
    IBotResponseContext<T, { copied: IBotResponseContext<"message", SentContext> }, Discard, SendParams>
  forward: (params: Fields<T, SendParams>) =>
    IBotResponseContext<T, { forwarded: IBotResponseContext<"message", SentContext> }, Discard, SendParams>
  reply: (params: Fields<T, Omit<ITSendParams["Message"], keyof BaseSentParameters | "chat_id" | "reply_to_message_id"> & SendParams>) =>
    IBotResponseContext<T, { replied: IBotResponseContext<"message", SentContext> }, Discard, SendParams>
  send: (params:  Fields<T, Omit<ITSendParams["Message"], keyof BaseSentParameters | "chat_id"> & SendParams>) =>
    IBotResponseContext<T, { sent: IBotResponseContext<"message", SentContext> }, Discard, SendParams>
  delete: (params: Fields<T,{}, number>) => Promise<boolean>
}, keyof Discard> & Ctx

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