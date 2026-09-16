const http = require('http');

function postJson(path, payload) {
  return new Promise((resolve) => {
    const data = JSON.stringify(payload);
    const req = http.request({
      hostname: 'localhost',
      port: 3001,
      path: '/api/' + path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    }, (res) => {
      let body = '';
      res.on('data', (c) => body += c);
      res.on('end', () => {
        resolve({ status: res.statusCode, body: body.slice(0, 200) });
      });
    });
    req.on('error', (err) => resolve({ error: err.message }));
    req.write(data);
    req.end();
  });
}

async function testAuth() {
  console.log('Testing /api/auth/login:', await postJson('auth/login', { email: 'admin@hargharmandir.com', password: 'password123' }));
  console.log('Testing /api/auth/register:', await postJson('auth/register', { name: 'Test Devotee', email: 'devotee1@example.com', password: 'password123' }));
}

testAuth();
