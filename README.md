# socket.io-wrapper
simple socket.io wrapper for node.js

# To install wrapper use this cmd:
```bash
npm i node-socket-io-wrapper --save
```
# Server sample using Express.js

server.js on backend side
```js
const app = require('express')();
const http = require('http').Server(app);
const io = require('node-socket-io-wrapper')(http);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

http.listen(3000);

const event = ['hello', {message:'hello'}];
const handler = ['frontend:message', console.log]

setInterval(()=> {
    io.emitBroadcast(event);
},3000);

io.inject(handler);
io.emitTo(socketId, event);

```

index.html simple client for testing

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.1.1/socket.io.dev.js"></script>


<script>
    const client = io('http://localhost:3000');

    client.on('connect', () => {
        console.log('Connected')
    });

    client.on('hello', m => console.log(m));
</script>
```

#Middlewares and session callbacks (optional)

```js

/*
    io.use(function(socket, next){})
    to apply put array of your middlewares to constructor
*/

const params =  {
      middlewares,    // array of middlewares callbacks
      updateSession,  // session update callback, function updateSession (sessionid) {your code}
      clearSession    // clear session callback,  function clearSession (sessionid) {your code} 
    };

const io = require('node-socket-io-wrapper')(http, params);
```
