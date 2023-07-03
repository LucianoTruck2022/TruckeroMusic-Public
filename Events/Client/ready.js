const { loadCommands } = require("../../Handlers/commandHandler");
const { Activity, ActivityType, ActionRow, ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require('discord.js')
const { mongoose } = require("mongoose");
const config = require('../../config.json')
require('colors');

module.exports = {
  name: "ready",
  once: true,
  async execute(client, member, interaction) {

    const canal = client.channels.cache.get('1097936583828721756')

    const embed = new EmbedBuilder()
    .setTitle(`**Estatus Del Bot | ${client.user.tag}**`)
    .setDescription(`<a:Online:1098065342959456286> Estoy Online\n\n`)
    .addFields({ name: "<:server:1098065837417574420> Servidores", value: `${client.guilds.cache.size}`, inline: false },)
    .setColor(client.color);

    const decoration = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder() .setCustomId('dcorarionready1') .setDisabled(true) .setLabel(`${client.user.tag}`) .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder() .setCustomId('dcorarionready2') .setDisabled(true) .setLabel(`Developer: !LucianoTruck#3210`) .setStyle(ButtonStyle.Secondary),
    )

    canal.send({ embeds: [embed], components: [decoration] })

    console.log(`[SISTEMA] :: Conectado como ${client.user.tag}`.green);
    //client.user.setPresence({ activities: [{ name: `Soporte Bot`, type: ActivityType.Watching }], status: 'online', });
    loadCommands(client);

    await mongoose.connect(config.mongopass, { keepAlive: true, useNewUrlParser: true,});
    if (mongoose.connect) { console.log(`[SISTEMA] :: Base de datos conectado`.green) }
  },
};