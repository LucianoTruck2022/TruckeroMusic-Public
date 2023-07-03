const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  PermissionFlagsBits,
  Client,
} = require(`discord.js`);
const fs = require(`fs`);
const { loadbButtons } = require("../../Handlers/buttonHandler");
const { loadCommands } = require(`../../Handlers/commandHandler`);
const { loadEvents } = require(`../../Handlers/eventHandler`);
const { loadModals } = require(`../../Handlers/modalHandler`);
const { loadShemas } = require(`../../Handlers/shemasHandler`);

module.exports = {
  //developer: true,
  data: new SlashCommandBuilder()
    .setName(`reload`)
    .setDescription(`Recarga tus comandos/eventos`)
    //.setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents)
    .addSubcommand((options) => options.setName(`events`).setDescription(`Recarga tus eventos`))
    .addSubcommand((options) => options.setName(`commands`).setDescription(`Recarga tus comandos`))
    .addSubcommand((options) => options.setName(`buttons`).setDescription(`Recarga tus botones`))
    .addSubcommand((options) => options.setName(`modals`).setDescription(`Recarga tus modals`))
    .addSubcommand((options) => options.setName(`shemas`).setDescription(`Recarga tus shemas`)),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  execute(interaction, client) {
    const subCommand = interaction.options.getSubcommand();
        
    if(interaction.member.id !== '722575141665505300') return interaction.reply({ content: 'Este comando está bloqueado solo puede utilizar mi creador', ephemeral: true});

    switch (subCommand) {
      case "events":
        {
          for (const [key, value] of client.events) client.removeListener(`${key}`, value, true);
          loadEvents(client);
          interaction.reply({ content: `Los eventos fueron recargados`, ephemeral: true, });
        }

        break;
      case "commands":
        {
          loadCommands(client);
          interaction.reply({
            content: `Los comandos fueron recargados`,
            ephemeral: true,
          });
        }

        break;
      case "buttons":
        {
          loadbButtons(client);
          interaction.reply({
            content: `Los botones fueron recargados`,
            ephemeral: true,
          });
        }
        break;
      case "modals":
        {
          loadModals(client);
          interaction.reply({
            content: `Los modals fueron recargados`,
            ephemeral: true,
          });
        }
        break;
        case "shemas":
          {
            loadShemas(client);
            interaction.reply({
              content: `Los shemas fueron recargados`,
              ephemeral: true,
            });
          }
          break;
    }
  },
};
