const io = require('socket.io');

class ioWrapper {

    constructor(app, { middlewares, updateSession, clearSession } = {}) {

        this.io = io(app);
        this.connected = {};

        /*
            io.use(function(socket, next){})
            to apply put array of your middlewares to constructor
        */

        if (middlewares && middlewares.length) {
            for (const middleware of middlewares) {
                this.io.use(middleware);
            }
        }

        this.io.on('connect', client => {

            //put callback to constructor to update your session

            if (updateSession) {
                updateSession(client.id);
            }

            this.connected[client.id] = client;

            client.on('disconnect', () => {
                //clear your redis session etc...

                if (clearSession) {
                    clearSession(client.id);
                }

                if (this.connected[client.id]) {
                    delete this.connected[client.id];
                }
            });

            client.on('error', e => console.log(e));
            client.on('connect_error', e => console.log('connect_error', e));

        });

        this.emitTo = this.emitTo.bind(this);
        this.inject = this.inject.bind(this);
        this.emitBroadcast = this.emitBroadcast.bind(this);
    }

    /*
        socketId id of connection
        event - array ['event_name', ()=>{ handler callback }]
    */

    emitTo(socketId, event) {
        try {
            if (this.connected[socketId]) {
                this.connected[socketId].emit(...event);
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    emitBroadcast(event) {
        this.io.emit(...event);
    }

    /*
        socketId id of connection
        handler - array ['event_name', ()=>{ handler callback }]
    */

    inject(socketId, handler) {
        try {
            if (this.connected[socketId]) {
                this.connected[socketId].on(...handler);
            }
        }
        catch (e) {
            console.log(e);
        }
    }
}

module.exports = (app, middleware, updateSession) => new ioWrapper(app, middleware, updateSession);