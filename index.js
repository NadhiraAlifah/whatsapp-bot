const fs = require('fs-extra')
const { default: makeWASocket, useSingleFileAuthState, DisconnectReason, generateForwardMessageContent, prepareWAMessageMedia, generateWAMessageFromContent, generateMessageID, downloadContentFromMessage } = require("@adiwajshing/baileys")
const { state, saveState } = useSingleFileAuthState(`./bot.json`)
const pino = require('pino')
const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta').locale('id')
const time = moment().format('HH:mm:ss');
const hari = moment().format('dddd');
const PhoneNumber = require('awesome-phonenumber')


async function start() {

__path = process.cwd()    

const getGroupAdmins = (participants) => {
    admins = []
    for (let i of participants) {
        i.admin === "admin" || i.admin === "superadmin" ? admins.push(i.id) : ''
    }
    return admins
}   


    const conn = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true,
        browser: ['JANGAN DI LOGOUT','Safari','1.0.0'],
        auth: state
    })

    conn.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut ? start() : console.log('Koneksi Terputus...')
        }
        console.log('Koneksi Terhubung...')
    })

conn.ev.on('creds.update', saveState)

    if (hari == "Senin" || hari == "Selasa" || hari == "Rabu" || hari == "Kamis"){
    if (time < "08:00:00") return 
    if (time > "23:00:00") return 
  conn.ev.on('messages.upsert', async chatUpdate => {
  m = chatUpdate
  m = m.messages[0]
  if (!m.message) return
  if (m.key && m.key.remoteJid == 'status@broadcast') return;
  if (m.key.fromMe) return
  m.message = (Object.keys(m.message)[0] === 'ephemeralMessage') ? m.message.ephemeralMessage.message : m.message
  if (m.key.id.startsWith('BAE5') && m.key.id.length === 16) return
  const type = Object.keys(m.message)[0]
  const from = m.key.remoteJid
  const isGroup = from.endsWith('@g.us')
  const botNumber = conn.user.id ? conn.user.id.split(":")[0]+"@s.whatsapp.net" : conn.user.id
  const body = (type === 'conversation') ? m.message.conversation : (type == 'imageMessage') ? m.message.imageMessage.caption : (type == 'videoMessage') ? m.message.videoMessage.caption : (type == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (type == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (type == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (type == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (type === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.title || m.text) : ''
  const groupMetadata = isGroup ? await conn.groupMetadata(from) : ''
  const groupMembers = isGroup ? await groupMetadata.participants : ''
  const groupName = isGroup ? groupMetadata.subject : ''
  const groupAdmins = isGroup ? await getGroupAdmins(groupMembers) : ''
  const participants = isGroup ? await groupMetadata.participants : ''
  const isBotGroupAdmins = isGroup ? groupAdmins.includes(botNumber) : false 
  const sender = isGroup ? m.key.participant : m.key.remoteJid
  const isGroupAdmins = isGroup ? groupAdmins.includes(sender) :  false
  const args = body.trim().split(/ +/).slice(1)
  const ownernumber = '6281414046576@s.whatsapp.net'
  const isOwner = from == ownernumber




  if (!isGroup && isOwner) {
    if (type === "conversation" || type === "extendedTextMessage") {
    if (body.match(new RegExp(/(https:\/\/chat.whatsapp.com)/gi))) {
        try {
        join = body.split('https://chat.whatsapp.com/')[1]
        await conn.groupAcceptInvite(join).then(async (data) => {
        await conn.sendMessage(from, {text : 'Succes Join To Grup'})
        })
        } catch (err) {
        console.log(err)
        }
    } else {
       return
    }
    }
}
  
  
      if (body === '.') {
      if (!isBotGroupAdmins) return conn.sendMessage(from, {text: 'Jadikan Bot Admin Terlebih Dahulu'} , {quoted : m})
      if (isGroup && isGroupAdmins) {
      conn.sendPresenceUpdate('composing', from)
      teks = (args.length > 1) ? body.slice(8).trim() : ''
      teks += `  Total : ${groupMembers.length}\n`
      for (let mem of groupMembers) {
      teks += `╠➥ @${mem.id.split('@')[0]}\n`
      }
      conn.sendMessage(from, {text : '╔══✪〘 Mention All 〙✪══\n╠➥'+teks+`╚═〘 ${groupName} 〙`, mentions: participants.map(a => a.id) } , { quoted: m })
      }
      }
      
      
      if (body == 'halo') {
      if (!isBotGroupAdmins) return conn.sendMessage(from, {text: 'Jadikan Bot Admin Terlebih Dahulu'} , {quoted : m})
      if (isGroup && isGroupAdmins) {
      conn.sendPresenceUpdate('composing', from)
      var options = {
      text: 'halo semua',
      mentions: participants.map(a => a.id)
      }
      conn.sendMessage(from, options, {quoted : m})
      }
      }
  
      if (body == 'haechan') {
      if (!isBotGroupAdmins) return conn.sendMessage(from, {text: 'Jadikan Bot Admin Terlebih Dahulu'} , {quoted : m})
      if (isGroup && isGroupAdmins) {
      ini_buffer = await fs.readFileSync('haechan.webp');
      conn.sendMessage(from, {sticker : ini_buffer , mentions: participants.map(a => a.id)}, { quoted : m})
      }
      }
      })
      }

  }

start()