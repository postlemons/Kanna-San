const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require("discord.js")
const {
    ErrorMessage
} = require("../../fc")
const {
    joinVoiceChannel
} = require('@discordjs/voice');

module.exports = {
    name: "skip",
    aliases: ["s", "next"],
    cooldown: 2,
    permissions: [],
    description: "skips to the next song",

    run: async (client, message, args) => {
        try {

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
                .setDescription(`${client.emotes.error} | The queue is clean, Tohru cleaned it from a while`)
                .setColor(client.config.embed);

            if (!queue) return message.channel.send({
                embeds: [noqu]
            })
            const endoflist = new MessageEmbed()
            .setDescription(`${client.emotes.error} | There is no more songs to skip to`)
            .setColor(client.config.embed);
            
            if(queue.songs.length <= 1)return message.channel.send({embeds: [endoflist]})
            const song = queue.skip()

            const done = new MessageEmbed()
                .setDescription(`${client.emotes.success} | Song skippped as requested`)
                .setColor(client.config.embed);
            message.channel.send({
                embeds: [done]
            })

        } catch (e) {
            ErrorMessage(message, e)
        }
    }
}