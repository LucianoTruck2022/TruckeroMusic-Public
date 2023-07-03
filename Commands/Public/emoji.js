const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder,ButtonStyle } = require("discord.js");
const { default: axios } = require(`axios`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('emoji')
        .setDescription('Acceso exclusivo de mi creador')
        .addSubcommand(subcommand => subcommand .setName('info') .setDescription('Remover de algun server tu bot') .addStringOption((option) => option.setName(`emoji`).setDescription(`El emoji`).setRequired(true)) )
        .addSubcommand(subcommand => subcommand .setName('robar') .setDescription("Este comando solo lo puede usar mi creador").addStringOption((option) => option .setName(`emoji`).setDescription(`¿Qué emoji quieres añadir al servidor?`).setRequired(true)).addStringOption((option) => option .setName(`nombre`) .setDescription(`¿Qué nombre le quieres dar?`) .setRequired(true)))
        .addSubcommand(subcommand => subcommand .setName('list').setDescription('Muestra la lista de servidores con las Ids de los servidor en los que está tu bot.')),
            /**
             * 
             * @param {ChatInputCommandInteraction} interaction
             */

    async execute(interaction, client) {
        const { user, guild, options } = interaction
        
        if (interaction.options.getSubcommand() === 'info') {
            await client.user.fetch();
            await client.application.fetch();
            const emoji = interaction.options.getString(`emoji`);
            if (!emoji.startsWith(`<`)) return interaction.reply({ content: `¡Proporcione un emoji personalizado!`, ephemeral: true, });
            const emojiid = emoji.split(`:`)[2].slice(0, -1);
            const emojiurl = `https://cdn.discordapp.com/emojis/${emojiid}.png`;
            /////////CODIGO////////
            const embed = new EmbedBuilder()
                .setAuthor({ name: `${guild.name}`, iconURL: `${guild.iconURL({ dynamic: true })}`})
                .setTitle(`Emoji Info`)
                .addFields({name: "Info Del General", value: [`<:User:1097740467950604328> **Nombre:** ${emoji}`, `👑 **ID:** ${emojiid}`, `<:Link_verde:1098049176337666109> **URL:** [Haga clic aquí](${emojiurl})`].join("\n")})
                .setColor(client.color)
                .setThumbnail(`${emojiurl}`)
                .setFooter({ text: `Solicitado por: ${interaction.user.tag}`, iconURL: `${user.displayAvatarURL({ dynamic: true })}`})
                .setTimestamp()

        interaction.reply({ embeds: [embed], ephemeral: true  });
        }

        else if (interaction.options.getSubcommand() === 'robar') {
            let emoji = interaction.options.getString(`emoji`)?.trim();
            const name = interaction.options.getString(`nombre`);
        
            if (emoji.startsWith("<") && emoji.endsWith(">")) {
              const id = emoji.match(/\d{15,}/g)[0];
        
              const type = await axios
                .get(`https://cdn.discordapp.com/emojis/${id}.gif`)
                .then((image) => {
                  if (image) return "gif";
                  else return "png";
                })
                .catch((err) => {
                  return "png";
                });
        
              emoji = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`;
            }
        
            if (!emoji.startsWith("http")) {
              return await interaction.reply({
                content: "❌ No puedes robar emojis predeterminados de discord",
                ephemeral: true,
              });
            }
            if (!emoji.startsWith("https")) {
              return await interaction.reply({
                content: "❌ No puedes robar emojis predeterminados de discord",
                ephemeral: true,
              });
            }
        
            interaction.guild.emojis
              .create({ attachment: `${emoji}`, name: `${name}` })
              .then((emoji) => {
                const embed = new EmbedBuilder()
                  .setColor(client.color)
                  .setDescription(
                    `${emoji} ha sido añadido correctamente con el nombre **${name}**`
                  );
                return interaction.reply({ embeds: [embed], ephemeral: true });
              })
              .catch((err) => {
                interaction.reply({
                  content: "❌ Has alcanzado el límite de emojis en este servidor",
                  ephemeral: true,
                });
              });      
        }

        else if (interaction.options.getSubcommand() === 'list') {
            const emojis = interaction.guild.emojis.cache.map((e) => `${e} | \`${e}\``);
            const pageSize = 10;
            const pages = Math.ceil(emojis.length / pageSize);
            let currentPage = 0;
            const { guild } = interaction;
            const { user } = interaction;
            await client.user.fetch();
            await client.application.fetch();
        
            const generateEmbed = (page) => { const start = page * pageSize; const end = start + pageSize; const emojiList = emojis.slice(start, end).join("\n") || "This server has no emojis.";
        
              const embed = new EmbedBuilder()
                .setAuthor({ name: `${guild.name}`, iconURL: `${guild.iconURL({ dynamic: true })}`})
                .setTitle(`Emojis (Page ${page + 1} of ${pages})`) 
                .setDescription(`${emojiList}`) .setColor(client.color)
                .setFooter({ text: `Fue solicitado por: ${interaction.user.tag}`, iconURL: `${user.displayAvatarURL({ dynamic: true })}`});
              return embed;
            }
        
            const row = new ActionRowBuilder()
              .addComponents( new ButtonBuilder() .setCustomId('previous') .setLabel('Previous') .setStyle(ButtonStyle.Primary), new ButtonBuilder() .setCustomId('next') .setLabel('Next') .setStyle(ButtonStyle.Primary), );
        
            const message = await interaction.reply({ embeds: [generateEmbed(currentPage)], components: [row], fetchReply: true, ephemeral: true });
        
             const collector = await message.createMessageComponentCollector();
        
            collector.on('collect', async interaction => {
              if (interaction.customId === 'previous') { currentPage--;
                if (currentPage < 0) { currentPage = pages - 1; }
              } else if (interaction.customId === 'next') { currentPage++;
                if (currentPage > pages - 1) { currentPage = 0; }
              }
              await interaction.update({ embeds: [generateEmbed(currentPage)], components: [row], ephemeral: true });
            });
        
            collector.on('end', async () => {
              row.components.forEach((c) => {
                c.setDisabled(true);
              });
              await message.edit({ components: [row], ephemeral: true });
            });
          }
    },
};
