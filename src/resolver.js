const ytdl = require('ytdl-core');
const {
    getVideoId
} = require('./apiv2');
const imgSrc = require('./img');

const Channel = require('./db/Channel-model');


const setImageUrl = (rarity) => {
    const index = Math.floor(Math.random() * imgSrc[rarity].length);
    const img = imgSrc[rarity][index];
    return {
        ...img,
        rarity
    };
}


const imgGacha = () => {
    const score = Math.random() * 10;
    let rarity;
    switch (true) {
        case score >= 9.5:
            rarity = 'S'
            break;
        case score >= 7.5:
            rarity = 'A'
            break;
        case score >= 5:
            rarity = 'B'
            break;
        case score >= 1.5:
            rarity = 'C'
            break;
        default:
            rarity = 'D'
    }
    const imgData = setImageUrl(rarity);
    return imgData;
}


const queue = new Map();

const execute = async (message, ...args) => {
    const serverQueue = queue.get(message.guild.id);
    args = args.join(" ");
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send('You must join voice channel');
    const permissions = voiceChannel.permissionsFor(message.client.user);
    if (!permissions.has("SPEAK") || !permissions.has("CONNECT")) {
        return message.channel.send("i need permissions to join your channel");
    }

    let song;
     
    try {
        const {videoId,error} = await getVideoId(args);
        console.log(error);
        if(error) {
            const msg = await message.channel.send(error);
            msg.delete({ timeout : 5000 });
            return;
        }
        song = {
            title: songInfo.videoDetails.title,
            url: songInfo.videoDetails.video_url,
        }   
        const songInfo = await ytdl.getInfo(videoId);
    } catch (error) {
        const msg =  message.channel.send(error);
        msg.delete({ timeout : 5000 });
    }


    // check if this guild has queue ? 
    if (!serverQueue) {
        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            songs: [],
            connection: null,
            volume: 5,
            playing: true,
        };
        // Set new guild on queue with queue as the constructor
        queue.set(message.guild.id, queueConstruct);
        // add song to queue;
        queueConstruct.songs.push(song);

        // try connect to voice channel
        try {
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            play(message, queueConstruct.songs[0]);
        } catch (error) {
            console.log(error);
            queue.delete(message.guild.id);
            return message.channel.send(error);
        }

    } else {
        if( serverQueue.voiceChannel.id != voiceChannel.id) {
            return message.channel.send('The bot already using in another channel')
                .then( msg => msg.delete({ timeout : 5000}))
                .catch( err => console.log(err));
        }
        console.log('test added');
        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        return message.channel.send(`"${song.title}" has been added in queue!`);
    }
};

const skip = async (message) => {
    const voiceChannel = message.member.voice.channel;
    const serverQueue = queue.get(message.guild.id);
    if (!voiceChannel) {
        const msg = await message.channel.send('You must join the voice channel');
        return await msg.delete({
            timeout: 5000
        }).catch(err => console.log(err));
    }
    if (!serverQueue) {
        const msg = await message.channel.send('Nothing song i can skip');
        return await msg.delete({
            timeout: 5000
        }).catch(err => console.log(err));
    }
    try {
        await serverQueue.connection.dispatcher.end();
        const msg = await message.channel.send('Succesfully skiped song!');
        await msg.delete({
            timeout: 5000
        }).catch(err => console.log(err));
    } catch (err) {
        console.log(err);
    }
}

const stop = async (message) => {
    const voiceChannel = message.member.voice.channel;
    console.log(message.guild.id);
    const serverQueue = queue.get(message.guild.id);
    if (!voiceChannel) {
        const msg = await message.channel.send('You must join voice channel !');
        await msg.delete({
            timeout: 5000
        }).catch(err => console.log(err));
    }
    serverQueue.songs = [];
    await serverQueue.connection.dispatcher.end();
    message.channel.send('Stopped playing');
};

const play = async (message, song) => {
    const serverQueue = queue.get(message.guild.id);
    console.log(song);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(message.guild.id);
        return;
    };
    const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on('finish', () => {
            serverQueue.songs.shift();
            play(message, serverQueue.songs[0]);
        })
        .on('end', () => {
            serverQueue.songs.shift();
            play(message, serverQueue.songs[0]);
        })
        .on('error', (err) => {
            message.channel.send('Ups somwthing when wrong..');
            console.log(err);
            clearQueue(message);
        });

    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    77
    return serverQueue.textChannel.send(`Now Listen ${song.title}`);
}

const clearQueue = (message) => {
    const voiceChannel = message.member.voice.channel;
    if (voiceChannel) {
        queue.delete(message.guild.id);
        return voiceChannel.leave();
    }
}

const createRole = async (message, name, color) => {
    const roleExist = message.guild.roles.cache.find(role => role.name == name);
    if (roleExist) return message.channel.send('This role name already exist please use another name!');
    try {
        await message.guild.roles.create({
           data : {
               name : name,
               color : color.toUpperCase(),
           } 
        });
        return message.channel.send(`Success create role: ${name} !`);
    } catch (error) {
        console.log(error);
    }
};

const deleteRole = async(message,guildId,role) => {
    try {
        const data = await Channel.updateOne(
            {_id : guildId },
            {
                $pull : {
                    "roles" : {
                        roleId : role.id,
                    }
                }
            }
        );
        if(message){
            const msg = await message.channel.send(`Successfully deleted ${role.name}`);
            msg.delete({ timeout: 5000 });
        }
        return;
    } catch (err) {
        console.log(err);
    }
}

const getAllRole = async (message) => {
    const roles = await Channel.findById(message.guild.id)
                        .map(data => data.roles);
    const roleList = roles.map( data => {
        const role = message.guild.roles.cache.get(data.roleId);
        const emote = message.guild.emojis.cache.get(data.emoteId);
        return `${role.name}-<:${emote.name}:${emote.id}>\n`;
    }).join(" ");
    const msg = message.channel.send(`All Init Roles : \n\n${roleList}`)
    console.log(msg);
    return;
}
module.exports = {
    imgGacha,
    execute,
    skip,
    stop,
    clearQueue,
    createRole,
    deleteRole,
    getAllRole
};