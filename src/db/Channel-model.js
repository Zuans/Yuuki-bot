const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    listRoleId : String,
    roles: [],
});

module.exports = mongoose.model('channel', channelSchema);