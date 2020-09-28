"use strict";

var _require = require('googleapis'),
    google = _require.google;

var ytService = google.youtube({
  version: 'v3',
  auth: 'AIzaSyA47nLjVE57nqGTXL2ANiun5EoidvZVxBs'
});

var getVideoId = function getVideoId(params) {
  var _ref, items;

  return regeneratorRuntime.async(function getVideoId$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(ytService.search.list({
            part: ["snippet"],
            q: params,
            maxResults: 1
          }));

        case 3:
          _ref = _context.sent;
          items = _ref.data.items;
          _context.next = 7;
          return regeneratorRuntime.awrap(items[0].id.videoId);

        case 7:
          return _context.abrupt("return", _context.sent);

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          return _context.abrupt("return");

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

module.exports = {
  getVideoId: getVideoId
};