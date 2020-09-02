const document = require('./document');

class MediaStream {

}

class Image {

}

class HTMLMediaElement {
  setSinkId() {}
}

const navigator = {
  mediaDevices: {
    enumerateDevices() {},
    getUserMedia() {},
  },
};

const localStorage = {
  _catch: {},
  setItem(item, data) {
    this._catch[item] = typeof data === 'object' ? JSON.stringify(data) : data;
  },
  getItem(item) {
    return this._catch[item];
  },
};

const extendWith = {
  navigator,
  localStorage,
  MediaStream,
  HTMLMediaElement,
  document,
  setInterval: setInterval,
  clearInterval: clearInterval,
};

global.window = global;

Object.assign(global, {
  ...extendWith,
});
