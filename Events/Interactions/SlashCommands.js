const { ChatInputCommandInteraction, EmbedBuilder, InteractionType, ButtonInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType, PermissionFlagsBits, resolveColor, } = require("discord.js");
const config = require(`../../config.json`);


module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction, client) {
    const { customId, values, fields, member, user, guild, commandName, channel, guildId, message, } = interaction;
    const errEmbed = new EmbedBuilder().setColor("Red");
      
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command)
        return interaction.reply({
          content: "This command is outdated.",
          ephermal: true,
        });

      if (command.developer && interaction.user.id !== `${config.developer}`)
      return interaction.reply({
        content: "Este comando solo está disponible para el developers",
        ephermal: true,
      });
      
      if (command.mantenimiento && interaction.user.id !== `${config.mantenimiento}`)
      return interaction.reply({
        content: "**Perdon pero este comando se encuentra en mantenimiento.**",
        ephermal: true,
      });

      if (command.adminOnly) {
        if ( !member.roles.cache.has("1061141049461972992") /*||*/ //!member.roles.cache.has("999046115221573782") /*||*/ //!member.roles.cache.has("999045712996221076")
        ) { errEmbed.setDescription( "⛔ | ¡Vaya! ¡No tienes permisos para eso!" );
          return interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }
      }

      if (command.reclutamiento) {
        if ( !member.roles.cache.has("1101730093652525131") /*||*/ //!member.roles.cache.has("999046115221573782") /*||*/ //!member.roles.cache.has("999045712996221076")
        ) { errEmbed.setDescription( "⛔ | ¡Vaya! ¡No tienes permisos para eso!" );
          return interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }
      }

      if (command.event) {
        if ( !member.roles.cache.has("1101730093652525130") || !member.roles.cache.has("1101730093652525128") /*|| !member.roles.cache.has("1101730093652525128")*/
        ) { errEmbed.setDescription( "⛔ | ¡Vaya! ¡No tienes permisos para eso!" );
          return interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }
      }

      command.execute(interaction, client);
    } else if (interaction.isButton()) {
      const buttonId = interaction.customId.split("_");
      const button = client.buttons.get(buttonId[0]);
      if (!button) return;
      button.execute(interaction, client, buttonId.slice(1));

      /*const { buttons } = client;
      const { customId } = interaction;
      const button = buttons.get(customId);
      if (!button) return new Error(`Este boton no tiene un codigo`);

      try {
        await button.execute(interaction, client);
      } catch (err) {
        console.error(err);
      }*/
    } else if (interaction.isStringSelectMenu()) {
      const { menus } = client;
      const { customId } = interaction;
      const menu = menus.get(customId);
      if (!menu) return new Error(`Este menu no tiene un codigo`);

      try {
        await menu.execute(interaction, client);
      } catch (err) {
        console.error(err);
      }
    } else if (interaction.type == InteractionType.ModalSubmit) {
      const { modals } = client;
      const { customId } = interaction;
      const modal = modals.get(customId);
      if (!modal) return new Error(`Este Modal no tiene un codigo`);

      try {
        await modal.execute(interaction, client);
      } catch (err) {
        console.error(err);
      }
    } else {
      return;
    }
  },
};
