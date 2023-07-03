const { SlashCommandBuilder, CommandInteraction, PermissionFlagsBits, PermissionsBitField, EmbedBuilder, ChatInputCommandInteraction, Client, ChannelType, UserFlags, version, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, } = require('discord.js');
const { connection } = require("mongoose");
const os = require("os");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bot')
        .setDescription('Obtener las informacion del Bot')
        .addSubcommand(subcommand => subcommand .setName("info") .setDescription("Obtener informacion del bot") )
        /**/,

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */

    async execute(interaction, client) {
        const status = ["Desconectado", "Conectado", "Conectando", "Desconectado" ];
        const { user } = interaction;
        await client.user.fetch();
        await client.application.fetch();
        const getChannelTypeSize = type => client.channels.cache.filter(channel => type.includes(channel.type)).size;
        
        if (interaction.options.getSubcommand() === 'info') {
            const embed = new EmbedBuilder()
                    .setColor("Random")
                    .setTitle(`ℹ・Información del bot`)
                    .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                    .setDescription(client.application.description || null)
                    .addFields(
                        { name: "⛔ Cliente", value: client.user.tag, inline: true },
                        { name: "⛔ Creado", value: `<t:${parseInt(client.user.createdTimestamp / 1000)}:R>`, inline: true },
                        { name: "⛔ Verificado", value: client.user.flags & UserFlags.VerifiedBot ? "Yes" : "No", inline: true },
                        { name: "📌 Owner", value: `${client.application.owner.tag || "None"}`, inline: true },
                        { name:"📔 Database", value: status[connection.readyState], inline: true },
                        { name: "💻 Sistema", value: os.type().replace("Windows_NT", "Windows").replace("Darwin", "macOS"), inline: true },
                        { name: "🖥 Modelo del CPU", value: `${os.cpus()[0].model}`, inline: true },
                        { name: "⛔ Uso del CPU", value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}%`, inline: true },
                        { name: "📤 Activo", value: `<t:${parseInt(client.readyTimestamp / 1000)}:R>`, inline: true },
                        { name:"💾 Node.js", value: process.version, inline: true },
                        { name: "💝  Discord.js", value: version, inline: true },
                        { name: " 📡 Ping", value: `${client.ws.ping}ms`, inline: true },
                        { name: "⚒️ Comandos", value: `${client.commands.size}`, inline: true },
                        { name: "💵 Servidores", value: `${client.guilds.cache.size}`, inline: true },
                        { name: "⚖️ Usuarios", value: `${client.guilds.cache.reduce((acc, guild) => acc+guild.memberCount, 0)}`, inline: true },
                        { name: "💞 Canales de Texto", value: `${getChannelTypeSize([ChannelType.GuildText, ChannelType.GuildNews])}`, inline: true },
                        { name: " 🔉 Canales de Voz", value: `${getChannelTypeSize([ChannelType.GuildVoice, ChannelType.GuildStageVoice])}`, inline: true },
                        { name: "💘 Hilos", value: `${getChannelTypeSize([ChannelType.GuildPublicThread, ChannelType.GuildPrivateThread, ChannelType.GuildNewsThread])}`, inline: true }
                    )
                    .setFooter({ text: `Solicitado por: ${user.tag}`, iconURL: `${user.displayAvatarURL({ dynamic: true })}` })
                await interaction.channel.sendTyping(), await interaction.reply({ embeds: [embed], ephemeral: true });
            
        } 

        else if (interaction.options.getSubcommand() === 'invite') {
            
            if(interaction.member.id !== '722575141665505300') return interaction.reply({ content: 'Este comando está bloqueado solo puede utilizar mi creador', ephemeral: true});
            const embed = new EmbedBuilder()
                  .setColor(client.color)
                  .setTitle('Invitación de Truckero Bot')
                  .setURL('https://discord.gg/JA7gJTxqd4')
                  .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
                  .setDescription('Si quieres invitarme a tu servidor o unirte al mío solamente\n\n Por ahora estoy en desarrollo pero tengo muchas funciones utiles!\n> Puedes probarlas utilizando la barra diagonal / y así podrás ver todos mis comandos!')
                  .addFields([
                      {
                          name: '<:Discord:1097748688828383382>・Server Soporte',
                          value: '[Truckero | Development](https://discord.gg/JA7gJTxqd4)',
                          inline: true
                      },
                      {
                          name: '<:bot:1097749645058379898>・Invite Bot',
                          value: '[Click Aqui](https://discord.com/api/oauth2/authorize?client_id=1060048654523711598&permissions=8&scope=bot)',
                          inline: true
                      },
                  ])
                  .setFooter({ text: `Solicitado por: ${user.tag}`, iconURL: `${user.displayAvatarURL({ dynamic: true })}` })
                  .setTimestamp();
                await interaction.channel.sendTyping(), await interaction.reply({ embeds: [embed], ephemeral: true });
        }  

        else if (interaction.options.getSubcommand() === 'ping') {
            const embed = new EmbedBuilder()
                    .setColor(client.color)
                    .setTitle('🏓・Pong')
                    .setDescription('Echa un vistazo a lo rápido que es nuestro bot')
                    .addFields([
                        {
                            name: '🤖・Latencia del Bot',
                            value: `${client.ws.ping}\ ms`,
                        }
                    ])
                    .setFooter({ text: `Solicitado por: ${user.tag}`, iconURL: `${user.displayAvatarURL({ dynamic: true })}` })
                    .setTimestamp()
                await interaction.channel.sendTyping(), await interaction.reply({ embeds: [embed], ephemeral: true });
        } 
        
        else if (interaction.options.getSubcommand() === 'owner') {
            const embed = new EmbedBuilder()
                  .setColor(client.color)
                  .setTitle('Información del creador del bot')
                  .setThumbnail('https://i.imgur.com/r7x1y90.jpg')
                  .addFields([
                      {
                          name: '👑・Nombre del propietario',
                          value: 'Luciano',
                          inline: true
                      },
                      {
                          name: '🏷・Discord tag',
                          value: '!LucianoTruck#3210',
                          inline: true
                      },
                      {
                          name: '🏢・Organización',
                          value: '[Castores Trucking VTC](https://discord.gg/bHPr5zDZJX)\n[Truckero | Development](https://discord.gg/JA7gJTxqd4)',
                          inline: true
                      },
                      {
                          name: '📡・Twitch',
                          value: '[LucianoTruck22](https://www.twitch.tv/lucianotruck22)',
                          inline: true
                      },
                  ])
                  .setFooter({ text: `Solicitado por: ${user.tag}`, iconURL: `${user.displayAvatarURL({ dynamic: true })}` })
                  .setTimestamp()
                await interaction.channel.sendTyping(), await interaction.reply({ embeds: [embed], ephemeral: true });
            } 
        
        else if (interaction.options.getSubcommand() === 'say') {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({content: `No tienes permisos para configurar AutoMod dentro de este servidor`, ephemeral: true})
             let channel = interaction.options.getChannel("channel");
            if (!channel) { channel = interaction.channel; }
 
             let saymodal = new ModalBuilder() .setCustomId("say") .setTitle("Di algo a través del bot");
             let sayquestion = new TextInputBuilder() .setCustomId("say") .setLabel("Di algo") .setPlaceholder("Escribe algo...") .setStyle(TextInputStyle.Paragraph) .setRequired(true);
             let sayembed = new TextInputBuilder() .setCustomId('embed') .setLabel("Embed modo encendido/apagado?")  .setPlaceholder("on/off") .setStyle(TextInputStyle.Short) .setRequired(false);
             let say = new ActionRowBuilder().addComponents(sayquestion);
             let sayemb = new ActionRowBuilder().addComponents(sayembed);
 
             saymodal.addComponents(say, sayemb)
 
             await interaction.showModal(saymodal)
 
             
             try {
                 let response = await interaction.awaitModalSubmit({time: 300000});
                 let message = response.fields.getTextInputValue('say');
                 let embedsay = response.fields.getTextInputValue('embed');
                 const embed = new EmbedBuilder() .setDescription(message) .setColor(client.color);
                 if (embedsay === "on" || embedsay === "On") { await channel.send({embeds: [embed]}) } else { await channel.send(message) }
 
                 await response.reply({content: "Su mensaje ha sido enviado con éxito", ephemeral: true})
            } catch (error) { console.error(error)
                 return;
             }
         }
    },
};
