const findKey = (keys) => (obj) => {
  let found = false
  Object
    .keys(obj)
    .some(key => keys.indexOf(key) > -1 ? found = key : false)
  return found
}

const serviceMessageTypes = [
  "new_chat_members", "left_chat_member", "new_chat_title","new_chat_photo",
  "delete_chat_photo","group_chat_created","supergroup_chat_created",
  "channel_chat_created","message_auto_delete_timer_changed","migrate_to_chat_id",
  "migrate_from_chat_id","successful_payment","proximity_alert_triggered",
  "voice_chat_scheduled","voice_chat_started", "voice_chat_ended",
  "voice_chat_participants_invited"
]
module.exports = findKey(serviceMessageTypes)
