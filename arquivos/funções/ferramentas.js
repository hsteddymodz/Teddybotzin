const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

const axios = require('axios');
const cfonts = require("cfonts");
const fetch = require('node-fetch');

const getBuffer = async (url, opcoes) => {
try {
opcoes ? opcoes : {}
const post = await axios({
method: "get",
url,
headers: {
'user-agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.128 Safari/537.36', 
'DNT': 1,
'Upgrade-Insecure-Request': 1
},
...opcoes,
responseType: 'arraybuffer'
})
return post.data
} catch (e) {
console.log(e)
}}

const getFileBuffer = async (mediakey, MediaType) => {
const stream = await downloadContentFromMessage(mediakey, MediaType);
let buffer = Buffer.from([]);
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])}
return buffer
}

const fetchJson = (url, options) => new Promise(async (resolve, reject) => {
fetch(url, options)
.then(response => response.json())
.then(json => {
resolve(json)
})
.catch((err) => {
reject(err)
})
});

function getGroupAdmins(participants) {
admins = []
for (let i of participants) {
if (i.admin == 'admin') admins.push(i.id)
if (i.admin == 'superadmin') admins.push(i.id)}
return admins
}

const banner1 = cfonts.render("Bkz-Base|3.0.0", { font: "tiny", align: "center", gradient: ["magenta", "red"]});

const banner2 = cfonts.render(("Conectado com sucesso!"), { font: 'console', align: 'center', gradient: ['red', 'magenta']});

module.exports = { getBuffer, getFileBuffer, fetchJson, getGroupAdmins, banner1, banner2 }