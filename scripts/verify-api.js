const http = require('http');

const endpoints = [
  'banners',
  'products/categories',
  'products',
  'festivals',
  'panchangs',
  'horoscopes',
  'pooja-vidhis',
  'pandits/approved',
  'consultancy-services'
];

async function checkEndpoint(ep) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3001/api/${ep}`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const count = Array.isArray(parsed) ? `${parsed.length} items` : typeof parsed;
          resolve({ endpoint: `/api/${ep}`, status: res.statusCode, count });
        } catch (e) {
          resolve({ endpoint: `/api/${ep}`, status: res.statusCode, error: e.message });
        }
      });
    }).on('error', (err) => {
      resolve({ endpoint: `/api/${ep}`, error: err.message });
    });
  });
}

async function main() {
  console.log('--- Testing Backend Live Endpoints ---');
  for (const ep of endpoints) {
    const result = await checkEndpoint(ep);
    console.log(result.endpoint, '-> Status:', result.status, 'Data:', result.count || result.error);
  }
}

main();
