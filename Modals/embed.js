const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits, PermissionsBitField} = require("discord.js");

module.exports = {
  data: { name: `embed`, },
  async execute(interaction, client) {

    const { options } = interaction;

    //const channel = options.getChannel('channel');
    const { guild } = interaction;
    //const webhook = await interaction.channel.createWebhook({ name: `${guild.name}`, /*avatar: interaction.user.displayAvatarURL(),*/ avatar: `${guild.iconURL({ dynamic: true })}`, });
    const webhook = await interaction.channel.createWebhook({ name: `Castores Trucking`, avatar: `${guild.iconURL({ dynamic: true })}`});

    const image = interaction.fields.getTextInputValue("image") || null;
    const thumbnail = interaction.fields.getTextInputValue("thumbnail") || null;
    const url = interaction.fields.getTextInputValue("url") || null;
    //const footericon = interaction.fields.getTextInputValue("footericon") || null;
    //const channel = interaction.channel.getChannel("channel")

    const embed = new EmbedBuilder()
      .setTitle(`${interaction.fields.getTextInputValue("title")}`)
      .setDescription(`${interaction.fields.getTextInputValue("description")}`)
      .setImage(image)
      .setThumbnail(thumbnail)
      .setURL(url)
      //.setFooter({ text: `${interaction.fields.getTextInputValue("footer")}`, iconURL: `${footericon}` })
      //.setImage(`\`\`\`${interaction.fields.getTextInputValue("image")}\`\`\``);

    await webhook.send({ embeds: [embed], });

    await webhook.delete();

    await interaction.reply({ content: `embed sent successfully`, ephemeral: true, });
  },
};
