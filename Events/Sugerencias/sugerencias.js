const { ButtonInteraction, ActionRowBuilder, TextInputBuilder, TextInputStyle, ModalBuilder, EmbedBuilder, } = require("discord.js");
  
  const sugSchema = require("../../Schemas/sugSchema");
  
  module.exports = {
    name: "interactionCreate",
    /**
     *
     * @param {ButtonInteraction} interaction
     */
    async execute(interaction) {
      if (!interaction.isButton()) return;
  
      const Data = await sugSchema.findOne({ messageID: interaction.message.id });
  
      let noMembers;
      let siMembers;
  
      if (Data) {
        noMembers = Data.no;
        siMembers = Data.si;
      } else {
      }
  
      const splittedArray = interaction.customId.split(`-`);
      if (splittedArray[0] !== `Sug`) return;
  
      const sugEmbed = interaction.message.embeds[0];
  
      const yesField = sugEmbed.fields[0];
      const noField = sugEmbed.fields[1];
  
      switch (splittedArray[1]) {
        case "Yes":
          {
            if (Data.no.includes(interaction.user.id)) {
              const index = await noMembers.indexOf(interaction.user.id);
              await noMembers.splice(index, 1);
              await siMembers.push(interaction.user.id);
              await Data.save();
  
              const newNosCount = parseInt(noField.value.split("`").slice(3)) - 1;
              noField.value = `\`\`\`${newNosCount}\`\`\``;
  
              const newYesCount =
                parseInt(yesField.value.split("`").slice(3)) + 1;
              yesField.value = `\`\`\`${newYesCount}\`\`\``;
  
              await interaction.message.edit({ embeds: [sugEmbed] });
  
              await interaction.reply({
                content: `Tu voto se agrego correctamente`,
                ephemeral: true,
              });
  
            } else if (siMembers.includes(interaction.user.id)) {
              const index = await siMembers.indexOf(interaction.user.id);
              await siMembers.splice(index, 1);
              await Data.save();
  
              const newYesCount =
                parseInt(yesField.value.split("`").slice(3)) - 1;
              yesField.value = `\`\`\`${newYesCount}\`\`\``;
  
              await interaction.message.edit({ embeds: [sugEmbed] });
  
              await interaction.reply({
                content: `Tu voto se elimino correctamente`,
                ephemeral: true,
              });
            } else {
              await siMembers.push(interaction.user.id);
              await Data.save();
              const newYesCount =
                parseInt(yesField.value.split("`").slice(3)) + 1;
              yesField.value = `\`\`\`${newYesCount}\`\`\``;
  
              await interaction.message.edit({ embeds: [sugEmbed] });
  
              await interaction.reply({
                content: `Tu voto se agrego correctamente`,
                ephemeral: true,
              });
            }
          }
  
          break;
        case "No":
          {
            if (siMembers.includes(interaction.user.id)) {
              const index = await siMembers.indexOf(interaction.user.id);
              await siMembers.splice(index, 1);
              await noMembers.push(interaction.user.id);
              await Data.save();
  
              const newNosCount = parseInt(noField.value.split("`").slice(3)) + 1;
              noField.value = `\`\`\`${newNosCount}\`\`\``;
  
              const newYesCount =
                parseInt(yesField.value.split("`").slice(3)) - 1;
              yesField.value = `\`\`\`${newYesCount}\`\`\``;
  
              await interaction.message.edit({ embeds: [sugEmbed] });
  
              await interaction.reply({
                content: `Tu voto se agrego correctamente`,
                ephemeral: true,
              });
  
            } else if (noMembers.includes(interaction.user.id)) {
              const index = await noMembers.indexOf(interaction.user.id);
              await noMembers.splice(index, 1);
              await Data.save();
  
              const newNosCount = parseInt(noField.value.split("`").slice(3)) - 1;
              noField.value = `\`\`\`${newNosCount}\`\`\``;
  
              await interaction.message.edit({ embeds: [sugEmbed] });
  
              await interaction.reply({
                content: `Tu voto se elimino correctamente`,
                ephemeral: true,
              });
            } else {
              await noMembers.push(interaction.user.id);
              await Data.save();
  
              const newNosCount = parseInt(noField.value.split("`").slice(3)) + 1;
              noField.value = `\`\`\`${newNosCount}\`\`\``;
  
              await interaction.message.edit({ embeds: [sugEmbed] });
  
              await interaction.reply({
                content: `Tu voto se agrego correctamente`,
                ephemeral: true,
              });
            }
          }
  
          break;
      }
    },
  };