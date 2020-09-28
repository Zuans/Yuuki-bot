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
      videoId,
      songInfo,
      song,
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
          _context.next = 11;
          return regeneratorRuntime.awrap(getVideoId(args));

        case 11:
          videoId = _context.sent;
          _context.next = 14;
          return regeneratorRuntime.awrap(ytdl.getInfo(videoId));

        case 14:
          songInfo = _context.sent;
          song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url
          }; // check if this guild has queue ? 

          if (serverQueue) {
            _context.next = 35;
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

          queue.set(message.guild.id, queueConstruct); // add song to queue;

          queueConstruct.songs.push(song); // try connect to voice channel

          _context.prev = 20;
          _context.next = 23;
          return regeneratorRuntime.awrap(voiceChannel.join());

        case 23:
          connection = _context.sent;
          queueConstruct.connection = connection;
          play(message, queueConstruct.songs[0]);
          _context.next = 33;
          break;

        case 28:
          _context.prev = 28;
          _context.t0 = _context["catch"](20);
          console.log(_context.t0);
          queue["delete"](message.guild.id);
          return _context.abrupt("return", message.channel.send(_context.t0));

        case 33:
          _context.next = 39;
          break;

        case 35:
          console.log('test added');
          serverQueue.songs.push(song);
          console.log(serverQueue.songs);
          return _context.abrupt("return", message.channel.send("\"".concat(song.title, "\" has been added in queue!")));

        case 39:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[20, 28]]);
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

var createRole = function createRole(message, name, color, test) {
  var test1, guildId, newRole, roleExist, guild, channel;
  return regeneratorRuntime.async(function createRole$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          test1 = message.reaction.emoji.name;
          console.log(test1);
          guildId = message.guild.id;
          roleExist = message.guild.roles.cache.find(function (role) {
            return role.name == name;
          });

          if (!roleExist) {
            _context5.next = 6;
            break;
          }

          return _context5.abrupt("return", message.channel.send('This role name already exist please use another name!'));

        case 6:
          _context5.prev = 6;
          _context5.next = 9;
          return regeneratorRuntime.awrap(message.guild.roles.create({
            data: {
              name: name,
              color: color.toUpperCase()
            }
          }));

        case 9:
          newRole = _context5.sent;
          _context5.next = 12;
          return regeneratorRuntime.awrap(Channel.findById(guildId));

        case 12:
          guild = _context5.sent;
          console.log(guild);

          if (guild) {
            _context5.next = 19;
            break;
          }

          channel = new Channel({
            _id: guildId,
            roles: {
              name: newRole.name,
              idRole: newRole.id,
              emoteRole: test
            }
          });
          channel.save().then(function () {
            return console.log('New Guild has been added!');
          })["catch"](function (err) {
            return console.log(err);
          });
          _context5.next = 22;
          break;

        case 19:
          _context5.next = 21;
          return regeneratorRuntime.awrap(guild.updateOne({
            $push: {
              roles: {
                name: newRole.name,
                idRole: newRole.id
              }
            }
          }));

        case 21:
          console.log('Success push new Role to exist Guild!');

        case 22:
          _context5.next = 27;
          break;

        case 24:
          _context5.prev = 24;
          _context5.t0 = _context5["catch"](6);
          console.log(_context5.t0);

        case 27:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[6, 24]]);
};

module.exports = {
  imgGacha: imgGacha,
  execute: execute,
  skip: skip,
  stop: stop,
  clearQueue: clearQueue,
  createRole: createRole
};