'use strict';

const common = require('../common');
const http = require('http');
const net = require('net');
const assert = require('assert');

const reqstr = 'HTTP/1.1 200 OK\r\n' +
               'Foo: Bar\r' +
               'Content-Length: 1\r\n\r\n';

const server = net.createServer((socket) => {
  socket.write(reqstr);
});

server.listen(0, () => {
  // The callback should not be called because the server is sending a
  // header field that ends only in \r with no following \n
  const req = http.get({port: server.address().port}, (res) => {
    common.fail('callback should not be called');
  });
  req.on('error', common.mustCall((err) => {
    assert(/^Parse Error/.test(err.message));
    assert.equal(err.code, 'HPE_LF_EXPECTED');
    server.close();
  }));
});
