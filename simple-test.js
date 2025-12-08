const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('<h1>Test server is working!</h1>');
});

const port = 3000;
server.listen(port, () => {
    console.log(`Test server running on http://localhost:${port}`);
    console.log('Press Ctrl+C to stop');
});
