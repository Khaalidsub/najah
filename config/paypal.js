const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

/**
 *
 * Returns PayPal HTTP client instance with environment that has access
 * credentials context. Use this instance to invoke PayPal APIs, provided the
 * credentials have access.
 */
function client() {
	return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

/**
 *
 * Set up and return PayPal JavaScript SDK environment with PayPal access credentials.
 * This sample uses SandboxEnvironment. In production, use LiveEnvironment.
 *
 */
function environment() {
	let clientId =
		process.env.PAYPAL_CLIENT_ID ||
		'AaDbTMPqa-qmwru59XtFjHi3BXjuzcnrQ_hdEDU5my6CK4NNfI3J6LC8DdURCziJSMaYSrKDJoJq2sGI';
	let clientSecret =
		process.env.PAYPAL_CLIENT_SECRET ||
		'EOC6PlkJunX7nc7hu5MPV6TY159MXfNgUf07FgvIwaRsek4hIXw5pPSS_0EIwe2jLQdfnVnJgwt17Lt8';

	return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
}

async function prettyPrint(jsonData, pre = '') {
	let pretty = '';
	function capitalize(string) {
		return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
	}
	for (let key in jsonData) {
		if (jsonData.hasOwnProperty(key)) {
			if (isNaN(key)) pretty += pre + capitalize(key) + ': ';
			else pretty += pre + (parseInt(key) + 1) + ': ';
			if (typeof jsonData[key] === 'object') {
				pretty += '\n';
				pretty += await prettyPrint(jsonData[key], pre + '    ');
			} else {
				pretty += jsonData[key] + '\n';
			}
		}
	}
	return pretty;
}

module.exports = { client: client, prettyPrint: prettyPrint };
