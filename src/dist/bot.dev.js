"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _toArray(arr) { return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// init package
var _require = require('discord.js'),
    Client = _require.Client,
    DiscordAPIError = _require.DiscordAPIError,
    Message = _require.Message,
    MessageEmbed = _require.MessageEmbed,
    Guild = _require.Guild; // Env declare


require('dotenv').config();

var client = new Client({
  partials: ['MESSAGE', 'REACTION']
});

var _require2 = require('./resolver'),
    imgGacha = _require2.imgGacha,
    execute = _require2.execute,
    skip = _require2.skip,
    stop = _require2.stop,
    clearQueue = _require2.clearQueue,
    createRole = _require2.createRole;

var _require3 = require('./addReactions'),
    initReact = _require3.initReact;

var connectDB = require('./db/db'); // Global variable


var PREFIX = "".concat(process.env.PREFIX);
var userReq = [];
client.on('ready', function _callee() {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log("[".concat(client.user.tag, "] : Telah login "));
          _context.next = 3;
          return regeneratorRuntime.awrap(connectDB(process.env.PASSWORD, process.env.DB_NAME));

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
});
client.on('message', function _callee2(message) {
  var msg, _msg$trim$substring$s, _msg$trim$substring$s2, CMD_NAME, args, member, _member, data, user, cdMinute, cdTime, _imgGacha, description, link, rarity, embed, min, _imgGacha2, _description, _link, _rarity, _embed, _client, test;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          msg = message.content; // If there an error

          if (msg.startsWith("[Error]") || msg.startsWith("[Warning]") && message.author.bot) {
            message["delete"]({
              timeout: 12000
            })["catch"](function (err) {
              return console.log(err);
            });
          } // If user command with prefix


          if (!msg.startsWith(PREFIX)) {
            _context2.next = 79;
            break;
          }

          if (!(message.author.bot == true)) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return");

        case 5:
          _msg$trim$substring$s = msg.trim().substring(PREFIX.length).split(/\s+/), _msg$trim$substring$s2 = _toArray(_msg$trim$substring$s), CMD_NAME = _msg$trim$substring$s2[0], args = _msg$trim$substring$s2.slice(1);

          if (!(CMD_NAME == "greet")) {
            _context2.next = 8;
            break;
          }

          return _context2.abrupt("return", message.reply('Hai juga'));

        case 8:
          if (!(CMD_NAME == "kick")) {
            _context2.next = 19;
            break;
          }

          if (message.member.hasPermission("KICK_MEMBERS")) {
            _context2.next = 11;
            break;
          }

          return _context2.abrupt("return", message.reply("You cannot user this command"));

        case 11:
          if (!(args.length <= 0)) {
            _context2.next = 13;
            break;
          }

          return _context2.abrupt("return", message.reply('Please insert the user id'));

        case 13:
          // Get member object
          member = message.guild.members.cache.get(args[0]);

          if (!member) {
            _context2.next = 18;
            break;
          }

          return _context2.abrupt("return", member.kick().then(function (member) {
            return message.channel.send("".concat(member.user.username, " Has been kicked"));
          })["catch"](function (err) {
            return message.channel.send("i don't have permission :( ");
          }));

        case 18:
          return _context2.abrupt("return", message.channel.send('That user not found'));

        case 19:
          if (!(CMD_NAME == "create-role")) {
            _context2.next = 31;
            break;
          }

          _member = message.guild.members.cache.get(message.author.id);

          if (!(!args[0] || !args[1])) {
            _context2.next = 23;
            break;
          }

          return _context2.abrupt("return", message.channel.send("Wrong input ! ex: $create-role  <role-name>  <role-color>"));

        case 23:
          if (!_member.hasPermission("MANAGE_ROLES")) {
            _context2.next = 30;
            break;
          }

          _context2.next = 26;
          return regeneratorRuntime.awrap(createRole(message, args[0], args[1], args[2]));

        case 26:
          data = _context2.sent;
          return _context2.abrupt("return");

        case 30:
          return _context2.abrupt("return", message.channel.send("You don't permissions to manage roles"));

        case 31:
          if (!(CMD_NAME === "gacha")) {
            _context2.next = 53;
            break;
          }

          if (!(message.channel.name !== "gacha")) {
            _context2.next = 34;
            break;
          }

          return _context2.abrupt("return", message.channel.send("[Warning] please use this command on 'gacha' text channel "));

        case 34:
          // if user has already requested
          user = userReq.find(function (user) {
            return user.id == message.author.id;
          });

          if (!user) {
            _context2.next = 49;
            break;
          }

          cdMinute = 5;
          cdTime = user.date.getTime() < new Date().getTime() - cdMinute * 1000 * 60;

          if (!cdTime) {
            _context2.next = 45;
            break;
          }

          _imgGacha = imgGacha(), description = _imgGacha.description, link = _imgGacha.link, rarity = _imgGacha.rarity;
          embed = {
            title: "Yeay you got ".concat(rarity, " chara"),
            description: description,
            color: "GREY",
            image: {
              url: link
            }
          };
          user.date = new Date();
          return _context2.abrupt("return", message.channel.send({
            embed: embed
          }));

        case 45:
          min = Math.round((user.date.getTime() - new Date().getTime() + cdMinute * 1000 * 60) / 60000);
          return _context2.abrupt("return", message.reply("Cooldown Gacha! Please wait until ".concat(min, " minutes or more")));

        case 47:
          _context2.next = 53;
          break;

        case 49:
          userReq.push({
            id: message.author.id,
            date: new Date()
          });
          _imgGacha2 = imgGacha(), _description = _imgGacha2.description, _link = _imgGacha2.link, _rarity = _imgGacha2.rarity;
          _embed = {
            title: "Yeay you got ".concat(_rarity, " chara"),
            description: _description,
            color: "GREY",
            image: {
              url: _link
            }
          };
          return _context2.abrupt("return", message.channel.send({
            embed: _embed
          }));

        case 53:
          if (!(CMD_NAME === "init-react")) {
            _context2.next = 59;
            break;
          }

          _client = message.client;
          _context2.next = 57;
          return regeneratorRuntime.awrap(initReact(_client, message, _toConsumableArray(args)));

        case 57:
          test = _context2.sent;
          return _context2.abrupt("return");

        case 59:
          if (!(CMD_NAME === "play")) {
            _context2.next = 64;
            break;
          }

          execute.apply(void 0, [message].concat(_toConsumableArray(args)));
          return _context2.abrupt("return");

        case 64:
          if (!(CMD_NAME === "skip")) {
            _context2.next = 69;
            break;
          }

          skip(message);
          return _context2.abrupt("return");

        case 69:
          if (!(CMD_NAME === "stop")) {
            _context2.next = 74;
            break;
          }

          stop(message);
          return _context2.abrupt("return");

        case 74:
          if (!(CMD_NAME === "leave")) {
            _context2.next = 78;
            break;
          }

          return _context2.abrupt("return", clearQueue(message));

        case 78:
          message.reply('Wrong input you can use "$help" command to get all command ');

        case 79:
        case "end":
          return _context2.stop();
      }
    }
  });
});
client.on('messageReactionAdd', function _callee3(reaction, user) {
  var test, member;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          console.log(reaction.emoji);
          test = user.client.emojis.cache.get(reaction.emoji);
          console.log(test);
          member = reaction.message.guild.members.cache.get(user.id); // if (reaction.message.id === "756308192367083540") {
          //     switch (name) {
          //         case '🍎':
          //             console.log('ok');
          //             member.roles.add('756134195683786762');
          //             break;
          //         case '🍇':
          //             member.roles.add("756134543781789698");
          //             break;
          //         case '🍌':
          //             member.roles.add("756134717752999967");
          //             break;
          //         case "🥑":
          //             member.roles.add("756134603068014652");
          //             break;
          //     }
          // }

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
});
client.on('messageReactionRemove', function _callee4(reaction, user) {
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
        case "end":
          return _context4.stop();
      }
    }
  });
});
client.on('messageReactionRemoveAll', function (message) {
  message.channel.send('[Error] all I am sorry i cannot delete roles at once please delete it one by one');
});
client.on('debug', console.log); // client.on('typingStart', (channel, user) => {
//     if (user.bot == true) return;
//     channel.send(`Hello si ${user.username}`);
// })

client.login(process.env.DISCORD_BOT_TOKEN);