window.onMessage = function (name, callback) {
  window.onMessage[name] = window.onMessage[name] || [];
  const msgs = Array.prototype.slice.call(window.onMessage[name]);
  msgs.push(callback);
};

window.sendMessage = function (name, param) {
  const msgs = window.onMessage[name] || [];
  msgs.forEach((msg) => {
    msg(param);
  });
};
