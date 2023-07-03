const { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits, ButtonBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Obtener las informacion del Bot')
        .addSubcommand(subcommand => subcommand .setName("webhook") .setDescription("🖋・Envia un embed personalizado con Webhook") )
        .addSubcommand(subcommand =>  subcommand .setName('bot') .setDescription("🖋・Create your custom embed with the Bot")
            .addStringOption(option => option.setName('title') .setDescription('Set the title text') .setRequired(true) )
            .addStringOption(option => option.setName('description') .setDescription('set the description') .setRequired(true) )
            .addStringOption(option => option.setName('image') .setDescription('Paste an image URL') .setRequired(false) )
            .addStringOption(option => option.setName('thumbnail') .setDescription('Paste an image URL') .setRequired(false)))
        .addSubcommand(subcommand =>  subcommand .setName('button') .setDescription("🖋・Create your custom embed with the URL Button Bot")
            .addStringOption(option => option.setName('title') .setDescription('Set the title text') .setRequired(true) )
            .addStringOption(option => option.setName('description') .setDescription('set the description') .setRequired(true) )
            .addStringOption(option => option.setName('url') .setDescription('page url') .setRequired(true))
            .addStringOption(option => option.setName('image') .setDescription('Paste an image URL') .setRequired(false) )
            .addStringOption(option => option.setName('thumbnail') .setDescription('Paste an image URL') .setRequired(false) ))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */

    async execute(interaction, client) {
        const { options } = interaction;
        
        if (interaction.options.getSubcommand() === 'webhook') {
            const modal = new ModalBuilder()
              .setCustomId(`embed`)
              .setTitle(`Send a code to the channel`);
            const channel = options.getChannel('channel');
        
            //const author = new TextInputBuilder() .setCustomId(`author`) .setLabel(`author`) .setRequired(false) .setStyle(TextInputStyle.Short) .setMaxLength(256);
            const title = new TextInputBuilder() .setCustomId(`title`) .setLabel(`title`) .setRequired(true) .setStyle(TextInputStyle.Short) .setMaxLength(256);
            const description = new TextInputBuilder() .setCustomId(`description`) .setLabel(`description`) .setRequired(true) .setStyle(TextInputStyle.Paragraph) .setMaxLength(900);
            const image = new TextInputBuilder() .setCustomId(`image`) .setLabel(`image`) .setRequired(false) .setStyle(TextInputStyle.Paragraph) .setMaxLength(50) || null;
            const thumbnail = new TextInputBuilder() .setCustomId(`thumbnail`) .setLabel(`thumbnail`) .setRequired(false) .setStyle(TextInputStyle.Paragraph) .setMaxLength(50) || null;
            const url = new TextInputBuilder() .setCustomId(`url`) .setLabel(`Url`) .setRequired(false) .setStyle(TextInputStyle.Paragraph) .setMaxLength(50) || null;
            //const footer = new TextInputBuilder() .setCustomId(`footer`) .setLabel(`footer`) .setRequired(false) .setStyle(TextInputStyle.Paragraph) .setMaxLength(50) || null;
            //const footericon = new TextInputBuilder() .setCustomId(`footericon`) .setLabel(`footer icon`) .setRequired(false) .setStyle(TextInputStyle.Paragraph) .setMaxLength(50) || null;
        
            //modal.addComponents(new ActionRowBuilder().addComponents(author));
            modal.addComponents(new ActionRowBuilder().addComponents(title));
            modal.addComponents(new ActionRowBuilder().addComponents(description));
            modal.addComponents(new ActionRowBuilder().addComponents(thumbnail));
            modal.addComponents(new ActionRowBuilder().addComponents(image));
            modal.addComponents(new ActionRowBuilder().addComponents(url));
            //modal.addComponents(new ActionRowBuilder().addComponents(footer));
            //modal.addComponents(new ActionRowBuilder().addComponents(footericon));
        
            await interaction.showModal(modal, channel);
          }  

        else if (interaction.options.getSubcommand() === 'bot') {
            ///////////////////////////////////////////////////////
            const title = options.getString('title');
            const description = options.getString('description');
            const image = options.getString('image');
            const thumbnail = options.getString('thumbnail');
            const url = options.getString('url');
            ///////////////////////////////////////////////////////
            const embed = new EmbedBuilder()
                .setTitle(title)
                .setDescription(description)
                .setColor(client.color)
                .setImage(image)
                .setThumbnail(thumbnail)
                .setURL(url)
                .setTimestamp()
                .setFooter({ text: interaction.member.user.tag, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
         
                  interaction.channel.send({ embeds: [embed]});
            await interaction.reply({content: `embed sent successfully`, ephemeral: true});
        }  

        else if (interaction.options.getSubcommand() === 'bot-button') {
            const button = new ActionRowBuilder().addComponents(
              new ButtonBuilder() .setLabel(`Click here`) .setURL(url) .setEmoji("<:Link_verde:1098049176337666109>") .setStyle(ButtonStyle.Primary),)

            ///////////////////////////////////////////////////////
            const title = options.getString('title');
            const description = options.getString('description');
            const image = options.getString('image');
            const thumbnail = options.getString('thumbnail');
            const url = options.getString('url');
            ///////////////////////////////////////////////////////
            const embed = new EmbedBuilder()
                .setTitle(title)
                .setDescription(description)
                .setColor(client.color)
                .setImage(image)
                .setThumbnail(thumbnail)
                .setTimestamp()
                .setURL(url)
                .setFooter({ text: interaction.member.user.tag, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
         
                  interaction.channel.send({ embeds: [embed], components: [button]});
            await interaction.reply({content: `embed sent successfully`, ephemeral: true});
        }
    },
};
