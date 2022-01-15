const { MessageEmbed, MessageButton, MessagActionRow } = require("discord.js")
const client = require("../index")

const status = queue => `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.join(", ") || "Off"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode === 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``
client.distube
    .on("playSong", (queue, song) => queue.textChannel.send(
        `${client.emotes.play} | Playing \`${song.name}\``
    ))

    
    client.distube.on("addSong", (queue, song) => {
        let source
if (song.source === "youtube") {
    source = "<:YouTube:914836593615970364> YouTube";
} else {
    source = "<:SpotifyLogo:914834257640304650> Spotify"
}
        const addembed = new MessageEmbed()
            .setAuthor(
                {
               name: "Song Added Successfully!"
            }
               )
            .setDescription(`**Name**: \`${song.name}\`\n**Source**: [${source}](${song.url})`)
            .setFooter(`Duration: ${song.formattedDuration}`)
            .setThumbnail(song.thumbnail)        
            queue.textChannel.send({
                embeds: [addembed]
            })
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
    .on("empty", queue => queue.textChannel.send(`${client.emotes.loading} | Voice channel is empty! I will go to play with Saikawa`))
    .on("searchNoResult", message => message.channel.send(`${client.emotes.error} | No result found!`))
    .on("finish", queue => queue.textChannel.send(`${client.emotes.stop} | Yay the queue is empty! Time to go sleep...`))