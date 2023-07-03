const { EmbedBuilder, ChatInputCommandInteraction, SlashCommandBuilder, PermissionsBitField, ActivityType  } = require('discord.js');
const fs = require(`fs`);
const { loadbButtons } = require("../../Handlers/buttonHandler");
const { loadCommands } = require(`../../Handlers/commandHandler`);
const { loadEvents } = require(`../../Handlers/eventHandler`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('developers')
        .setDescription('Acceso exclusivo de mi creador')
        .addSubcommand(subcommand => subcommand .setName('listservers').setDescription('Muestra la lista de servidores con las Ids de los servidor en los que está tu bot.'),)
        .addSubcommand(subcommand => subcommand .setName('remover') .setDescription('Remover de algun server tu bot') .addStringOption(option => option.setName('server') .setDescription('Nombre o ID del server') .setRequired(true)), )
        .addSubcommand(subcommand => subcommand .setName('status') .setDescription("Este comando solo lo puede usar mi creador") .addStringOption( option =>option.setName("opciones") .setDescription("Selecciona una opcion") .setRequired(true) .addChoices(  { name: "Viendo", value: "Watching" }, { name: "Escuchando", value: "Listening" }, { name: "Jugando", value: "Playing" }, { name: "Compitiendo", value: "Competing" },)) .addStringOption( option => option.setName("texto") .setDescription("Contenido de la actividad").setRequired(true))),
            /**
             * 
             * @param {ChatInputCommandInteraction} interaction
             */

    async execute(interaction, client) {
        const { options } = interaction;
        const serverslist = interaction.client.guilds.cache.map(guild => `> **-** ${guild.name} \`(ID: ${guild.id})\``);
        const serverOption = interaction.options.getString('server');
        const opciones = interaction.options.getString('opciones');
        
        if(interaction.member.id !== '722575141665505300') return interaction.reply({ content: 'Este comando está bloqueado solo puede utilizar mi creador', ephemeral: true});

        if (interaction.options.getSubcommand() === 'listservers') {
            const embed = new EmbedBuilder()
                .setTitle('Lista de servidores')
                .setDescription(`El bot se encuentra en los siguientes servidores:\n${serverslist.join('\n')}`)
                .setColor(client.color);
            //await interaction.reply({ embeds: [embed]});
            await interaction.reply({ content: `Te envie el listado de servidores en los que estoy`, });
            await interaction.member.send({ embeds: [embed] });
        }

        else if (interaction.options.getSubcommand() === 'remover') {
            if(interaction.member.id !== '722575141665505300') return interaction.reply({ content: 'Este comando está bloqueado solo puede utilizar mi creador', ephemeral: true});
            const guild = interaction.client.guilds.cache.find(guild => guild.id === serverOption || guild.name === serverOption);

            if (guild) { await guild.leave(); await interaction.reply(`Salido Del Servidor el Bot de ${guild.name}.`);
            } else { await interaction.reply(`Server ${serverOption} not found.`); }
        }

        else if (interaction.options.getSubcommand() === 'status') {
            if (interaction.user.id !== '722575141665505300') return interaction.reply({ content: ':x: | Este comando solo lo puede usar mi creador', ephemeral: true });
            //lo que hace esto es para que solo ustedes usen el comando
            client.user.setActivity(`${options.getString("texto")}`, { type: ActivityType[`${options.getString("opciones")}`] })
            //Aqui cuando terminen de rellenar se cambiara el estado del bot
                await interaction.reply({content: `Se enviado correctamente el sistema verificacion`, ephemeral: true})
                //Esto se mandara cuando el comando si funciono
        }
    },
};
