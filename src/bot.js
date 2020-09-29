// init package
const {
    Client,
    DiscordAPIError,
    Message,
    MessageEmbed,
    Guild,
    Channel
} = require('discord.js');

// Env declare
require('dotenv').config();

const client = new Client({
    partials: ['MESSAGE', 'REACTION']
});

const Channels = require('./db/Channel-model');


const {
    imgGacha,
    execute,
    skip,
    stop,
    clearQueue,
    createRole,
    deleteRole,
    getAllRole
} = require('./resolver');

const {
    initReact,
} = require('./addReactions');




const connectDB = require('./db/db');


// Global variable
const PREFIX = `${process.env.PREFIX}`;
const userReq = [];

client.on('ready', async () => {
    console.log(`[${client.user.tag}] : Telah login `);
    await connectDB(process.env.DB_URL);
})

client.on('message', async (message) => {
    const msg = message.content;
    // If there an error
    if (msg.startsWith("[Error]") || msg.startsWith("[Warning]") && message.author.bot) {
        message.delete({
            timeout: 12000
        }).catch(err => console.log(err));
    }

    if (message.author.bot) return;

    // If user command with prefix
    if (msg.startsWith(PREFIX)) {
        if (message.author.bot == true) return;
        const [CMD_NAME, ...args] = msg.trim().substring(PREFIX.length).split(/\s+/);

        if (CMD_NAME == "greet") {
            return message.reply('Hai juga');
        }

        if (CMD_NAME == "invite") {
            return message.channel.send('https://discord.com/oauth2/authorize?client_id=755771123014041602&permissions=1345682678&scope=bot');
        }

        if (CMD_NAME == "kick") {
            // Check if user have permission
            if (!message.member.hasPermission("KICK_MEMBERS")) return message.reply("You don't have kick permission");
            // check if sender send user id too ?
            if (args.length <= 0) return message.reply('Please insert the user id');
            const numberPattern = /\d+/g;
            const userId = args[0].match(numberPattern).join("");
            // Get member object
            const member = message.guild.members.cache.get(userId);
            if (member)
                if (member) {
                    return member
                        .kick()
                        .then(member => message.channel.send(`${member.user.username} Has been kicked`))
                        .catch(err => message.channel.send("i don't have permission :( "));
                } else {
                    return message.channel.send('That user not found');
                }
        }

        // CREATE ROLE
        if (CMD_NAME == "create-role") {
            const member = message.guild.members.cache.get(message.author.id);
            if (member.hasPermission("MANAGE_ROLES")) {
                const [name, color] = args.join(" ").split("-");
                if (!name || !color) return message.channel.send(`Wrong input ! ex: $create-role  <role-name>-<role-color>`);
                const data = await createRole(message, name, color);
                return;
            } else {
                return message.channel.send("You don't permissions to manage roles");
            }
        }

        // DELETE ROLE
        if (CMD_NAME == "delete-role") {
            const nameRole = args.join(" ");
            console.log(nameRole);
            try {
                const role = await message.guild.roles.cache.find(role => role.name.toLowerCase() == nameRole.toLowerCase());
                if (!role) {
                    const msg = await message.channel.send('No role found!')
                    msg.delete({
                        timeout: 5000
                    });
                }
                await role.delete('Go away');
                await deleteRole(message, message.guild.id, role);
            } catch (err) {
                console.log(err);
            }
            return;
        }


        // GET GACHA
        if (CMD_NAME === "gacha") {
            if (message.channel.name !== "gacha") return message.channel.send("[Warning] please use this command on 'gacha' text channel ");
            // if user has already requested
            const user = userReq.find(user => user.id == message.author.id);
            if (user) {
                const cdMinute = 5;
                const cdTime = user.date.getTime() < new Date().getTime() - (cdMinute * 1000 * 60);
                if (cdTime) {
                    const {
                        description,
                        link,
                        rarity
                    } = imgGacha();
                    let embed = {
                        title: `Yeay you got ${rarity} chara`,
                        description,
                        color: "GREY",
                        image: {
                            url: link,
                        }
                    }
                    user.date = new Date();
                    return message.channel.send({
                        embed
                    });
                } else {
                    const min = Math.round((user.date.getTime() - new Date().getTime() + (cdMinute * 1000 * 60)) / 60000);
                    return message.reply(`Cooldown Gacha! Please wait until ${min} minutes or more`);
                }
            } else {
                userReq.push({
                    id: message.author.id,
                    date: new Date(),
                });
                const {
                    description,
                    link,
                    rarity
                } = imgGacha();
                let embed = {
                    title: `Yeay you got ${rarity} chara`,
                    description,
                    color: "GREY",
                    image: {
                        url: link,
                    }
                }
                return message.channel.send({
                    embed
                });
            }
        }


        // USE MESSAGE COLLECTOR TO INIT ROLE
        if (CMD_NAME === "init-emote") {
            const member = message.guild.members.cache.get(message.author.id);
            if (!member.hasPermission('MANAGE_ROLES')) {
                message.reply(`You don't have manage roles permission!`)
                    .then(msg => msg.delete({
                        timeout: 5000
                    }))
                    .catch(err => console.log(err));
            }
            const client = message.client;
            await initReact(client, message);
            return;
        }


        //   INIT THE LIST REACT MESSAGE
        if (CMD_NAME === 'init-list') {
            const member = message.guild.members.cache.get(message.author.id);
            if (!member.hasPermission('MANAGE_ROLES')) {
                message.reply(`You don't have manage roles permission!`)
                    .then(msg => msg.delete({
                        timeout: 5000
                    }))
                    .catch(err => console.log(err));
            }
            const messageId = args[0];
            const guildId = message.guild.id;
            try {
                const guild = await Channels.findById(guildId);
                if (!guild) {
                    const guild = new Channels({
                        _id: guildId,
                        listRoleId: messageId,
                    });
                    guild.save();
                } else {
                    await guild.updateOne({
                        listRoleId: messageId,
                    });
                }
                return message.channel.send('Success init the role list message!')
            } catch (error) {
                console.log(error);
            }
            return;
        }

        // SEND ALL INIT ROLE
        if (CMD_NAME === "list-role") {
            const allRole = await getAllRole(message);
            return;
        }

        // GETTING HELP COMMAND
        if (CMD_NAME === "help") {
            message.channel.send(`
List Command : \n
$play <song title> ~ Play music from youtube 
$skip ~ Skip the music 
$stop ~ Stop the music 
$create-role <role name>-<role color> ~ Make new role 
$delete-role <role name> ~ Delete role
$list-role ~ See all init role
$init-emote ~ To start collect emote with role 
$init-list <Message id> ~ To init the list role message 
$gacha ~ See your lucky :)  
$kick <User id> ~ To kick user from server ( Kick Permission needed) \n
To see more information check documentation https://github.com/Zuans/Yuuki-bot#command
            `)
            return;
        }


        //  ALL COMMAND MUSIC PLAYER
        if (CMD_NAME === "play") {
            execute(message, ...args);
            return;
        } else if (CMD_NAME === "skip") {
            skip(message);
            return;
        } else if (CMD_NAME === "stop") {
            stop(message);
            return;
        } else if (CMD_NAME === "leave") {
            return clearQueue(message);
        } else {
            message.reply('Wrong input you can use "$help" command to get all command ');
        }
    }
});


client.on('messageReactionAdd', async (reaction, user) => {
    const {
        listRoleId
    } = await Channels.findById(reaction.message.guild.id)
        .catch(err => console.log(err));
    if (!listRoleId) return;
    if (listRoleId == reaction.message.id) {
        try {
            const {
                id
            } = await reaction.emoji;
            const memberId = user.id;
            const member = await reaction.message.guild.members.cache.get(memberId);
            const data = await Channels.findOne({
                "roles": {
                    $elemMatch: {
                        emoteId: id,
                    }
                }
            });
            const {
                roleId
            } = data.roles.find(roles => roles.emoteId == id);
            console.log(roleId);
            if (!roleId) return;
            member.roles.add(roleId)
                .then()
                .catch(err => {
                    reaction.message.channel.send("This emote isn't init yet please init this emote first or contact admin")
                });
        } catch (error) {
            console.log(error);
        }
    }
});

client.on('messageReactionRemove', async (reaction, user) => {
    const {
        listRoleId
    } = await Channels.findById(reaction.message.guild.id)
        .catch(err => console.log(err));
    if (!listRoleId) return;
    if (listRoleId == reaction.message.id) {
        try {
            const {
                id
            } = await reaction.emoji;
            const memberId = user.id;
            const member = reaction.message.guild.members.cache.get(memberId);
            const data = await Channels.findOne({
                "roles": {
                    $elemMatch: {
                        emoteId: id,
                    }
                }
            })
            const {
                roleId
            } = data.roles.find(roles => roles.emoteId == id);
            if (!roleId) return;
            member.roles.remove(roleId);
        } catch (error) {
            console.log(error);
        }
    }
});

client.on('messageReactionRemoveAll', (message) => {
    message.channel.send('[Error] all I am sorry i cannot delete roles at once please delete it one by one');
});


client.on('roleDelete', async (role) => {
    const guildId = role.guild.id;
    await deleteRole(null, guildId, role);
    return;
});



client.on('debug', console.log);

// client.on('typingStart', (channel, user) => {
//     if (user.bot == true) return;
//     channel.send(`Hello si ${user.username}`);
// })



client.login(process.env.DISCORD_BOT_TOKEN);