const express = require('express');
const morgan = require('morgan');
const globalErrorHandler = require('./controllers/errorController');

const doctorRouter = require('./routes/doctorsRoutes');

const app = express();

app.get('/', (req, res) => {
  res.status(200);
  res.json({
    status: 'success',
    data: 'Homepage',
  });
});

// middlewares
// 3rd party middlewares
// body parser middleware
app.use(express.json());
app.use(morgan('dev'));

//Routes
app.use('/api/v2/doctors', doctorRouter);

// handler function for unhandled routes
app.all('*wildcard', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl}  on this server`,
  });
});

// Global Error Handling Middleware
app.use(globalErrorHandler);
module.exports = app;
/////////////////////////////////////////////////////////////////////////////////////
/*
const fs = require('fs');
const http = require('http');
const stream = fs.createWriteStream('./large.file');

for (let i = 0; i < 1e6; i++) {
  stream.write(
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n'
  );
}
stream.end();

const server = http.createServer((req, res) => {
  const readStream = fs.createReadStream('./large.file', 'utf-8');
  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Content-Encoding': 'identity', // or gzip later
    'Transfer-Encoding': 'chunked',
  });
  readStream.pipe(res);
});
server.listen(3000);
const fs = require('fs');

console.log('🟢 1. Start of script');

setTimeout(() => {
  console.log('⏱  5. Timeout callback (Timers Phase)');
}, 0);

setImmediate(() => {
  console.log('⚡ 6. setImmediate callback (Check Phase)');
});

fs.readFile(__filename, () => {
  console.log('📄 7. File read complete (Poll Phase)');

  setTimeout(() => {
    console.log('⏱  11. Timeout inside fs.readFile (Timers Phase)');
  }, 0);

  setImmediate(() => {
    console.log('⚡ 10. setImmediate inside fs.readFile (Check Phase)');
  });

  process.nextTick(() => {
    console.log('⏭️  8. nextTick inside fs.readFile (Microtask)');
  });

  Promise.resolve().then(() => {
    console.log('✅ 9. Promise inside fs.readFile (Microtask)');
  });
});

process.nextTick(() => {
  console.log('⏭️  3. nextTick (Microtask)');
});

Promise.resolve().then(() => {
  console.log('✅ 4. Promise (Microtask)');
});

console.log('🔴 2. End of script');
*/

/*
const fs = require('fs');

console.log('🟢 1. Start of script');

setTimeout(() => {
  console.log('⏱  5. Timeout callback (Timers Phase)');
}, 0);

setImmediate(() => {
  console.log('⚡ 6. setImmediate callback (Check Phase)');
});

// Synchronous read (Blocking)
fs.readFileSync(__filename);

process.nextTick(() => {
  console.log('⏭️  3. nextTick (Microtask)');
});

Promise.resolve().then(() => {
  console.log('✅ 4. Promise (Microtask)');
});

console.log('🔴 2. End of script');
*/
/*
console.log('🟢 1. Start');

setTimeout(() => {
  console.log('⏱  5. Timeout');
}, 0);

Promise.resolve().then(() => {
  console.log('✅ 4. Promise');
});

process.nextTick(() => {
  console.log('⏭️  3. nextTick');
});

console.log('🔴 2. End');
*/
/*
setTimeout(() => {
  console.log('⏱  1. Outer Timeout');

  setTimeout(() => {
    console.log('⏱  3. Inner Timeout');
  }, 0);

  setImmediate(() => {
    console.log('⚡ 2. Inner setImmediate');
  });
}, 0);
*/
/*
const start = Date.now();
console.log('🟢 1. Start');

setTimeout(() => {
  console.log('⏱  3. Timeout after block');
}, 0);

while (Date.now() - start < 1000) {
  // Blocking for 1 second
}

console.log('🔴 2. Done blocking');
*/
/*
const fs = require('fs');

fs.readFile(__filename, () => {
  console.log('📄 3. Finished reading file');

  setTimeout(() => {
    console.log('⏱  5. Timeout inside readFile');
  }, 0);

  setImmediate(() => {
    console.log('⚡ 4. Immediate inside readFile');
  });
});

setTimeout(() => {
  console.log('⏱  1. Outside timeout');
}, 0);

setImmediate(() => {
  console.log('⚡ 2. Outside immediate');
});
*/
/*
setTimeout(() => {
  console.log('⏱  1. Start long task');

  const start = Date.now();
  while (Date.now() - start < 1000) {} // block for 1s

  console.log('⏱  2. End long task');
}, 0);

setImmediate(() => {
  console.log('⚡ 3. Immediate after blocking');
});
*/
/*
const fs = require('fs');

console.log('🔵 1. Start');

setTimeout(() => {
  console.log('⏱  5. Timer 1 (Timers phase)');
}, 0);

setImmediate(() => {
  console.log('⚡ 6. setImmediate 1 (Check phase)');
});

fs.readFile(__filename, () => {
  console.log('📄 7. File Read Callback (Poll phase)');

  setTimeout(() => {
    console.log('⏱  11. Timer 2 inside fs.readFile (Timers phase)');
  }, 0);

  setImmediate(() => {
    console.log('⚡ 10. setImmediate 2 inside fs.readFile (Check phase)');
  });

  process.nextTick(() => {
    console.log('🔁 8. nextTick inside fs.readFile (Microtask)');
  });

  Promise.resolve().then(() => {
    console.log('✅ 9. Promise inside fs.readFile (Microtask)');
  });
});

process.nextTick(() => {
  console.log('🔁 3 .nextTick (Microtask)');
});

Promise.resolve().then(() => {
  console.log('✅ 4. Promise (Microtask)');
});

console.log('🔴 2. End');
*/
/*
const fs = require('fs');

fs.readFile(__filename, () => {
  console.log('📄 4. File read complete (Poll phase)');
});

setImmediate(() => {
  console.log('⚡ 3. setImmediate (Check phase)');
});

setTimeout(() => {
  console.log('⏱  2. setTimeout (Timers phase)');
}, 0);

const start = Date.now();
while (Date.now() - start < 500) {} // Blocking loop

console.log('🔴 1. End of script');
*/
/*
const net = require('net');

const server = net.createServer((socket) => {
  socket.end('Goodbye\n');
});

server.listen(8080, () => {
  const client = net.connect(8080);
  client.on('data', (data) => {
    console.log('📩 Received:', data.toString());
  });

  client.on('end', () => {
    console.log('🔒 Client disconnected (Close callback phase)');
  });
});
*/
/*
setTimeout(() => {
  console.log('⏱  3. Timeout 1');

  Promise.resolve().then(() => {
    console.log('✅ 4. Promise inside Timeout 1');

    setTimeout(() => {
      console.log('⏱  5. Timeout 2');
    }, 0);
  });
}, 0);

Promise.resolve().then(() => {
  console.log('✅ 2. Top-level Promise');
});

console.log('🔵 1. Synchronous code');
*/
/*
console.log('🟢 1. Start');

setTimeout(() => {
  console.log('⏱  6. Timeout');
}, 0);

setImmediate(() => {
  console.log('⚡ 5. setImmediate');
});

Promise.resolve().then(() => {
  console.log('✅ 4. Promise');
});

process.nextTick(() => {
  console.log('🔁 3. nextTick');
});

const start = Date.now();
while (Date.now() - start < 1000) {} // Simulate CPU-heavy task

console.log('🔴 2. End');
*/
/*
const fs = require('fs');

console.log('🟢 1. Start');

fs.readFile(__filename, () => {
  console.log('📄 2. File Read Complete (Poll Phase)');

  setImmediate(() => {
    console.log('⚡ 5. setImmediate (Check Phase)');
  });

  setTimeout(() => {
    console.log('⏱  6. setTimeout (Timers Phase)');
  }, 0);

  process.nextTick(() => {
    console.log('🔁 3. nextTick inside fs.readFile (Microtask)');
  });

  Promise.resolve().then(() => {
    console.log('✅ 4. Promise inside fs.readFile (Microtask)');
  });
});

setImmediate(() => {
  console.log('⚡ 7. setImmediate outside (Check Phase)');
});

console.log('🔴 End');
*/
/*
console.log('🟢 1. Start');

process.nextTick(() => {
  console.log('🔁 3. nextTick 1');

  process.nextTick(() => {
    console.log('🔁 4. nextTick 2');

    process.nextTick(() => {
      console.log('🔁 5. nextTick 3');
    });
  });
});

setTimeout(() => {
  console.log('⏱  6. Timeout');
}, 0);

console.log('🔴 2. End');
*/

/*
const fs = require('fs');

fs.readFile(__filename, () => {
  setTimeout(() => {
    console.log('⏱  2.Timeout inside readFile');
  }, 0);

  setImmediate(() => {
    console.log('⚡ 1. setImmediate inside readFile');
  });
});

*/
/*
console.log('🟢 1. Start');

for (let i = 0; i < 10000; i++) {
  process.nextTick(() => {});
}

setTimeout(() => {
  console.log('⏱  3. Timeout');
}, 0);

console.log('🔴 2. End');
*/
/*
const fs = require('fs');

console.log('🟢 1. Start');

setTimeout(() => {
  console.log('⏱  5. Outer setTimeout (Timers Phase)');

  Promise.resolve().then(() => {
    console.log('✅ 6. Microtask in Outer setTimeout');
  });

  setImmediate(() => {
    console.log('⚡ 8. setImmediate inside setTimeout');
  });
}, 0);

fs.readFile(__filename, () => {
  console.log('📄 9. File Read Complete (Poll Phase)');

  setTimeout(() => {
    console.log('⏱  15. setTimeout inside fs.readFile (Timers Phase)');
  }, 0);

  setImmediate(() => {
    console.log('⚡ 14. setImmediate inside fs.readFile (Check Phase)');
  });

  process.nextTick(() => {
    console.log('🔁 10. nextTick inside fs.readFile');
    process.nextTick(() => {
      console.log('🔁 11. Nested nextTick');
    });
  });

  Promise.resolve().then(() => {
    console.log('✅ 12. Promise inside fs.readFile');
    Promise.resolve().then(() => {
      console.log('✅ 13. Nested Promise');
    });
  });
});

setImmediate(() => {
  console.log('⚡ 7. setImmediate outside (Check Phase)');
});

process.nextTick(() => {
  console.log('🔁 3. nextTick (global)');
});

Promise.resolve().then(() => {
  console.log('✅ 4. Promise (global)');
});

const start = Date.now();
while (Date.now() - start < 100) {} // Simulate 100ms CPU block

console.log('🔴 2. End');
*/

/*
const fs = require('fs');

console.log('🟢 1. Start');

setTimeout(() => {
  //1
  console.log('⏱  5. Outer setTimeout (Timers Phase)');

  process.nextTick(() => {
    console.log('🔁 6. nextTick inside setTimeout');
  });

  Promise.resolve().then(() => {
    console.log('✅ 7. Promise inside setTimeout');
  });

  fs.readFile(__filename, () => {
    //2
    console.log('📄 11. Nested fs.readFile inside setTimeout (Poll Phase)');

    setImmediate(() => {
      //3
      console.log('⚡ 16. setImmediate inside nested fs.readFile');
    });

    process.nextTick(() => {
      console.log('🔁 12. nextTick inside nested fs.readFile');
    });
  });
}, 0);

fs.readFile(__filename, () => {
  //1
  console.log('📄 8. Top-level fs.readFile (Poll Phase)');

  setTimeout(() => {
    //2
    console.log('⏱  13. setTimeout inside top-level fs.readFile');
  }, 0);

  setImmediate(() => {
    //2
    console.log('⚡ 15. setImmediate inside top-level fs.readFile');
  });

  process.nextTick(() => {
    console.log('🔁 9. nextTick inside top-level fs.readFile');
  });

  Promise.resolve().then(() => {
    console.log('✅ 10. Promise inside top-level fs.readFile');
  });
});

setImmediate(() => {
  //1
  console.log('⚡ 14. Top-level setImmediate (Check Phase)');
});

process.nextTick(() => {
  console.log('🔁 3. Global nextTick');
});

Promise.resolve().then(() => {
  console.log('✅ 4. Global Promise');
});

console.log('🔴 2. End');
*/
/*
const fs = require('fs');

console.log('🟢 1. Start');

setTimeout(() => {//1
  console.log('⏰ 2. setTimeout 1 (Timers Phase)');

  Promise.resolve().then(() => {
    console.log('✅ 3. Promise inside setTimeout 1 (Microtask)');
  });

  process.nextTick(() => {
    console.log('🔁 4. nextTick inside setTimeout 1');
  });

  fs.readFile(__filename, () => {//2
    console.log('📄 5. readFile inside setTimeout 1 (Poll Phase)');

    setImmediate(() => {//2
      console.log('⚡ 6. setImmediate inside readFile');
    });
  });
}, 0);

setImmediate(() => {//1
  console.log('⚡ 7. setImmediate 1 (Check Phase)');

  process.nextTick(() => {
    console.log('🔁 8. nextTick inside setImmediate');
  });

  Promise.resolve().then(() => {
    console.log('✅ 9. Promise inside setImmediate');
  });
});

fs.readFile(__filename, () => {//1
  console.log('📄 10. Top-level readFile (Poll Phase)');

  setTimeout(() => {//2
    console.log('⏰ 11. setTimeout inside readFile (Timers Phase)');
  }, 0);
});

process.nextTick(() => {
  console.log('🔁 12. Global nextTick');
});

Promise.resolve().then(() => {
  console.log('✅ 13. Global Promise');
});

console.log('🔴 14. End');
*/

//  🟢 1. Start'
//  🔴 14. End
//  🔁 12. Global nextTick
//  ✅ 13. Global Promise
//  ⏱ 2. setTimeout 1 (Timers Phase)
//  🔁 4. nextTick inside setTimeout
//  ✅ 3. Promise inside setTimeout 1 (Microtask)
//  📄 10. Top-level readFile (Poll Phase)
//  📄 5. readFile inside setTimeout 1 (Poll Phase)
//  ⚡ 7. setImmediate 1 (Check Phase)
//  🔁 8. nextTick inside setImmediate
//  ✅ 9. Promise inside setImmediate
//  ⏰ 11. setTimeout inside readFile (Timers Phase)
//  ⚡ 6. setImmediate inside readFile
/*
const fs = require('fs');
const file = fs.createWriteStream('./big.file');

for (let i = 0; i <= 1e6; i++) {
  file.write(
    'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n'
  );
}

file.end();

*/
