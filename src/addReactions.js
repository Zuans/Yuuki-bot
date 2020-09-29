const {
    MessageCollector
} = require('discord.js')

const Channel = require('./db/Channel-model');

const saveRole = async (guildId, emote, role) => {

    try {
        // Check if guild is exist
        const guildExist = await Channel.findById(guildId);
        if (!guildExist) {
            const guild = new Channel({
                "_id ": guildId,
                "roles": [{
                    "roleName": role.name.toLowerCase(),
                    "roleId": role.id,
                    "emoteName": emote.name.toLowerCase(),
                    "emoteId": emote.id,
                }],
            });
            return guild.save();
        }
        // After thath check roles in guild
        const roles = guildExist.roles.find(roleData => roleData.roleName == role.name || roleData.emoteName == emote.name);
        if (roles) return;
        await guildExist.updateOne({
            "$push": {
                "roles": {
                    "roleName": role.name.toLowerCase(),
                    "roleId": role.id,
                    "emoteName": emote.name.toLowerCase(),
                    "emoteId": emote.id,
                }
            }
        });
    } catch (error) {
        throw new Error(error);
    }
    return;
}


const checkDB = async (guildId, emote, role) => {
    try {
        const emoteId = emote.id;
        const roleId = role.id;
        const data = await Channel.find({
            "_id": guildId,
            "$or": [{
                    "roles.emoteId": emoteId
                },
                {
                    "roles.roleId": roleId
                },
            ]
        });
        return await data;
    } catch (error) {
        console.log(error)
    }
}

const msgCollectorFilter = (newMsg, originalMsg) => {
    if (originalMsg.author.bot) return false;
    if (newMsg.author.id !== originalMsg.author.id) return false;
    const [emoteRole, nameRole] = originalMsg.content.trim().split(',');
    if (!emoteRole || !nameRole) {
        originalMsg.channel.send('Please provide the paramater e.g: laravel,laravel ')
            .then(msg => msg.delete({
                timeout: 5000
            }))
            .catch(err => console.log(err));
        return false;
    }
    const emote = originalMsg.guild.emojis.cache.find(emote => emote.name.toLowerCase() == emoteRole.toLowerCase());
    if (!emote) {
        originalMsg.channel.send('Emote not found please try again!')
            .then(msg => msg.delete({
                timeout: 5000
            }))
            .catch(err => console.log(err));
        return false;
    }
    const role = originalMsg.guild.roles.cache.find(role => role.name.toLowerCase() === nameRole.toLowerCase());
    if (!role) {
        originalMsg.channel.send('This role not found please try again!')
            .then(msg => msg.delete({
                timeout: 5000
            }))
            .catch(err => console.log(err));
        return false;
    }
    return true;
}

module.exports = {
    initReact: async (client, message) => {
        const collector = new MessageCollector(message.channel, msgCollectorFilter.bind(null, message), {
            time: 50000
        });
        message.channel.send('Please provide all of emoji name with role name ( Separate by commma ) and you have 30 sec to send this  ')
            .then()
            .catch(err => console.log(err));
        collector.on('collect', async (msg) => {
            try {
                const guildId = message.guild.id;
                const {
                    cache
                } = msg.guild.emojis;
                const [emojiRole, nameRole] = msg.content.trim().split(',');
                const emote = cache.find(role => role.name.toLowerCase() == emojiRole.toLowerCase());
                const role = msg.guild.roles.cache.find(role => role.name.toLowerCase() == nameRole.toLowerCase());
                const existDB = await checkDB(message.guild.id, emote, role);
                if (existDB.length > 0) {
                    const msg = await message.channel.send('This emote or role already init !');
                    msg.delete({
                        timeout: 5000
                    });
                    // console.log(message);
                    // message.channel.send('Role or emote already init!')
                    //     .then(msg => msg.delete({ timeout : 5000 }))
                    //     .error(err => console.log(err));
                    return false;
                }
                if (emote && role) {
                    const data = saveRole(guildId, emote, role)
                        .then(data => data)
                        .catch(err => console.log(err));
                    console.log('Berhasil disimpan');
                }
            } catch (error) {
                console.log(error);
            }
        });
        collector.on('end', (collected, reason) => {
            message.channel.send('Times up !')
                .then(msg => msg.delete({
                    timeout: 5000
                }))
                .catch(err => console.log(err));
        })
        return;
    },
    description: 'Create init for reaction'
}



// const emoteExist = checkEmote(emote,role)
// .then( emote => emote)
// .catch( err => console.log(err));
// if(emoteExist) {
// originalMsg.channel.send('Role or emoji has already declare !')
//     .then( msg => msg.delete({ timeout : 5000 }))
//     .catch( err => console.log(err));
//     return false;
// }