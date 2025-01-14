const {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  Message
} = require("discord.js")
const {
  ErrorMessage
} = require("../../fc")
const client = require("../../index")
module.exports = {
  name: "invite",
  description: "Bot invite link",
  aliases: ["in"],
  cooldown: "1",

  run: (client, message, args) => {
    try {
      let prefix;
      prefix = client.db.get(`prefix_${message.guild.id}`)
      if (!prefix) prefix = client.config.prefix
      const buttons = new MessageActionRow().addComponents(
        new MessageButton()
        .setEmoji("")
        .setStyle("LINK")
        .setURL("")
      )
      const invite = new MessageEmbed()
        .setColor(client.config.embed)
        .setDescription(`Invite link is below Senpai!, thanks for using adding me!\n`)
        .setThumbnail(client.user.displayAvatarURL())
        //.setImage("https://cdn.discordapp.com/attachments/692555215299411989/940403183434489906/hkcd36els2y71.gif")
        .setTimestamp()

      return message.channel.send({
        embeds: [invite],
        components: [buttons]
      })
    } catch (e) {
      ErrorMessage(message, e)
    }
  }
}