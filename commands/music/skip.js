const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js")
const {ErrorMessage} = require("../../fc")

module.exports = {
    name: "skip",
    aliases: ["s", "next"],
    cooldown: 2,
    permissions: [],
    description: "skips to the next song",

run: async (client, message, args) => {
try{
    const novc = new MessageEmbed()
        .setDescription(`${client.emotes.error} | You are not connected to a VC`)
        .setColor(client.config.embed);

        const member = await message.guild.members.cache.get(message.author.id);
        if(!member.voice.channelId || member.voice.channelId === null)return message.channel.send({ embeds: [novc]})

    const queue = client.distube.getQueue(message)

    const noqu = new MessageEmbed()
    .setDescription(`${client.emotes.error} | The queue is clean, Tohru cleaned it from a while`)
    .setColor(client.config.embed);

    if(!queue) return message.channel.send({ embeds: [noqu] })
    
    const song = queue.skip()

    const done = new MessageEmbed()
    .setDescription(`${client.emotes.success} | Song Skippped, Kobayashi helped with that`)
    .setColor(client.config.embed);
        message.channel.send({ embeds: [done] })
   
} catch (e) {ErrorMessage(message, e)}
}
}