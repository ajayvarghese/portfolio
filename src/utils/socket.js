import io from 'socket.io-client';
import { config } from './../constants'


import('socket.io-client').then(r => console.log('SOCKET', r));

let socket = null;

export function socketDisconnect() {
  if (socket)
    socket.disconnect();
}

export function connectSocket(cb = {}) {
  socket = io.connect(config.socketURL);

  socket.on('connect', function() {
    console.info('Socket: connected');
    socket.emit('test', { data: 'I\'m connected y\'all!!' });
    cb.connect && cb.connect();
  });

  socket.on('my response', function() {
    console.info('Socket: on connect Emit');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket: CONNECT ERROR', error);
    cb.connect_error && cb.connect_error(error);
  });

  socket.on('error', (error) => {
    console.error('Socket: ERROR', error);
    cb.error && cb.error(error);
  });

  socket.on('connect_timeout', (timeout) => {
    console.error('Socket: CONNECT TIMEOUT', timeout);
    cb.connect_timeout && cb.connect_timeout(timeout);
  });

  socket.on('disconnect', (reason) => {
    console.info('DISCONNECT', reason);
    cb.disconnect && cb.disconnect(reason);
    if (reason === 'io server disconnect') {
      // the disconnection was initiated by the server, you need to reconnect manually
      socket.connect();
    }
    // else the socket will automatically try to reconnect
  });
}

export default function socketHandler(cb) {
  const attachListeners = () => {
    if (typeof cb === 'object') {
      for (let key in cb) {
        if(!socket._callbacks[`$${key}`]) {
          socket.on(key, function(msg) {
            cb[key](msg);
          });
        }
      }
      console.info('Socket: Listeners attached');
    } else {
      console.error('Socket: Listener function Format Invalid');
    }
  };
  if (socket && socket.connected) {
    attachListeners();
  } else {
    console.log('Socket: Waiting to attach listeners...');
    const timer = window.setInterval(() => {
      if (socket && socket.connected) {
        attachListeners();
        clearInterval(timer);
      }
    }, 500);
  }
}

export function detachSocketListeners(cb) {
  const detachListeners = () => {
    if (typeof cb === 'object') {
      for (let key in cb) {
        socket.removeListener(key, function(msg) {
          cb[key](msg);
        });
      }
      console.info('Socket: Listeners Detached');
    } else {
      console.error('Socket: Detach Listener function Format Invalid');
    }
  };
  if (socket && socket.connected) {
    detachListeners();
  } else {
    console.log('Socket: Waiting to Detach listeners...');
    const timer = window.setInterval(() => {
      if (socket && socket.connected) {
        detachListeners();
        clearInterval(timer);
      }
    }, 500);
  }
}
