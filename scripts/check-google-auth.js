const http = require('http');

function checkRoute(path) {
  return new Promise((resolve) => {
    http.get(`http://localhost:3001/api/${path}`, (res) => {
      resolve({ path, status: res.statusCode });
    }).on('error', (e) => resolve({ path, error: e.message }));
  });
}

async function test() {
  console.log(await checkRoute('auth/google'));
  console.log(await checkRoute('auth/google/callback'));
}

test();
