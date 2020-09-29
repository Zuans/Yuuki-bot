"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

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
    Guild = _require.Guild,
    Channel = _require.Channel; // Env declare


require('dotenv').config();

var client = new Client({
  partials: ['MESSAGE', 'REACTION']
});

var Channels = require('./db/Channel-model');

var _require2 = require('./resolver'),
    imgGacha = _require2.imgGacha,
    execute = _require2.execute,
    skip = _require2.skip,
    stop = _require2.stop,
    clearQueue = _require2.clearQueue,
    createRole = _require2.createRole,
    deleteRole = _require2.deleteRole,
    getAllRole = _require2.getAllRole;

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
          return regeneratorRuntime.awrap(connectDB(process.env.DB_URL));

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
});
client.on('message', function _callee2(message) {
  var msg, _msg$trim$substring$s, _msg$trim$substring$s2, CMD_NAME, args, numberPattern, userId, member, _member, _args$join$split, _args$join$split2, name, color, data, nameRole, role, _msg, user, cdMinute, cdTime, _imgGacha, description, link, rarity, embed, min, _imgGacha2, _description, _link, _rarity, _embed, _member2, _client, _member3, messageId, guildId, guild, _guild, allRole;

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
          }

          if (!message.author.bot) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return");

        case 4:
          if (!msg.startsWith(PREFIX)) {
            _context2.next = 141;
            break;
          }

          if (!(message.author.bot == true)) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return");

        case 7:
          _msg$trim$substring$s = msg.trim().substring(PREFIX.length).split(/\s+/), _msg$trim$substring$s2 = _toArray(_msg$trim$substring$s), CMD_NAME = _msg$trim$substring$s2[0], args = _msg$trim$substring$s2.slice(1);

          if (!(CMD_NAME == "greet")) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", message.reply('Hai juga'));

        case 10:
          if (!(CMD_NAME == "invite")) {
            _context2.next = 12;
            break;
          }

          return _context2.abrupt("return", message.channel.send('https://discord.com/oauth2/authorize?client_id=755771123014041602&permissions=1345682678&scope=bot'));

        case 12:
          if (!(CMD_NAME == "kick")) {
            _context2.next = 26;
            break;
          }

          if (message.member.hasPermission("KICK_MEMBERS")) {
            _context2.next = 15;
            break;
          }

          return _context2.abrupt("return", message.reply("You don't have kick permission"));

        case 15:
          if (!(args.length <= 0)) {
            _context2.next = 17;
            break;
          }

          return _context2.abrupt("return", message.reply('Please insert the user id'));

        case 17:
          numberPattern = /\d+/g;
          userId = args[0].match(numberPattern).join(""); // Get member object

          member = message.guild.members.cache.get(userId);

          if (!member) {
            _context2.next = 26;
            break;
          }

          if (!member) {
            _context2.next = 25;
            break;
          }

          return _context2.abrupt("return", member.kick().then(function (member) {
            return message.channel.send("".concat(member.user.username, " Has been kicked"));
          })["catch"](function (err) {
            return message.channel.send("i don't have permission :( ");
          }));

        case 25:
          return _context2.abrupt("return", message.channel.send('That user not found'));

        case 26:
          if (!(CMD_NAME == "create-role")) {
            _context2.next = 39;
            break;
          }

          _member = message.guild.members.cache.get(message.author.id);

          if (!_member.hasPermission("MANAGE_ROLES")) {
            _context2.next = 38;
            break;
          }

          _args$join$split = args.join(" ").split("-"), _args$join$split2 = _slicedToArray(_args$join$split, 2), name = _args$join$split2[0], color = _args$join$split2[1];

          if (!(!name || !color)) {
            _context2.next = 32;
            break;
          }

          return _context2.abrupt("return", message.channel.send("Wrong input ! ex: $create-role  <role-name>-<role-color>"));

        case 32:
          _context2.next = 34;
          return regeneratorRuntime.awrap(createRole(message, name, color));

        case 34:
          data = _context2.sent;
          return _context2.abrupt("return");

        case 38:
          return _context2.abrupt("return", message.channel.send("You don't permissions to manage roles"));

        case 39:
          if (!(CMD_NAME == "delete-role")) {
            _context2.next = 61;
            break;
          }

          nameRole = args.join(" ");
          console.log(nameRole);
          _context2.prev = 42;
          _context2.next = 45;
          return regeneratorRuntime.awrap(message.guild.roles.cache.find(function (role) {
            return role.name.toLowerCase() == nameRole.toLowerCase();
          }));

        case 45:
          role = _context2.sent;

          if (role) {
            _context2.next = 51;
            break;
          }

          _context2.next = 49;
          return regeneratorRuntime.awrap(message.channel.send('No role found!'));

        case 49:
          _msg = _context2.sent;

          _msg["delete"]({
            timeout: 5000
          });

        case 51:
          _context2.next = 53;
          return regeneratorRuntime.awrap(role["delete"]('Go away'));

        case 53:
          _context2.next = 55;
          return regeneratorRuntime.awrap(deleteRole(message, message.guild.id, role));

        case 55:
          _context2.next = 60;
          break;

        case 57:
          _context2.prev = 57;
          _context2.t0 = _context2["catch"](42);
          console.log(_context2.t0);

        case 60:
          return _context2.abrupt("return");

        case 61:
          if (!(CMD_NAME === "gacha")) {
            _context2.next = 83;
            break;
          }

          if (!(message.channel.name !== "gacha")) {
            _context2.next = 64;
            break;
          }

          return _context2.abrupt("return", message.channel.send("[Warning] please use this command on 'gacha' text channel "));

        case 64:
          // if user has already requested
          user = userReq.find(function (user) {
            return user.id == message.author.id;
          });

          if (!user) {
            _context2.next = 79;
            break;
          }

          cdMinute = 5;
          cdTime = user.date.getTime() < new Date().getTime() - cdMinute * 1000 * 60;

          if (!cdTime) {
            _context2.next = 75;
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

        case 75:
          min = Math.round((user.date.getTime() - new Date().getTime() + cdMinute * 1000 * 60) / 60000);
          return _context2.abrupt("return", message.reply("Cooldown Gacha! Please wait until ".concat(min, " minutes or more")));

        case 77:
          _context2.next = 83;
          break;

        case 79:
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

        case 83:
          if (!(CMD_NAME === "init-emote")) {
            _context2.next = 90;
            break;
          }

          _member2 = message.guild.members.cache.get(message.author.id);

          if (!_member2.hasPermission('MANAGE_ROLES')) {
            message.reply("You don't have manage roles permission!").then(function (msg) {
              return msg["delete"]({
                timeout: 5000
              });
            })["catch"](function (err) {
              return console.log(err);
            });
          }

          _client = message.client;
          _context2.next = 89;
          return regeneratorRuntime.awrap(initReact(_client, message));

        case 89:
          return _context2.abrupt("return");

        case 90:
          if (!(CMD_NAME === 'init-list')) {
            _context2.next = 113;
            break;
          }

          _member3 = message.guild.members.cache.get(message.author.id);

          if (!_member3.hasPermission('MANAGE_ROLES')) {
            message.reply("You don't have manage roles permission!").then(function (msg) {
              return msg["delete"]({
                timeout: 5000
              });
            })["catch"](function (err) {
              return console.log(err);
            });
          }

          messageId = args[0];
          guildId = message.guild.id;
          _context2.prev = 95;
          _context2.next = 98;
          return regeneratorRuntime.awrap(Channels.findById(guildId));

        case 98:
          guild = _context2.sent;

          if (guild) {
            _context2.next = 104;
            break;
          }

          _guild = new Channels({
            _id: guildId,
            listRoleId: messageId
          });

          _guild.save();

          _context2.next = 106;
          break;

        case 104:
          _context2.next = 106;
          return regeneratorRuntime.awrap(guild.updateOne({
            listRoleId: messageId
          }));

        case 106:
          return _context2.abrupt("return", message.channel.send('Success init the role list message!'));

        case 109:
          _context2.prev = 109;
          _context2.t1 = _context2["catch"](95);
          console.log(_context2.t1);

        case 112:
          return _context2.abrupt("return");

        case 113:
          if (!(CMD_NAME === "list-role")) {
            _context2.next = 118;
            break;
          }

          _context2.next = 116;
          return regeneratorRuntime.awrap(getAllRole(message));

        case 116:
          allRole = _context2.sent;
          return _context2.abrupt("return");

        case 118:
          if (!(CMD_NAME === "help")) {
            _context2.next = 121;
            break;
          }

          message.channel.send("\nList Command : \n\n$play <song title> ~ Play music from youtube \n$skip ~ Skip the music \n$stop ~ Stop the music \n$create-role <role name>-<role color> ~ Make new role \n$delete-role <role name> ~ Delete role\n$list-role ~ See all init role\n$init-emote ~ To start collect emote with role \n$init-list <Message id> ~ To init the list role message \n$gacha ~ See your lucky :)  \n$kick <User id> ~ To kick user from server ( Kick Permission needed) \n\nTo see more information check documentation https://github.com/Zuans/Yuuki-bot#command\n            ");
          return _context2.abrupt("return");

        case 121:
          if (!(CMD_NAME === "play")) {
            _context2.next = 126;
            break;
          }

          execute.apply(void 0, [message].concat(_toConsumableArray(args)));
          return _context2.abrupt("return");

        case 126:
          if (!(CMD_NAME === "skip")) {
            _context2.next = 131;
            break;
          }

          skip(message);
          return _context2.abrupt("return");

        case 131:
          if (!(CMD_NAME === "stop")) {
            _context2.next = 136;
            break;
          }

          stop(message);
          return _context2.abrupt("return");

        case 136:
          if (!(CMD_NAME === "leave")) {
            _context2.next = 140;
            break;
          }

          return _context2.abrupt("return", clearQueue(message));

        case 140:
          message.reply('Wrong input you can use "$help" command to get all command ');

        case 141:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[42, 57], [95, 109]]);
});
client.on('messageReactionAdd', function _callee3(reaction, user) {
  var _ref, listRoleId, _ref2, id, memberId, member, data, _data$roles$find, roleId;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(Channels.findById(reaction.message.guild.id)["catch"](function (err) {
            return console.log(err);
          }));

        case 2:
          _ref = _context3.sent;
          listRoleId = _ref.listRoleId;

          if (listRoleId) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return");

        case 6:
          if (!(listRoleId == reaction.message.id)) {
            _context3.next = 29;
            break;
          }

          _context3.prev = 7;
          _context3.next = 10;
          return regeneratorRuntime.awrap(reaction.emoji);

        case 10:
          _ref2 = _context3.sent;
          id = _ref2.id;
          memberId = user.id;
          _context3.next = 15;
          return regeneratorRuntime.awrap(reaction.message.guild.members.cache.get(memberId));

        case 15:
          member = _context3.sent;
          _context3.next = 18;
          return regeneratorRuntime.awrap(Channels.findOne({
            "roles": {
              $elemMatch: {
                emoteId: id
              }
            }
          }));

        case 18:
          data = _context3.sent;
          _data$roles$find = data.roles.find(function (roles) {
            return roles.emoteId == id;
          }), roleId = _data$roles$find.roleId;
          console.log(roleId);

          if (roleId) {
            _context3.next = 23;
            break;
          }

          return _context3.abrupt("return");

        case 23:
          member.roles.add(roleId).then()["catch"](function (err) {
            reaction.message.channel.send("This emote isn't init yet please init this emote first or contact admin");
          });
          _context3.next = 29;
          break;

        case 26:
          _context3.prev = 26;
          _context3.t0 = _context3["catch"](7);
          console.log(_context3.t0);

        case 29:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[7, 26]]);
});
client.on('messageReactionRemove', function _callee4(reaction, user) {
  var _ref3, listRoleId, _ref4, id, memberId, member, data, _data$roles$find2, roleId;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(Channels.findById(reaction.message.guild.id)["catch"](function (err) {
            return console.log(err);
          }));

        case 2:
          _ref3 = _context4.sent;
          listRoleId = _ref3.listRoleId;

          if (listRoleId) {
            _context4.next = 6;
            break;
          }

          return _context4.abrupt("return");

        case 6:
          if (!(listRoleId == reaction.message.id)) {
            _context4.next = 26;
            break;
          }

          _context4.prev = 7;
          _context4.next = 10;
          return regeneratorRuntime.awrap(reaction.emoji);

        case 10:
          _ref4 = _context4.sent;
          id = _ref4.id;
          memberId = user.id;
          member = reaction.message.guild.members.cache.get(memberId);
          _context4.next = 16;
          return regeneratorRuntime.awrap(Channels.findOne({
            "roles": {
              $elemMatch: {
                emoteId: id
              }
            }
          }));

        case 16:
          data = _context4.sent;
          _data$roles$find2 = data.roles.find(function (roles) {
            return roles.emoteId == id;
          }), roleId = _data$roles$find2.roleId;

          if (roleId) {
            _context4.next = 20;
            break;
          }

          return _context4.abrupt("return");

        case 20:
          member.roles.remove(roleId);
          _context4.next = 26;
          break;

        case 23:
          _context4.prev = 23;
          _context4.t0 = _context4["catch"](7);
          console.log(_context4.t0);

        case 26:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[7, 23]]);
});
client.on('messageReactionRemoveAll', function (message) {
  message.channel.send('[Error] all I am sorry i cannot delete roles at once please delete it one by one');
});
client.on('roleDelete', function _callee5(role) {
  var guildId;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          guildId = role.guild.id;
          _context5.next = 3;
          return regeneratorRuntime.awrap(deleteRole(null, guildId, role));

        case 3:
          return _context5.abrupt("return");

        case 4:
        case "end":
          return _context5.stop();
      }
    }
  });
});
client.on('debug', console.log); // client.on('typingStart', (channel, user) => {
//     if (user.bot == true) return;
//     channel.send(`Hello si ${user.username}`);
// })

client.login(process.env.DISCORD_BOT_TOKEN);