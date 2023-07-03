const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const client = require('../../index');

module.exports = {
    mantenimiento: true,
    data: new SlashCommandBuilder()
        .setName("music")
        .setDescription("Reproduce música")
        .addSubcommand((subcommand) => subcommand .setName("play") .setDescription("Reproducir una canción") .addStringOption(option => option.setName('consulta') .setDescription('Proporcione el nombre o la URL de la canción..') .setRequired(true) ) )
        .addSubcommand((subcommand) => subcommand.setName("stop").setDescription("Detener la reproducción") )
        .addSubcommand((subcommand) => subcommand .setName("skip") .setDescription("Saltar a la siguiente canción") )
        .addSubcommand((subcommand) => subcommand .setName("resume") .setDescription("reanudar una canción.") )
        .addSubcommand((subcommand) => subcommand .setName("queue") .setDescription("Obtenga la lista de su cola actualmente activa.") )
        .addSubcommand((subcommand) => subcommand .setName("loop") .setDescription("Mostrar opciones de bucle.") .addStringOption(option => option.setName("opciones") .setDescription("Loop options: off, song, queue") .addChoices( { name: "apagado", value: "off" }, { name: "canción", value: "song" }, { name: "cola", value: "queue" }, ) .setRequired(true) ),)
        .addSubcommand((subcommand) => subcommand .setName("lyrics") .setDescription("Obtener la letra de una canción") .addStringOption(option => option.setName('titulo').setDescription('Proporcionar el título de la canción.').setRequired(true)))
        .addSubcommand((subcommand) => subcommand .setName("nowplaying") .setDescription("Mostrar información sobre la canción que se está reproduciendo actualmente.") )
        .addSubcommand((subcommand) => subcommand .setName("shuffle") .setDescription("Reproducir aleatoriamente la lista de reproducción actual.") )
        .addSubcommand((subcommand) => subcommand .setName("volume") .setDescription("Ajusta el volumen del reproductor.") .addIntegerOption(option => option.setName("volumen") .setDescription("10 = 10%") .setMinValue(0) .setMaxValue(100) .setRequired(true) ))
        .addSubcommand((subcommand) => subcommand .setName("forward") .setDescription("Segundos adelante en una canción.") .addIntegerOption(option => option.setName("segundos") .setDescription("Cantidad de segundos a reenviar. (10 = 10 s)") .setMinValue(0) .setRequired(true) ))
        .addSubcommand((subcommand) => subcommand .setName("rewind") .setDescription("Rebobinar segundos en una canción.") .addIntegerOption(option => option.setName("segundos") .setDescription("Cantidad de segundos para rebobinar. (10 = 10 s)") .setMinValue(0) .setRequired(true) ))/**/,
    async execute(interaction) {

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "play") {
            const { options, member, guild, channel } = interaction;
        
            const query = options.getString('consulta');
            const voiceChannel = member.voice.channel;
        
            const embed = new EmbedBuilder();
        
            if (!voiceChannel) {
              embed.setColor('Yellow').setDescription('> Debes estar en un canal de voz para ejecutar comandos de música.');
              return interaction.reply({ embeds: [embed], ephemeral: true });
            }
        
            if (!member.voice.channelId == guild.members.me.voice.channelId) {
              embed.setColor('Yellow').setDescription(`> No puedes usar el reproductor de música porque ya está activo en <#${guild.members.me.voice.channelId}>`);
              return interaction.reply({ embeds: [embed], ephemeral: true });
            }
        
            try {
              client.distube.play(voiceChannel, query, { textChannel: channel, member: member });
        
              const pauseButton = new ButtonBuilder()
                .setCustomId('pause')
                .setLabel('Pausar')
                .setStyle(ButtonStyle.Secondary);
        
              const skipButton = new ButtonBuilder()
                .setCustomId('skip')
                .setLabel('Saltar')
                .setStyle(ButtonStyle.Danger);
        
        const resumeButton = new ButtonBuilder()
          .setCustomId('resume')
          .setLabel('Reanudar')
          .setStyle(ButtonStyle.Success);
        
        
              const stopButton = new ButtonBuilder()
                .setCustomId('stop')
                .setLabel('Detener')
                .setStyle(ButtonStyle.Danger);
        
              const loopButton = new ButtonBuilder()
                .setCustomId('loop')
                .setLabel('Bucle')
                .setStyle(ButtonStyle.Success);
        
              const row = new ActionRowBuilder()
                .addComponents(pauseButton, skipButton, resumeButton, stopButton, loopButton);
        
              embed.setColor('Yellow').setDescription('<a:_:1114723985431728228> Puedes controlar la música con botones. O puede usar comandos para omitir, repetir, mezclar canciones, etc. Use /report-bug si encuentra algún error o problema.');
        
              const message = await interaction.reply({ embeds: [embed], components: [row] });
        
              // Add a listener for button interactions
              const filter = (i) => ['pause', 'skip', 'resume', 'stop', 'loop'].includes(i.customId) && i.user.id === interaction.user.id;
              const collector = message.createMessageComponentCollector({ filter, time: 1500000 });
        
              collector.on('collect', async (i) => {
                if (i.customId === 'pause') {
                  client.distube.pause(guild);
                  embed.setDescription('<:_:1114723963742982185> Musica pausada.');
                  await i.update({ embeds: [embed] });
                } else if (i.customId === 'skip') {
                  client.distube.skip(guild);
                  embed.setDescription('<:_:1114729153728630825> Musica saltada.');
                  await i.update({ embeds: [embed] });
                } else if (i.customId === 'resume') {
                  client.distube.resume(guild);
                  embed.setDescription('<:_:1114723966360244275> Musica reanuadada.');
                  await i.update({ embeds: [embed] });
                } else if (i.customId === 'stop') {
                  client.distube.stop(guild);
                  embed.setDescription('<:_:1114723963742982185> Musica detenida.');
                  await i.update({ embeds: [embed] });
                } else if (i.customId === 'loop') {
                  const toggle = client.distube.toggleAutoplay(guild);
                  embed.setDescription(`<:_:1114723962396622868> Bucle ${toggle ? 'activado' : 'desactivado'}.`);
                  await i.update({ embeds: [embed] });
                }
              });
        
              collector.on('end', () => {
                
                message.edit({ components: [] });
              });
            } catch (err) {
              console.log(err);
        
              embed.setColor('Yellow').setDescription('<:_:1114723949981466736> Algo salio mal...');
        
              return interaction.reply({ embeds: [embed], ephemeral: true });
            }
          

        } 
        else if (subcommand === "stop") {
            const { options, member, guild, channel } = interaction;
    
            const voiceChannel = member.voice.channel;
    
            const embed = new EmbedBuilder();
    
            if (!voiceChannel) {
                embed.setColor("Gold").setDescription("> Debe estar en un canal de voz para ejecutar comandos de música.");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
    
            if (!member.voice.channelId == guild.members.me.voice.channelId) {
                embed.setColor("Gold").setDescription(`> No puedes usar el reproductor de música porque ya está activo en <#${guild.members.me.voice.channelId}>`);
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
    
            try {
    
                const queue = await client.distube.getQueue(voiceChannel);
    
                if (!queue) {
                    embed.setColor("Gold").setDescription("> No hay cola activa.");
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }
    
                await queue.stop(voiceChannel);
                embed.setColor("Gold").setDescription("<:_:1114723963742982185> La cola se ha detenido.");
                return interaction.reply({ embeds: [embed], ephemeral: true });
    
            } catch (err) {
                console.log(err);
    
                embed.setColor("Gold").setDescription("<:_:1114723949981466736> Algo salio mal...");
    
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
        } 
        else if (subcommand === "skip") {
            const { options, member, guild, channel } = interaction;
    
            const voiceChannel = member.voice.channel;
    
            const embed = new EmbedBuilder();
    
            if (!voiceChannel) {
                embed.setColor("Gold").setDescription("> Debe estar en un canal de voz para ejecutar comandos de música.");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
    
            if (!member.voice.channelId == guild.members.me.voice.channelId) {
                embed.setColor("Gold").setDescription(`> No puedes usar el reproductor de música porque ya está activo en <#${guild.members.me.voice.channelId}>`);
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
    
            try {
    
                const queue = await client.distube.getQueue(voiceChannel);
    
                if (!queue) {
                    embed.setColor("Gold").setDescription("> No hay cola activa.");
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }
    
                await queue.skip(voiceChannel);
                embed.setColor("Gold").setDescription("<:_:1114729153728630825> La canción ha sido saltada.");
                return interaction.reply({ embeds: [embed], ephemeral: true });
    
            } catch (err) {
                console.log(err);
    
                embed.setColor("Gold").setDescription("<:_:1114723949981466736> Algo salio mal...");
    
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
        } 
        else if (subcommand === "resume") {
            const { options, member, guild, channel } = interaction;
        
            const voiceChannel = member.voice.channel;
        
            const embed = new EmbedBuilder();
        
            if (!voiceChannel) {
              embed.setColor("Gold").setDescription("> Debes estar en un canal de voz para ejecutar comandos de música.");
              return interaction.reply({ embeds: [embed], ephemeral: true });
            }
        
            if (!member.voice.channelId == guild.members.me.voice.channelId) {
              embed.setColor("Gold").setDescription(`> No puedes usar el reproductor de música porque ya está activo en <#${guild.members.me.voice.channelId}>`);
              return interaction.reply({ embeds: [embed], ephemeral: true });
            }
        
            try {
        
              const queue = await client.distube.getQueue(voiceChannel);
        
              if (!queue) {
                embed.setColor("Gold").setDescription("> No hay cola activa.");
                return interaction.reply({ embeds: [embed], ephemeral: true });
              }
        
              await queue.resume(voiceChannel);
              embed.setColor("Gold").setDescription("<:_:1114729153728630825> La canción ha sido reanudada..");
              return interaction.reply({ embeds: [embed], ephemeral: true });
        
            } catch (err) {
              console.log(err);
        
              embed.setColor("Gold").setDescription("<:_:1114723949981466736> Algo salio mal...");
        
              return interaction.reply({ embeds: [embed], ephemeral: true });
            }
          } 
        else if (subcommand === "queue") {
            const { options, member, guild, channel } = interaction;
    
            const voiceChannel = member.voice.channel;
    
            const embed = new EmbedBuilder();
    
            if (!voiceChannel) {
                embed.setColor("Gold").setDescription("> Debes estar en un canal de voz para ejecutar comandos de música.");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
    
            if (!member.voice.channelId == guild.members.me.voice.channelId) {
                embed.setColor("Gold").setDescription(`> No puedes usar el reproductor de música porque ya está activo en <#${guild.members.me.voice.channelId}>`);
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
    
            try {
    
                const queue = await client.distube.getQueue(voiceChannel);
    
                if (!queue) {
                    embed.setColor("Gold").setDescription("> No hay cola activa.");
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }
    
                embed.setColor("Gold").setDescription(`${queue.songs.map(
                    (song, id) => `\n**${id + 1}.** ${song.name} -\`${song.formattedDuration}\``
                )}`);
                return interaction.reply({ embeds: [embed], ephemeral: true });
    
            } catch (err) {
                console.log(err);
    
                embed.setColor("Gold").setDescription("<:_:1114723949981466736> Algo salio mal...");
    
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
        } 
        else if (subcommand === "loop") {
            const { member, options, guild } = interaction;
            const option = options.getString("opciones");
            const voiceChannel = member.voice.channel;
    
            const embed = new EmbedBuilder();
    
            if (!voiceChannel) {
                embed.setColor("Gold").setDescription("> Debes estar en un canal de voz para ejecutar comandos de música.");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
    
            if (!member.voice.channelId == guild.members.me.voice.channelId) {
                embed.setColor("Gold").setDescription(`> No puedes usar el reproductor de música porque ya está activo en <#${guild.members.me.voice.channelId}>`);
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
    
            try {
                const queue = await client.distube.getQueue(voiceChannel);
    
                if (!queue) {
                    embed.setColor("Gold").setDescription("> No hay cola activa.");
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }
    
                let mode = null;
    
                switch (option) {
                    case "off":
                        mode = 0;
                        break;
                    case "song":
                        mode = 1;
                        break;
                    case "queue":
                        mode = 2;
                        break;
                }
    
                mode = await queue.setRepeatMode(mode);
    
                mode = mode ? (mode === 2 ? "cola de repetición" : "repetir canción") : "Apagado";
    
                embed.setColor("Gold").setDescription(`<:_:1114723962396622868> Establezca el modo de repetición en \`${mode}\`.`);
                return interaction.reply({ embeds: [embed], ephemeral: true });
            } catch (err) {
                console.log(err);
    
                embed.setColor("Gold").setDescription("> <:_:1114723949981466736> Something went wrong...");
    
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
    
        } 
        else if (subcommand === "forward") {
            const { options, member, guild } = interaction;
            const voiceChannel = member.voice.channel;
    
            const embed = new EmbedBuilder();
    
            if (!voiceChannel) {
                embed.setColor("Gold").setDescription("> Debe estar en un canal de voz para ejecutar comandos de música.");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
    
            if (!member.voice.channelId == guild.members.me.voice.channelId) {
                embed.setColor("Gold").setDescription(`> No puedes usar el reproductor de música porque ya está activo en <#${guild.members.me.voice.channelId}>`);
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
    
            try {
    
                const queue = await client.distube.getQueue(voiceChannel);
    
                if (!queue) {
                    embed.setColor("Gold").setDescription("> No hay cola activa.");
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }
    
                await queue.seek(queue.currentTime + seconds);
                embed.setColor("Gold").setDescription(`> <:_:1114729153728630825> Reenvió la canción para \`${seconds}s\`.`);
                return interaction.reply({ embeds: [embed], ephemeral: true });
    
            } catch (err) {
                console.log(err);
    
                embed.setColor("Gold").setDescription("> <:_:1114723949981466736> Algo salió mal...");
    
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
        } 
        else if (subcommand === "lyrics") {
            const title = interaction.options.getString('titulo');
        
            const embed = new EmbedBuilder();
            await interaction.deferReply();
        
            await axios.get(`https://some-random-api.ml/lyrics?title=${title}`).then(async (data) => {
              embed
                .setColor('Gold')
                .setTitle(`${data.data.title}`)
        
                .setThumbnail(data.data.thumbnail.genius)
                .setFooter({ text: `Cancion por ${data.data.author}` })
                .setDescription(`${data.data.lyrics.slice(0, 4096)}`);
        
              await interaction.editReply({ embeds: [embed] });
            }).catch(() => {
              embed
                .setColor('Gold')
                .setDescription(`> No pude encontrar ninguna canción con ese título.`);
              return interaction.editReply({ embeds: [embed], ephemeral: true });
            });
          } 
        else if (subcommand === "nowplaying") {
            const { member, guild } = interaction;
            const voiceChannel = member.voice.channel;
    
            const embed = new EmbedBuilder();
    
            if (!voiceChannel) {
                embed.setColor("Gold").setDescription("> Debe estar en un canal de voz para ejecutar comandos de música.");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
    
            if (!member.voice.channelId == guild.members.me.voice.channelId) {
                embed.setColor("Gold").setDescription(`> No puedes usar el reproductor de música porque ya está activo en <#${guild.members.me.voice.channelId}>`);
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
    
            try {
    
                const queue = await client.distube.getQueue(voiceChannel);
    
                if (!queue) {
                    embed.setColor("Gold").setDescription("> No hay cola activa.");
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }
    
                const song = queue.songs[0];
                embed.setColor("Gold").setDescription(`<a:_:1114723980486639687> **Reproducción en curso:** \`${song.name}\` - \`${song.formattedDuration}\`.\n**Link:** ${song.url}`).setThumbnail(song.thumbnail);
                return interaction.reply({ embeds: [embed], ephemeral: true });
    
            } catch (err) {
                console.log(err);
    
                embed.setColor("Gold").setDescription("<:_:1114723949981466736> Algo salio mal...");
    
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
        } 
        else if (subcommand === "rewind") {
            const { options, member, guild } = interaction;
            const seconds = options.getInteger("segundos");
            const voiceChannel = member.voice.channel;
    
            const embed = new EmbedBuilder();
    
            if (!voiceChannel) {
                embed.setColor("Gold").setDescription("Debes estar en un canal de voz para ejecutar comandos de música.");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
    
            if (!member.voice.channelId == guild.members.me.voice.channelId) {
                embed.setColor("Gold").setDescription(`No puedes usar el reproductor de música porque ya está activo en <#${guild.members.me.voice.channelId}>`);
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
    
            try {
    
                const queue = await client.distube.getQueue(voiceChannel);
    
                if (!queue) {
                    embed.setColor("Gold").setDescription("No hay cola activa.");
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }
    
                await queue.seek(queue.currentTime - seconds);
                embed.setColor("Gold").setDescription(`<:_:1114729145918824519> Rebobinado la canción para \`${seconds}s\`.`);
                return interaction.reply({ embeds: [embed], ephemeral: true });
    
            } catch (err) {
                console.log(err);
    
                embed.setColor("Gold").setDescription("<:_:1114723949981466736> Algo salio mal...");
    
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
        } 
        else if (subcommand === "shuffle") {
            const { member, guild } = interaction;
            const voiceChannel = member.voice.channel;
    
            const embed = new EmbedBuilder();
    
            if (!voiceChannel) {
                embed.setColor("Gold").setDescription("> Debes estar en un canal de voz para ejecutar comandos de música.");
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
    
            if (!member.voice.channelId == guild.members.me.voice.channelId) {
                embed.setColor("Gold").setDescription(`> No puedes usar el reproductor de música porque ya está activo en <#${guild.members.me.voice.channelId}>`);
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
    
            try {
    
                const queue = await client.distube.getQueue(voiceChannel);
    
                if (!queue) {
                    embed.setColor("Gold").setDescription("No hay cola activa.");
                    return interaction.reply({ embeds: [embed], ephemeral: true });
                }
    
                await queue.shuffle();
                embed.setColor("Gold").setDescription(`<:_:1114723966360244275> Canciones aleatorias en la cola.`);
                return interaction.reply({ embeds: [embed], ephemeral: true });
    
            } catch (err) {
                console.log(err);
    
                embed.setColor("Gold").setDescription("<:_:1114723949981466736> Algo salio mal...");
    
                return interaction.reply({ embeds: [embed], ephemeral: true });
            }
        } 
        else if (subcommand === "volume") {
            const { member, guild, options } = interaction;
            const voiceChannel = member.voice.channel;
        
            const embed = new EmbedBuilder();
        
            if (!voiceChannel) {
              embed.setColor("Gold").setDescription("> Debes estar en un canal de voz para ejecutar comandos de música.");
              return interaction.reply({ embeds: [embed], ephemeral: true });
            }
        
            if (!member.voice.channelId == guild.members.me.voice.channelId) {
              embed.setColor("Gold").setDescription(`> No puedes usar el reproductor de música porque ya está activo en <#${guild.members.me.voice.channelId}>`);
              return interaction.reply({ embeds: [embed], ephemeral: true });
            }
        
            try {
        
              client.distube.setVolume(voiceChannel, volume);
              return interaction.reply({ content: `<:_:1114723973335359488>El volumen se ha establecido en ${volume}%.` });
        
            } catch (err) {
              console.log(err);
        
              embed.setColor("Gold").setDescription("<:_:1114723949981466736> Algo salio mal...");
        
              return interaction.reply({ embeds: [embed], ephemeral: true });
            }
          }
    },
};
