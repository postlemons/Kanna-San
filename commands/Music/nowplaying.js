const {
    ErrorMessage
} = require("../../fc");
const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require("discord.js")

module.exports = {
    name: "nowplaying",
    aliases: ["np", "currentsong", "cs"],
    cooldown: 3,
    inVoiceChannel: true,
    run: async (client, message, args) => {
        const novc = new MessageEmbed()
            .setDescription(`${client.emotes.error} | You are not connected to a VC`)
            .setColor(client.config.embed);

        const member = await message.guild.members.cache.get(message.author.id);
        if (!member.voice.channelId || member.voice.channelId === null) return message.channel.send({
            embeds: [novc]
        })
        const {
            joinVoiceChannel
        } = require('@discordjs/voice');

        const connection = await joinVoiceChannel({
            channelId: member.voice.channelId,
            guildId: member.guild.id,
            adapterCreator: member.guild.voiceAdapterCreator,
        })
        const me = await message.guild.members.cache.get(client.user.id)

        if (me.voice.channelId !== null) {
            const newchannel = await message.guild.channels.cache.get(me.voice.channelId)
            const difvc = new MessageEmbed()
                .setDescription(`${client.emotes.play} | Switched Channels To ${newchannel.name}`)
                .setColor(client.config.embed);
            if (member.voice.channelId !== me.voice.channelId) return message.channel.send({
                embeds: [difvc]
            });
        }
        const queue = client.distube.getQueue(message)

        const noqu = new MessageEmbed()
            .setDescription(`${client.emotes.error} | There is nothing to play, what about adding some?`)
            .setColor(client.config.embed);

        if (!queue) return message.channel.send({
            embeds: [noqu]
        });

        const buttons = new MessageActionRow().addComponents(
            new MessageButton()
            .setStyle("SUCCESS")
            .setCustomId("volumeminus")
            .setEmoji("🔉"),

            new MessageButton()
            .setStyle("SUCCESS")
            .setCustomId("pausequeue")
            .setEmoji("⏸️"),

            new MessageButton()
            .setStyle("SUCCESS")
            .setCustomId("resumequeue")
            .setEmoji("▶️"),

            new MessageButton()
            .setStyle("SUCCESS")
            .setCustomId("loopsong")
            .setEmoji("🔁"),

            new MessageButton()
            .setStyle("SUCCESS")
            .setCustomId("volumeplus")
            .setEmoji("🔊")
        )
        let source
        if (queue.songs[0].source === "youtube") {
            source = "<:YouTube:> YouTube";
        } else {
            source = "<:SpotifyLogo:> Spotify"
        }
       // console.log(queue.songs[0].name + ": " + queue.songs[0].source)
        const channelvc = await message.guild.channels.cache.get(member.voice.channelId)
        const novol = new MessageEmbed()
            .setColor(client.config.embed)
            .setThumbnail(queue.songs[0].thumbnail)
            .setAuthor({
                name: "Now Playing Song Details",
                iconURL: "https://emoji.gg/assets/emoji/7670-musicbeat.gif",
                URL: queue.songs[0].url
            })
            .setDescription(`**Song Name**: ${queue.songs[0].name}\n**Channel**: \`${channelvc.name}\`\n**Duration**: \`${queue.songs[0].formattedDuration}\`\n**Source**: ${source}\n**Volume**: \`${queue.volume}\``);
        let volumereply;

        volumereply = await message.channel.send({
            embeds: [novol],
            components: [buttons]
        })


        const collector = await volumereply.createMessageComponentCollector({
            componentType: 'BUTTON',
            time: 180000
        });
        collector.on("collect", async button => {
            try {
                if(button.user.id !== message.author.id)return button.reply({ content: "This menu isn't for you my senpai...", epheremal: true})
                const buttonsnew = new MessageActionRow().addComponents(
                    new MessageButton()
            .setStyle("SUCCESS")
            .setCustomId("volumeminus")
            .setEmoji("🔉"),

            new MessageButton()
            .setStyle("SUCCESS")
            .setCustomId("pausequeue")
            .setEmoji("⏸️"),

            new MessageButton()
            .setStyle("SUCCESS")
            .setCustomId("resumequeue")
            .setEmoji("▶️"),

            new MessageButton()
            .setStyle("SUCCESS")
            .setCustomId("loopsong")
            .setEmoji("🔁"),

            new MessageButton()
            .setStyle("SUCCESS")
            .setCustomId("volumeplus")
            .setEmoji("🔊")
                )
                const msg = await button.channel.messages.fetch(button.message.id);
                if (msg.id !== volumereply.id) return
                const queuebutton = client.distube.getQueue(button)
                if (!queuebutton) return button.reply({
                    content: "There is nothing to play, what about adding some?",
                    ephermal: true
                })

                if (button.customId === "volumeplus") {
                    if (queuebutton.volume + 10 >= 100) {
                        queuebutton.setVolume(100)
                    } else {
                        await queuebutton.setVolume(queuebutton.volume + 10)
                    }
                    if (queuebutton.songs[0].source === "youtube") {
                        source = "<:YouTube:940378252076253245> YouTube";
                    } else {
                        source = "<:SpotifyLogo:940377715989700628> Spotify"
                    }
                    const channelvc = await message.guild.channels.cache.get(member.voice.channelId)
                    const novole = new MessageEmbed()
                        .setColor(client.config.embed)
                        .setThumbnail(queue.songs[0].thumbnail)
                        .setAuthor({
                            name: "Now Playing Song Details",
                            iconURL: "https://emoji.gg/assets/emoji/7670-musicbeat.gif",
                            URL: queue.songs[0].url
                        })
                        .setDescription(`**Song Name**: ${queue.songs[0].name}\n**Channel**: \`${channelvc.name}\`\n**Duration**: \`${queue.songs[0].formattedDuration}\`\n**Source**: ${source}\n**Volume**: \`${queuebutton.volume}\``);
                    try {
                        button.update({
                            embeds: [novole],
                            components: [buttonsnew]
                        })
                    } catch (t) {
                        return ErrorMessage(message, t)
                    }
                } else if (button.customId === "volumeminus") {
                    if (queuebutton.volume - 10 < 0) {
                        queuebutton.setVolume(0)
                    } else {
                        await queuebutton.setVolume(queuebutton.volume - 10)
                    }
                    if (queuebutton.songs[0].source === "youtube") {
                        source = "<:YouTube:940378252076253245> YouTube";
                    } else {
                        source = "<:SpotifyLogo:940377715989700628> Spotify"
                    }
                    const channelvc = await message.guild.channels.cache.get(member.voice.channelId)
                    const novola = new MessageEmbed()
                        .setColor(client.config.embed)
                        .setThumbnail(queue.songs[0].thumbnail)
                        .setAuthor({
                            name: "Now Playing Song Details",
                            iconURL: "https://emoji.gg/assets/emoji/7670-musicbeat.gif",
                            URL: queue.songs[0].url
                        }).setDescription(`**Song Name**: ${queue.songs[0].name}\n**Channel**: \`${channelvc.name}\`\n**Duration**: \`${queue.songs[0].formattedDuration}\`\n**Source**: ${source}\n**Volume**: \`${queuebutton.volume}\``);
                    try {
                        button.update({
                            embeds: [novola],
                            components: [buttonsnew]
                        })
                    } catch (t) {
                        return ErrorMessage(message, t)
                    }
                } else if (button.customId === "pausequeue") {
                    try {
                        await queuebutton.pause()
                    } catch (e) {
                        return
                    }

                    if (queuebutton.songs[0].source === "youtube") {
                        source = "<:YouTube:940378252076253245> YouTube";
                    } else {
                        source = "<:SpotifyLogo:940377715989700628> Spotify"
                    }
                    const channelvc = await message.guild.channels.cache.get(member.voice.channelId)
                    const novelem = new MessageEmbed()
                        .setColor(client.config.embed)
                        .setThumbnail(queue.songs[0].thumbnail)
                        .setAuthor({
                            name: "Now Playing Song Details",
                            iconURL: "https://emoji.gg/assets/emoji/7670-musicbeat.gif",
                            URL: queue.songs[0].url
                        }).setDescription(`**Song Name**: ${queue.songs[0].name}\n**Channel**: \`${channelvc.name}\`\n**Duration**: \`${queue.songs[0].formattedDuration}\`\n**Source**: ${source}\n**Volume**: \`${queuebutton.volume}\``);
                    try {
                        button.update({
                            embeds: [novelem],
                            components: [buttonsnew]
                        })
                    } catch (t) {
                        return ErrorMessage(message, t)
                    }
                } else if (button.customId === "resumequeue") {
                    try {
                        await queuebutton.resume()
                    } catch (e) {
                        return
                    }
                    if (queuebutton.songs[0].source === "youtube") {
                        source = "<:YouTube:940378252076253245> YouTube";
                    } else {
                        source = "<:SpotifyLogo:940377715989700628> Spotify"
                    }
                    const channelvc = await message.guild.channels.cache.get(member.voice.channelId)
                    const hii = new MessageEmbed()
                        .setColor(client.config.embed)
                        .setThumbnail(queue.songs[0].thumbnail)
                        .setAuthor({
                            name: "Now Playing Song Details",
                            iconURL: "https://emoji.gg/assets/emoji/7670-musicbeat.gif",
                            URL: queue.songs[0].url
                        })
                        .setDescription(`**Song Name**: ${queue.songs[0].name}\n**Channel**: \`${channelvc.name}\`\n**Duration**: \`${queue.songs[0].formattedDuration}\`\n**Source**: ${source}\n**Volume**: \`${queuebutton.volume}\``);
                    try {
                        button.update({
                            embeds: [hii],
                            components: [buttonsnew]
                        })
                    } catch (t) {
                        return ErrorMessage(message, t)
                    }
                    // DON'T FORGET TO FIX THIS PART YOU SILLY HUMAN OKAY????????????????????????
                } else if (button.customId === "loopsong") {
                    if (queuebutton) {
                        return
                    } else {
                        return
                    }
                    if (queuebutton.songs[0].source === "youtube") {
                        source = "<:YouTube:940378252076253245> YouTube";
                    } else {
                        source = "<:SpotifyLogo:940377715989700628> Spotify"
                    }
                    const channelvc = await message.guild.channels.cache.get(member.voice.channelId)
                    const hii = new MessageEmbed()
                        .setColor(client.config.embed)
                        .setThumbnail(queue.songs[0].thumbnail)
                        .setAuthor({
                            name: "Now Playing Song Details",
                            iconURL: "https://emoji.gg/assets/emoji/7670-musicbeat.gif",
                            URL: queue.songs[0].url
                        })
                        .setDescription(`**Song Name**: ${queue.songs[0].name}\n**Channel**: \`${channelvc.name}\`\n**Duration**: \`${queue.songs[0].formattedDuration}\`\n**Source**: ${source}\n**Volume**: \`${queuebutton.volume}\``);
                    try {
                        button.update({
                            embeds: [hii],
                            components: [buttonsnew]
                        })
                    } catch (t) {
                        return ErrorMessage(message, t)
                    }
                }
            } catch (e) {
                ErrorMessage(message, e)
            }
        })
        collector.on("end", async button => {

            const channelvc = await message.guild.channels.cache.get(me.voice.channelId)
            const queuebutton = client.distube.getQueue(message)
            if (!queuebutton) return button.update({
                components: []
            })
            if (queuebutton.songs[0].source === "youtube") {
                source = "<:YouTube:940378252076253245> YouTube";
            } else {
                source = "<:SpotifyLogo:940377715989700628> Spotify"
            }
            const ende = new MessageEmbed()
                .setFooter("Expired Queue Info", "https://emoji.gg/assets/emoji/3786_KannaOOF.gif")
                .setColor(client.config.embed)
                .setThumbnail(queue.songs[0].thumbnail)
                .setAuthor({
                    name: "Now Playing Song Details",
                    iconURL: "https://emoji.gg/assets/emoji/7670-musicbeat.gif",
                    URL: queue.songs[0].url
                })
                .setDescription(`**Song Name**: ${queue.songs[0].name}\n**Channel**: \`${channelvc.name}\`\n**Duration**: \`${queue.songs[0].formattedDuration}\`\n**Source**: ${source}\n**Volume**: \`${queuebutton.volume}\``);
            try {
                volumereply.edit({
                    embeds: [ende],
                    components: []
                })
            } catch (e) {
                return
            }
        })

    }
}