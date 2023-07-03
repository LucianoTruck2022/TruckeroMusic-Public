const { PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: {
    name: `reportekick`,
  },
  async execute(interaction, client, args) {
    const reportado = args[0];

    const reason = "Usuario Reportado";

    const hpmer = interaction.member.permissions.has(
      PermissionFlagsBits.KickMembers
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
        content: `No puedes kickearte a ti mismo`,
        ephemeral: true,
      });

    if (reportado === client.user.id)
      return interaction.reply({
        content: `No puedes kickearme a mi`,
        ephemeral: true,
      });

    if (
      member.roles.highest.position >= interaction.member.roles.highest.position
    )
      return interaction.reply({
        content: `No puedes kickear a alguien con el mismo rol o superior al tuyo`,
      });

    if (!member.kickable)
      return interaction.reply({ content: `No puedo kickear a este usuario` });

    await member.kick(reason).catch(console.error);

    await interaction.reply({
      content: `<@${reportado}> ha sido kickeado exitosamente`,
    });
  },
};