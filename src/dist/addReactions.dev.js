"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _require = require('discord.js'),
    MessageCollector = _require.MessageCollector;

var Channel = require('./db/Channel-model');

var saveRole = function saveRole(guildId, emote, role) {
  var guildExist, guild, roles;
  return regeneratorRuntime.async(function saveRole$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(Channel.findById(guildId));

        case 3:
          guildExist = _context.sent;

          if (guildExist) {
            _context.next = 7;
            break;
          }

          guild = new Channel({
            "_id ": guildId,
            "roles": [{
              "roleName": role.name.toLowerCase(),
              "roleId": role.id,
              "emoteName": emote.name.toLowerCase(),
              "emoteId": emote.id
            }]
          });
          return _context.abrupt("return", guild.save());

        case 7:
          // After thath check roles in guild
          roles = guildExist.roles.find(function (roleData) {
            return roleData.roleName == role.name || roleData.emoteName == emote.name;
          });

          if (!roles) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("return");

        case 10:
          _context.next = 12;
          return regeneratorRuntime.awrap(guildExist.updateOne({
            "$push": {
              "roles": {
                "roleName": role.name.toLowerCase(),
                "roleId": role.id,
                "emoteName": emote.name.toLowerCase(),
                "emoteId": emote.id
              }
            }
          }));

        case 12:
          _context.next = 17;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](0);
          throw new Error(_context.t0);

        case 17:
          return _context.abrupt("return");

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 14]]);
};

var checkDB = function checkDB(guildId, emote, role) {
  var emoteId, roleId, data;
  return regeneratorRuntime.async(function checkDB$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          emoteId = emote.id;
          roleId = role.id;
          _context2.next = 5;
          return regeneratorRuntime.awrap(Channel.find({
            "_id": guildId,
            "$or": [{
              "roles.emoteId": emoteId
            }, {
              "roles.roleId": roleId
            }]
          }));

        case 5:
          data = _context2.sent;
          _context2.next = 8;
          return regeneratorRuntime.awrap(data);

        case 8:
          return _context2.abrupt("return", _context2.sent);

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](0);
          console.log(_context2.t0);

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

var msgCollectorFilter = function msgCollectorFilter(newMsg, originalMsg) {
  if (originalMsg.author.bot) return false;
  if (newMsg.author.id !== originalMsg.author.id) return false;

  var _originalMsg$content$ = originalMsg.content.trim().split(','),
      _originalMsg$content$2 = _slicedToArray(_originalMsg$content$, 2),
      emoteRole = _originalMsg$content$2[0],
      nameRole = _originalMsg$content$2[1];

  if (!emoteRole || !nameRole) {
    originalMsg.channel.send('Please provide the paramater e.g: laravel,laravel ').then(function (msg) {
      return msg["delete"]({
        timeout: 5000
      });
    })["catch"](function (err) {
      return console.log(err);
    });
    return false;
  }

  var emote = originalMsg.guild.emojis.cache.find(function (emote) {
    return emote.name.toLowerCase() == emoteRole.toLowerCase();
  });

  if (!emote) {
    originalMsg.channel.send('Emote not found please try again!').then(function (msg) {
      return msg["delete"]({
        timeout: 5000
      });
    })["catch"](function (err) {
      return console.log(err);
    });
    return false;
  }

  var role = originalMsg.guild.roles.cache.find(function (role) {
    return role.name.toLowerCase() === nameRole.toLowerCase();
  });

  if (!role) {
    originalMsg.channel.send('This role not found please try again!').then(function (msg) {
      return msg["delete"]({
        timeout: 5000
      });
    })["catch"](function (err) {
      return console.log(err);
    });
    return false;
  }

  return true;
};

module.exports = {
  initReact: function initReact(client, message) {
    var collector;
    return regeneratorRuntime.async(function initReact$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            collector = new MessageCollector(message.channel, msgCollectorFilter.bind(null, message), {
              time: 50000
            });
            message.channel.send('Please provide all of emoji name with role name ( Separate by commma ) and you have 30 sec to send this  ').then()["catch"](function (err) {
              return console.log(err);
            });
            collector.on('collect', function _callee(msg) {
              var guildId, cache, _msg$content$trim$spl, _msg$content$trim$spl2, emojiRole, nameRole, emote, role, existDB, _msg, data;

              return regeneratorRuntime.async(function _callee$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      _context3.prev = 0;
                      guildId = message.guild.id;
                      cache = msg.guild.emojis.cache;
                      _msg$content$trim$spl = msg.content.trim().split(','), _msg$content$trim$spl2 = _slicedToArray(_msg$content$trim$spl, 2), emojiRole = _msg$content$trim$spl2[0], nameRole = _msg$content$trim$spl2[1];
                      emote = cache.find(function (role) {
                        return role.name.toLowerCase() == emojiRole.toLowerCase();
                      });
                      role = msg.guild.roles.cache.find(function (role) {
                        return role.name.toLowerCase() == nameRole.toLowerCase();
                      });
                      _context3.next = 8;
                      return regeneratorRuntime.awrap(checkDB(message.guild.id, emote, role));

                    case 8:
                      existDB = _context3.sent;

                      if (!(existDB.length > 0)) {
                        _context3.next = 15;
                        break;
                      }

                      _context3.next = 12;
                      return regeneratorRuntime.awrap(message.channel.send('This emote or role already init !'));

                    case 12:
                      _msg = _context3.sent;

                      _msg["delete"]({
                        timeout: 5000
                      }); // console.log(message);
                      // message.channel.send('Role or emote already init!')
                      //     .then(msg => msg.delete({ timeout : 5000 }))
                      //     .error(err => console.log(err));


                      return _context3.abrupt("return", false);

                    case 15:
                      if (emote && role) {
                        data = saveRole(guildId, emote, role).then(function (data) {
                          return data;
                        })["catch"](function (err) {
                          return console.log(err);
                        });
                        console.log('Berhasil disimpan');
                      }

                      _context3.next = 21;
                      break;

                    case 18:
                      _context3.prev = 18;
                      _context3.t0 = _context3["catch"](0);
                      console.log(_context3.t0);

                    case 21:
                    case "end":
                      return _context3.stop();
                  }
                }
              }, null, null, [[0, 18]]);
            });
            collector.on('end', function (collected, reason) {
              message.channel.send('Times up !').then(function (msg) {
                return msg["delete"]({
                  timeout: 5000
                });
              })["catch"](function (err) {
                return console.log(err);
              });
            });
            return _context4.abrupt("return");

          case 5:
          case "end":
            return _context4.stop();
        }
      }
    });
  },
  description: 'Create init for reaction'
}; // const emoteExist = checkEmote(emote,role)
// .then( emote => emote)
// .catch( err => console.log(err));
// if(emoteExist) {
// originalMsg.channel.send('Role or emoji has already declare !')
//     .then( msg => msg.delete({ timeout : 5000 }))
//     .catch( err => console.log(err));
//     return false;
// }