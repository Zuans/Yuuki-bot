"use strict";

var _require = require('discord.js'),
    MessageCollector = _require.MessageCollector;

var msgCollectorFilter = function msgCollectorFilter(newMsg, originalMsg) {
  console.log('test');
  console.log(newMsg.author.id, originalMsg.author.id);
  if (newMsg.author.id !== originalMsg.author.id) return;
  console.log();
  return true;
};

module.exports = {
  initReact: function initReact(client, message, args) {
    var fetchMessage, collector, msg;
    return regeneratorRuntime.async(function initReact$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(args.length !== 1)) {
              _context.next = 4;
              break;
            }

            return _context.abrupt("return", message.channel.send('Too many arguments you should send 2 arguments').then(function (msg) {
              return msg["delete"]({
                timeout: 3000
              });
            })["catch"](function (err) {
              return console.log(err);
            }));

          case 4:
            _context.prev = 4;
            _context.next = 7;
            return regeneratorRuntime.awrap(message.channel.messages.fetch(args[0]));

          case 7:
            fetchMessage = _context.sent;

            if (!fetchMessage) {
              _context.next = 16;
              break;
            }

            console.log('Message found');
            collector = new MessageCollector(message.channel, msgCollectorFilter.bind(null, message));
            message.channel.send('Please provide all of emoji with role name!');
            collector.on('collect', function (msg) {
              console.log("".concat(msg.content, " was collect"));
            });
            return _context.abrupt("return");

          case 16:
            console.log('Message not found');

          case 17:
            _context.next = 26;
            break;

          case 19:
            _context.prev = 19;
            _context.t0 = _context["catch"](4);
            console.log(_context.t0);
            _context.next = 24;
            return regeneratorRuntime.awrap(message.channel.send('Invalid id please try again'));

          case 24:
            msg = _context.sent;
            msg["delete"]({
              timeout: 5000
            });

          case 26:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[4, 19]]);
  },
  description: 'Create init for reaction'
};