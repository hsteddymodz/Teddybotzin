const { default: makeWASocket, useMultiFileAuthState, makeInMemoryStore, DisconnectReason, WAGroupMetadata, relayWAMessage, MediaPathMap, mentionedJid, processTime, MediaType, Browser, MessageType, Presence, Mimetype, Browsers, delay, fetchLatestBaileysVersion, MessageRetryMap, extractGroupMetadata, generateWAMessageFromContent, proto, otherOpts, makeCacheableSignalKeyStore } = require('@whiskeysockets/baileys');

const { axios, Boom, cheerio, crypto, cfonts, colors, fs, ffmpeg, fetch, ms, moment, number, nodecache, request, readline, pino, util, os, exec, spawn, execSync } = require('./exportados');

const { banner1, banner2 } = require('./arquivos/funções/ferramentas');

const retirarlog1 = console.info;
console.info = function() {
if (!util.format(...arguments).includes("Removing old closed session: SessionEntry {}")){
return retirarlog1(...arguments);
}};
const retirarlog2 = console.info;
console.info = function() {
if (!util.format(...arguments).includes("Closing session: SessionEntry")){
return retirarlog2(...arguments); 
}};

const MessageCache = new nodecache();
const pairingCode = process.argv.includes("--code");
const rl = readline.createInterface({input: process.stdin, output: process.stdout });
const question = (texto) => new Promise((resolve) => rl.question(texto, resolve));

async function connectToWhatsApp() {
var pastacode = "./arquivos/qr-code";

const { state, saveCreds } = await useMultiFileAuthState(pastacode);

const { version } = await fetchLatestBaileysVersion();

const bkz = makeWASocket({
version,
auth: state,
syncFullHistory: true,
printQRInTerminal: !pairingCode,
qrTimeout: 180000,
logger: pino({ level: 'silent' }),
browser: ["Chrome (Linux)", "", ""],
MessageCache,
connectTimeoutMs: 60000,
defaultQueryTimeoutMs: 0,
keepAliveIntervalMs: 10000,
emitOwnEvents: true,
fireInitQueries: true,
generateHighQualityLinkPreview: true,
syncFullHistory: true,
markOnlineOnConnect: true,
patchMessageBeforeSending: (message) => {
const requiresPatch = !!(message.buttonsMessage || message.listMessage);
if (requiresPatch) {
message = {viewOnceMessage: {
message: {messageContextInfo: {
deviceListMetadataVersion: 2,
deviceListMetadata: {},
},...message }}}}
return message;
}});

if (pairingCode && !bkz.authState.creds.registered) {
let number = await question(`${colors.gray("• Exemplo do número para conectar: +55 84 9999-9999.")}${colors.yellow("\n• Insira o número de telefone: ")}`);
number = number.replace(/[^0-9]/g, "");
let code = await bkz.requestPairingCode(number);
code = code?.match(/.{1,4}/g)?.join("-") || code;
console.log(`${colors.yellow("\n• Código para conectar ao WhatsApp: ")}` + colors.white(code));
rl.close();
}
bkz.ev.process(async(events) => {

if (events["messages.upsert"]) {
var upsert = events["messages.upsert"]
require("./comandos.js")(upsert, bkz)}

if (events["connection.update"]) {
const update = events["connection.update"]
const { connection, lastDisconnect, receivedPendingNotifications } = update;

const shouldReconnect = new Boom(lastDisconnect?.error)?.output.statusCode;

switch (connection) {
case 'close':
if(shouldReconnect) {
if(shouldReconnect == 428) {
console.log(colors.yellow("Conexão caiu, será ligado novamente, se continuar, provavelmente sua internet está caindo frequentemente..."));
} else if(shouldReconnect == 401) {
console.log(colors.red("O qr-code do bot foi desconectado. Re-leia o qr-code novamente."));
exec("cd arquivos && rm -rf qr-code");
} else if(shouldReconnect == 515) {
console.log(colors.yellow("\nA autenticação foi bem sucedida! Resete para estabilizar a conexão."));
} else if(shouldReconnect == 440) {
return console.log(colors.yellow("Está tendo conflito, pode ter uma outra sessão aberta, ou o bot ligado em outro local, caso contrário ignore..."));
} else if(shouldReconnect == 503) {
console.log(colors.red("Erro desconhecido..."));
} else if(shouldReconnect == 502) {
console.log(colors.yellow("Conexão tá querendo cair..."));
} else if(shouldReconnect == 408) {
console.log(colors.yellow("Conexão fraca..."));
} else {
console.log('Conexão Fechada - Erro: ', lastDisconnect?.error);
}
connectToWhatsApp()
}
break;

case 'open':
console.log(banner1.string);
console.log(banner2.string);
await bkz.sendPresenceUpdate("available");
break;

default:
break;
}
}

if (events["creds.update"]) {
await saveCreds();
}
require("./comandos.js")(bkz, pastacode);
});
}
connectToWhatsApp().catch(async(e) => {
console.log(colors.red(`Erro no arquivo: "./conexão.js": ` + e));
});