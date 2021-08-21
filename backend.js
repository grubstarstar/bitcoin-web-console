const { exec } = require('child_process');
const https = require('https')
const currency = require("currency.js")

function isBitcoindRunning() {

return new Promise((resolve, reject) => {
	exec('ps -ejf | grep [b]itcoin', (err, stdout, stderr) => {
  if (err) {
	console.log("Huh?")
	  resolve(false)
    // node couldn't execute the command
    return;
  }
if(stdout) {
	console.log("Is running")
	resolve(true)
} else {
	
	console.log("Is not running")
	resolve(false)
}
  // the *entire* stdout and stderr (buffered)
  //console.log(`stdout: ${stdout}`);
  //console.log(`stderr: ${stderr}`);
});
})

}



function getBitcoinPrice() {
	// curl
// -H "X-CMC_PRO_API_KEY: cf8fd18f-ae28-46d9-9d20-3abc233bb66a"
// -H "Accept: application/json"
// -d "symbol=BTC&convert=AUD"
// -G https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest
const options = {
  hostname: 'pro-api.coinmarketcap.com',
  port: 443,
  path: '/v1/cryptocurrency/quotes/latest?symbol=BTC&convert=AUD',
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'X-CMC_PRO_API_KEY': "cf8fd18f-ae28-46d9-9d20-3abc233bb66a"
  }
}

const req = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`)
let data = ""
  res.on('data', d => {
data = data + d.toString()
  })

res.on('end', () => {
const json = JSON.parse(data);
const quote = json.data["BTC"].quote
	Object.keys(quote["AUD"]).forEach(q => {
		console.log(q, currency(quote["AUD"][q]).format())
	})
})
req.on('error', error => {
  console.error(error)
})
})
req.end()

}

const isIt = isBitcoindRunning().then(result => {
	
console.log("is it?", result ? "Yes" : "No")

	getBitcoinPrice();
})

