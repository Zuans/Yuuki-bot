"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ytdl = require('ytdl-core');

var _require = require('./apiv2'),
    getVideoId = _require.getVideoId;

var imgSrc = require('./img');

var Channel = require('./db/Channel-model');

var setImageUrl = function setImageUrl(rarity) {
  var index = Math.floor(Math.random() * imgSrc[rarity].length);
  var img = imgSrc[rarity][index];
  return _objectSpread({}, img, {
    rarity: rarity
  });
};

var imgGacha = function imgGacha() {
  var score = Math.random() * 10;
  var rarity;

  switch (true) {
    case score >= 9.5:
      rarity = 'S';
      break;

    case score >= 7.5:
      rarity = 'A';
      break;

    case score >= 5:
      rarity = 'B';
      break;

    case score >= 1.5:
      rarity = 'C';
      break;

    default:
      rarity = 'D';
  }

  var imgData = setImageUrl(rarity);
  return imgData;
};

var queue = new Map();

var execute = function execute(message) {
  var _len,
      args,
      _key,
      serverQueue,
      voiceChannel,
      permissions,
      song,
      _ref,
      videoId,
      error,
      msg,
      songInfo,
      queueConstruct,
      connection,
      _args = arguments;

  return regeneratorRuntime.async(function execute$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          for (_len = _args.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = _args[_key];
          }

          serverQueue = queue.get(message.guild.id);
          args = args.join(" ");
          voiceChannel = message.member.voice.channel;

          if (voiceChannel) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return", message.channel.send('You must join voice channel'));

        case 6:
          permissions = voiceChannel.permissionsFor(message.client.user);

          if (!(!permissions.has("SPEAK") || !permissions.has("CONNECT"))) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", message.channel.send("i need permissions to join your channel"));

        case 9:
          _context.prev = 9;
          _context.next = 12;
          return regeneratorRuntime.awrap(getVideoId(args));

        case 12:
          _ref = _context.sent;
          videoId = _ref.videoId;
          error = _ref.error;
          console.log(error);

          if (!error) {
            _context.next = 21;
            break;
          }

          _context.next = 19;
          return regeneratorRuntime.awrap(message.channel.send(error));

        case 19:
          msg = _context.sent;
          return _context.abrupt("return");

        case 21:
          _context.next = 23;
          return regeneratorRuntime.awrap(ytdl.getInfo(videoId));

        case 23:
          songInfo = _context.sent;
          song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url
          };
          _context.next = 32;
          break;

        case 27:
          _context.prev = 27;
          _context.t0 = _context["catch"](9);
          _context.next = 31;
          return regeneratorRuntime.awrap(message.channel.send(_context.t0));

        case 31:
          console.log(_context.t0);

        case 32:
          if (serverQueue) {
            _context.next = 54;
            break;
          }

          queueConstruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            songs: [],
            connection: null,
            volume: 5,
            playing: true
          }; // Set new guild on queue with queue as the constructor

          queue.set(message.guild.id, queueConstruct);
          console.log('song masuk');
          console.log(song); // add song to queue;

          queueConstruct.songs.push(song); // try connect to voice channel

          _context.prev = 38;
          _context.next = 41;
          return regeneratorRuntime.awrap(voiceChannel.join());

        case 41:
          connection = _context.sent;
          queueConstruct.connection = connection;
          console.log('coba play');
          play(message, queueConstruct.songs[0]);
          _context.next = 52;
          break;

        case 47:
          _context.prev = 47;
          _context.t1 = _context["catch"](38);
          console.log(_context.t1);
          queue["delete"](message.guild.id);
          return _context.abrupt("return", message.channel.send(_context.t1));

        case 52:
          _context.next = 60;
          break;

        case 54:
          if (!(serverQueue.voiceChannel.id != voiceChannel.id)) {
            _context.next = 56;
            break;
          }

          return _context.abrupt("return", message.channel.send('The bot already using in another channel').then(function (msg) {
            return msg["delete"]({
              timeout: 5000
            });
          })["catch"](function (err) {
            return console.log(err);
          }));

        case 56:
          console.log('test added');
          serverQueue.songs.push(song);
          console.log(serverQueue.songs);
          return _context.abrupt("return", message.channel.send("\"".concat(song.title, "\" has been added in queue!")));

        case 60:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[9, 27], [38, 47]]);
};

var skip = function skip(message) {
  var voiceChannel, serverQueue, msg, _msg, _msg2;

  return regeneratorRuntime.async(function skip$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          voiceChannel = message.member.voice.channel;
          serverQueue = queue.get(message.guild.id);

          if (voiceChannel) {
            _context2.next = 9;
            break;
          }

          _context2.next = 5;
          return regeneratorRuntime.awrap(message.channel.send('You must join the voice channel'));

        case 5:
          msg = _context2.sent;
          _context2.next = 8;
          return regeneratorRuntime.awrap(msg["delete"]({
            timeout: 5000
          })["catch"](function (err) {
            return console.log(err);
          }));

        case 8:
          return _context2.abrupt("return", _context2.sent);

        case 9:
          if (serverQueue) {
            _context2.next = 16;
            break;
          }

          _context2.next = 12;
          return regeneratorRuntime.awrap(message.channel.send('Nothing song i can skip'));

        case 12:
          _msg = _context2.sent;
          _context2.next = 15;
          return regeneratorRuntime.awrap(_msg["delete"]({
            timeout: 5000
          })["catch"](function (err) {
            return console.log(err);
          }));

        case 15:
          return _context2.abrupt("return", _context2.sent);

        case 16:
          _context2.prev = 16;
          _context2.next = 19;
          return regeneratorRuntime.awrap(serverQueue.connection.dispatcher.end());

        case 19:
          _context2.next = 21;
          return regeneratorRuntime.awrap(message.channel.send('Succesfully skiped song!'));

        case 21:
          _msg2 = _context2.sent;
          _context2.next = 24;
          return regeneratorRuntime.awrap(_msg2["delete"]({
            timeout: 5000
          })["catch"](function (err) {
            return console.log(err);
          }));

        case 24:
          _context2.next = 29;
          break;

        case 26:
          _context2.prev = 26;
          _context2.t0 = _context2["catch"](16);
          console.log(_context2.t0);

        case 29:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[16, 26]]);
};

var stop = function stop(message) {
  var voiceChannel, serverQueue, msg;
  return regeneratorRuntime.async(function stop$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          voiceChannel = message.member.voice.channel;
          console.log(message.guild.id);
          serverQueue = queue.get(message.guild.id);

          if (voiceChannel) {
            _context3.next = 9;
            break;
          }

          _context3.next = 6;
          return regeneratorRuntime.awrap(message.channel.send('You must join voice channel !'));

        case 6:
          msg = _context3.sent;
          _context3.next = 9;
          return regeneratorRuntime.awrap(msg["delete"]({
            timeout: 5000
          })["catch"](function (err) {
            return console.log(err);
          }));

        case 9:
          serverQueue.songs = [];
          _context3.next = 12;
          return regeneratorRuntime.awrap(serverQueue.connection.dispatcher.end());

        case 12:
          message.channel.send('Stopped playing');

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  });
};

var play = function play(message, song) {
  var serverQueue, dispatcher;
  return regeneratorRuntime.async(function play$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          serverQueue = queue.get(message.guild.id);
          console.log(song);

          if (song) {
            _context4.next = 6;
            break;
          }

          serverQueue.voiceChannel.leave();
          queue["delete"](message.guild.id);
          return _context4.abrupt("return");

        case 6:
          ;
          dispatcher = serverQueue.connection.play(ytdl(song.url)).on('finish', function () {
            serverQueue.songs.shift();
            play(message, serverQueue.songs[0]);
          }).on('end', function () {
            serverQueue.songs.shift();
            play(message, serverQueue.songs[0]);
          }).on('error', function (err) {
            message.channel.send('Ups somwthing when wrong..');
            console.log(err);
            clearQueue(message);
          });
          dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
          77;
          return _context4.abrupt("return", serverQueue.textChannel.send("Now Listen ".concat(song.title)));

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  });
};

var clearQueue = function clearQueue(message) {
  var voiceChannel = message.member.voice.channel;

  if (voiceChannel) {
    queue["delete"](message.guild.id);
    return voiceChannel.leave();
  }
};

var createRole = function createRole(message, name, color) {
  var roleExist;
  return regeneratorRuntime.async(function createRole$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          roleExist = message.guild.roles.cache.find(function (role) {
            return role.name == name;
          });

          if (!roleExist) {
            _context5.next = 3;
            break;
          }

          return _context5.abrupt("return", message.channel.send('This role name already exist please use another name!'));

        case 3:
          _context5.prev = 3;
          _context5.next = 6;
          return regeneratorRuntime.awrap(message.guild.roles.create({
            data: {
              name: name,
              color: color.toUpperCase()
            }
          }));

        case 6:
          return _context5.abrupt("return", message.channel.send("Success create role: ".concat(name, " !")));

        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](3);
          console.log(_context5.t0);

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[3, 9]]);
};

var deleteRole = function deleteRole(message, guildId, role) {
  var data, msg;
  return regeneratorRuntime.async(function deleteRole$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(Channel.updateOne({
            _id: guildId
          }, {
            $pull: {
              "roles": {
                roleId: role.id
              }
            }
          }));

        case 3:
          data = _context6.sent;

          if (!message) {
            _context6.next = 9;
            break;
          }

          _context6.next = 7;
          return regeneratorRuntime.awrap(message.channel.send("Successfully deleted ".concat(role.name)));

        case 7:
          msg = _context6.sent;
          msg["delete"]({
            timeout: 5000
          });

        case 9:
          return _context6.abrupt("return");

        case 12:
          _context6.prev = 12;
          _context6.t0 = _context6["catch"](0);
          console.log(_context6.t0);

        case 15:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var getAllRole = function getAllRole(message) {
  var roles, roleList, msg;
  return regeneratorRuntime.async(function getAllRole$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(Channel.findById(message.guild.id).map(function (data) {
            return data.roles;
          }));

        case 2:
          roles = _context7.sent;
          roleList = roles.map(function (data) {
            var role = message.guild.roles.cache.get(data.roleId);
            var emote = message.guild.emojis.cache.get(data.emoteId);
            return "".concat(role.name, "-<:").concat(emote.name, ":").concat(emote.id, ">\n");
          }).join(" ");
          msg = message.channel.send("All Init Roles : \n\n".concat(roleList));
          console.log(msg);
          return _context7.abrupt("return");

        case 7:
        case "end":
          return _context7.stop();
      }
    }
  });
};

module.exports = {
  imgGacha: imgGacha,
  execute: execute,
  skip: skip,
  stop: stop,
  clearQueue: clearQueue,
  createRole: createRole,
  deleteRole: deleteRole,
  getAllRole: getAllRole
};