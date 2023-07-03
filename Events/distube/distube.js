const client = require("../../index.js");
const { EmbedBuilder } = require("discord.js");
  
  module.exports = {
    name: "distube",
    /**
     *
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction) {
      const status = queue =>
  `<:_:1114723973335359488> Volumen: \`${queue.volume}%\` | Filtro: \`${queue.filters.names.join(', ') || 'Off'}\` | <:_:1114723962396622868> Bucle: \`${queue.repeatMode ? (queue.repeatMode === 2 ? 'Toda la cola' : 'Esta canción') : 'Off'
  }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``
client.distube
  .on('playSong', (queue, song) =>
    queue.textChannel.send({
      embeds: [new EmbedBuilder().setColor("Green")
        .setDescription(`<:_:1114723966360244275> Musica actual \`${song.name}\` - \`${song.formattedDuration}\`\nSolicitado por: ${song.user
          }\n${status(queue)}`)]
    })
  )
  .on('addSong', (queue, song) =>
    queue.textChannel.send(
      {
        embeds: [new EmbedBuilder().setColor("Green")
          .setDescription(`<a:_:1114723946277916735> Agregado ${song.name} - \`${song.formattedDuration}\` a la cola por ${song.user}`)]
      }
    )
  )
  .on('addList', (queue, playlist) =>
    queue.textChannel.send(
      {
        embeds: [new EmbedBuilder().setColor("Green")
          .setDescription(`<a:_:1114723946277916735> Agregado \`${playlist.name}\` <:_:1114723968193134613> Playlist (${playlist.songs.length
            } songs) to queue\n${status(queue)}`)]
      }
    )
  )
  .on('error', (channel, e) => {
    if (channel) channel.send(`<:_:1114723949981466736> Ocurrio un error: ${e.toString().slice(0, 1974)}`)
    else console.error(e)
  })
  .on('empty', channel => channel.send({
    embeds: [new EmbedBuilder().setColor("Red")
      .setDescription('<:_:1114723949981466736> ¡El canal de voz está vacío! dejando el canal...')]
  }))
  .on('searchNoResult', (message, query) =>
    message.channel.send(
      {
        embeds: [new EmbedBuilder().setColor("Red")
          .setDescription('`<:_:1114723949981466736> No se ha encontrado ningún resultado para \`${query}\`!`')]
      })
  )
  .on('finish', queue => queue.textChannel.send({
    embeds: [new EmbedBuilder().setColor("Green")
      .setDescription('<a:_:1114723946277916735> La musica ah sido finalizada!')]
  }))
    },
  };