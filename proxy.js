/*const ytdl = require('ytdl-core');
const HttpsProxyAgent = require('https-proxy-agent');

// Remove 'user:pass@' if you don't need to authenticate to your proxy.
const proxy = '';
const agent = HttpsProxyAgent(proxy);

const stream = ytdl('https://www.youtube.com/watch?v=aqz-KE-bpKQ', {
  requestOptions: { agent },
});

console.log('Starting Download');

stream.on('data', chunk => {
  console.log('downloaded', chunk.length);
});

stream.on('error', err => {
  console.error(err);
});

stream.on('end', () => {
  console.log('Finished');
});*/