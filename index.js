const discord_ws = require('ws');
const msg = require('./src/discord_api/delete.js')

// the suffix of your command eg '.d'
let suffix = '.'

const discord = new discord_ws('wss://gateway.discord.gg/?v=8&encoding=json')

let interval = 0
let seq_num = 0

let fetchVal = ''
let user = []

/* fetch has a tendency to throw warnings with certain header conditions*/
process.removeAllListeners('warning')

/* put your authentication token here ! */
authentication_token = ''

payload = {
	op:2,
	d: {
		token: authentication_token,
		intents: 131071,
		properties: {
			$os: 'linux',
			$browser: 'my_library',
			$device: 'my_library'
		}
	}
}

discord.on('open', function open() {
	discord.send(JSON.stringify(payload))
})

discord.on('message', function incoming(data) {
	let payload = JSON.parse(data)
	
	//console.log(payload)
	const {t, event, op, d} = payload;

	switch(op) {
		case 0:
			/* change sequence number dependent on the
			   number of events */
			seq_num = payload.s
			break;
		case 1:
			/* handle a requested heartbeat */
			discord.send(JSON.stringify({op:1, d: seq_num}))
			break;
		case 10:
			const { heartbeat_interval } = d;
			interval = heartbeat(heartbeat_interval)
			break;
	}

	switch(t) {
		case 'READY':
			user.push(payload.d.user.id)
			break;
		case 'MESSAGE_CREATE':

			let me = user[0]
			let content = payload.d.content
			let author = payload.d.author.id
			let channel = payload.d.channel_id

			//console.log(content)

			if (content == `${suffix}d` && author == me) {
				message_count = 0
				msgFetch(channel)
			}
			break;

	}
})

const heartbeat = (ms) => {
	return setInterval(() => {
		discord.send(JSON.stringify({op:1, d: seq_num}))
		//console.log('heartbeat sent here.')
	}, ms)
}

function msgFetch(channel_id) {
	fetch(`https://canary.discord.com/api/v9/channels/${channel_id}/messages?${fetchVal}limit=100`, {
	  "headers": {
	    "accept": "*/*",
	    "accept-language": "en-GB",
	    "authorization": `${authentication_token}`,
	    "sec-ch-ua": "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\"",
	    "sec-ch-ua-mobile": "?0",
	    "sec-ch-ua-platform": "\"Windows\"",
	    "sec-fetch-dest": "empty",
	    "sec-fetch-mode": "cors",
	    "sec-fetch-site": "same-origin",
	    "x-debug-options": "bugReporterEnabled",
	    "x-discord-locale": "en-GB",
	    "x-super-properties": "eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiRGlzY29yZCBDbGllbnQiLCJyZWxlYXNlX2NoYW5uZWwiOiJjYW5hcnkiLCJjbGllbnRfdmVyc2lvbiI6IjEuMC41NyIsIm9zX3ZlcnNpb24iOiIxMC4wLjE5MDQ1Iiwib3NfYXJjaCI6Ing2NCIsInN5c3RlbV9sb2NhbGUiOiJlbi1HQiIsImNsaWVudF9idWlsZF9udW1iZXIiOjE3ODYzNCwibmF0aXZlX2J1aWxkX251bWJlciI6MzAyNzAsImNsaWVudF9ldmVudF9zb3VyY2UiOm51bGwsImRlc2lnbl9pZCI6MH0="
	  },
	  "referrer": "https://canary.discord.com/channels/@me",
	  "referrerPolicy": "strict-origin-when-cross-origin",
	  "body": null,
	  "method": "GET",
	  "mode": "cors",
	  "credentials": "include"
	}).then(res => Promise.all([res.status, res.json()])).then(async ([status, jsonMessages]) => {

		console.log(`Fetching \x1b[94mDiscord \x1b[97mmessages...\x1b[0m`)
		fetchVal = ''
		
		for (let i = 0; i < jsonMessages.length; i++) {

			if (i == jsonMessages.length - 1 && jsonMessages.length != 0) {
				fetchVal = `before=${jsonMessages[i].id}&`
				msgFetch(channel_id)
			}

			if (jsonMessages[i].author.id == user[0] && (jsonMessages[i].type == 0 || jsonMessages[i].type == 19)) {
				while (true) {
					let value = await msg.delete(channel_id, jsonMessages[i].id)
					if (value == 'true') {
						break;
					}
				}
			}
		}
		jsonMessages.length = 0
	});
}