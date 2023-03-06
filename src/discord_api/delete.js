let message_count = 0

module.exports = {

	message_count,

	delete: async function msgDelete(chan_id, message_id) {
		let response = await fetch(`https://canary.discord.com/api/v9/channels/${chan_id}/messages/${message_id}`, {
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
		  "method": "DELETE",
		  "mode": "cors",
		  "credentials": "include"
		})
	
		let json = await response.json().catch(e => { return null })
		if (json) {
	
			/* exclude all discord system messages.. */
			if (json.message == "Cannot execute action on a system message") {
				return 'true'
			}
	
			let retry_time = json.retry_after * 1000
			console.log(`\x1b[93m${message_id} \x1b[97mis being rate limited for \x1b[91m${retry_time}\x1b[0m`)
			await new Promise(resolve => setTimeout(resolve, retry_time));
			return 'fail'
		} else {
			message_count++
			console.log(`\x1b[97m[\x1b[95m${message_count}\x1b[97m] \x1b[93m${message_id} \x1b[97mhas been \x1b[92mdeleted!\x1b[0m`)
			return 'true'
		}
	
	}
}