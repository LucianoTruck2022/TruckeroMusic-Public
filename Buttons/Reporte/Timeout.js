const { PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: {
    name: `reportetimeout`,
  },
  async execute(interaction, client, args) {
    const reportado = args[0];

    const reason = "Usuario Reportado";

    const hpmer = interaction.member.permissions.has(
      PermissionFlagsBits.ModerateMembers
    );

    if (!hpmer)
      return interaction.reply({
        content: `No tienes permisos suficientes para utilizar este boton`,
        ephemeral: true,
      });

    const member = await interaction.guild.members
      .fetch(reportado)
      .catch(console.error);

    if (reportado === interaction.user.id)
      return interaction.reply({
        content: `No puedes darte timeout a ti mismo`,
        ephemeral: true,
      });

    if (reportado === client.user.id)
      return interaction.reply({
        content: `No puedes darme timeout a mi`,
        ephemeral: true,
      });

    if (
      member.roles.highest.position >= interaction.member.roles.highest.position
    )
      return interaction.reply({
        content: `No puedes dar timeout a alguien con el mismo rol o superior al tuyo`,
      });

    if (!member.bannable)
      return interaction.reply({
        content: `No puedo dar timeout a este usuario`,
      });

    await member.timeout(900000, reason).catch(console.error);

    await interaction.reply({
      content: `<@${reportado}> ha sido timeouteado exitosamente`,
    });
  },
};