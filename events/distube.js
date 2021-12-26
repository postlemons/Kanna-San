const { MessageEmbed, MessageButton, MessagActionRow } = require("discord.js")
const client = require("../index")

const status = queue => `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.join(", ") || "Off"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode === 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``
client.distube
    .on("playSong", (queue, song) => queue.textChannel.send(
        `${client.emotes.play} | Playing \`${song.name}\``
    ))

    

    new MessageEmbed()
    client.distube.on("addSong", (queue, song) => {
        let queues = client.distube.getQueue(message)
        if(queues.songs.size < 1){
        queue.textChannel.send(
        new MessageEmbed()
        .setAuthor("Song Added Successfully!", "https://emoji.gg/assets/emoji/6115-dance.gif")
        .setDescription(`**Name**: \`${song.name}\`\n**Duration**: \`${song.formattedDuration}\`\n**Volume**: \`${queue.volume}\``)
        .setThumbnail(song.thumbnail)
    )
    } else {
        return
    }
})
    client.distube
    .on("addList", (queue, playlist) => queue.textChannel.send(
        `${client.emotes.success} | Added \`${playlist.name}\` playlist (${playlist.songs.length} songs) to queue\n${status(queue)}`
    ))
    // DisTubeOptions.searchSongs = true
    .on("searchResult", (message, result) => {
        let i = 0
        message.channel.send(`**Choose an option from below**\n${result.map(song => `**${++i}**. ${song.name} - \`${song.formattedDuration}\``).join("\n")}\n*Enter anything else or wait 60 seconds to cancel*`)
    })
    // DisTubeOptions.searchSongs = true
    .on("searchCancel", message => message.channel.send(`${client.emotes.error} | Searching canceled`))
    .on("error", (channel, e) => {
        channel.send(`${client.emotes.error} | An error encountered: ${e}`)
        console.error(e)
    })
    .on("empty", channel => channel.send(`${client.emotes.loading} | Voice channel is empty! I will go to play with Saikawa`))
    .on("searchNoResult", message => message.channel.send(`${client.emotes.error} | No result found!`))
    .on("finish", queue => queue.textChannel.send(`${client.emotes.stop} | Yay the queue is empty! Time to go play...`))