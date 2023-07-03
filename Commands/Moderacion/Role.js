const { EmbedBuilder, ChatInputCommandInteraction, SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('role')
        .setDescription('Asigna un rol a los miembros o bots del servidor')
        .addSubcommand(subcommand =>
            subcommand
                .setName('all')
                .setDescription('Asigna un rol a todos los miembros del servidor')
                .addRoleOption(option => option.setName('role').setDescription('El rol que se asignará').setRequired(true))
                .addBooleanOption(option => option.setName('agregar').setDescription('Para agregar(True) o quitar(False) el rol especificado').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('member')
                .setDescription('Asigna un rol a un miembro específico')
                .addUserOption(option => option.setName('miembro').setDescription('El miembro al que se asignará el rol').setRequired(true))
                .addRoleOption(option => option.setName('role').setDescription('El rol que se asignará').setRequired(true))
                
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('humans')
                .setDescription('Asigna un rol a todos los humanos del servidor')
                .addRoleOption(option => option.setName('role').setDescription('El rol que se asignará').setRequired(true))
                .addBooleanOption(option => option.setName('agregar').setDescription('Para agregar(True) o quitar(False) el rol especificado').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('bots')
                .setDescription('Asigna un rol a todos los bots del servidor')
                .addRoleOption(option => option.setName('role').setDescription('El rol que se asignará').setRequired(true))
                .addBooleanOption(option => option.setName('agregar').setDescription('Para agregar(True) o quitar(False) el rol especificado').setRequired(true))
        ),
        

            /**
             * 
             * @param {ChatInputCommandInteraction} interaction 
             */

    async execute(interaction, client) {
        const { options, guild } = interaction;
        const rol = options.getRole('role');
        const agregar = options.getBoolean('agregar')
        const miembro = options.getMember('miembro');
        const bots = interaction.guild.members.cache.filter(member => member.user.bot);
        const humans = interaction.guild.members.cache.filter(member => !member.user.bot);

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            const embed = new EmbedBuilder()
            .setColor("Random")
            .setTitle("Error")
            .setDescription("❌ No tienes permiso para agregar o quitar roles")
            .setFooter({ text: `${client.user.tag} || ${client.ws.ping}Ms`, iconURL: client.user.displayAvatarURL()})
            return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (interaction.options.getSubcommand() === 'all') {
            await interaction.deferReply();
            await interaction.guild.members.fetch();

            interaction.guild.members.cache.each(async (member) => {
                if (agregar && !member.roles.cache.has(rol.id)) {
                    await member.roles.add(rol).catch(console.error);
                } else if (!agregar && member.roles.cache.has(rol.id)) {
                    await member.roles.remove(rol).catch(console.error);
                }
            });
            const accion = agregar ? 'asignado' : 'quitado';
            await interaction.editReply(`El rol ${rol} se ha ${accion} a todos los miembros del servidor.`);
        } 

        else if (interaction.options.getSubcommand() === 'member') {
            miembro.roles.add(rol);
            await interaction.reply(`El rol ${rol} se ha asignado a ${miembro}.`);
        
        }  

        else if (interaction.options.getSubcommand() === 'bots') {

            await interaction.deferReply();
            await interaction.guild.members.fetch({ query: 'bot', limit: 100 });
            
            bots.each(async bot => {
                if (agregar && !bot.roles.cache.has(rol.id)) {
                await bot.roles.add(rol).catch(console.error);
                } else if (!agregar && bot.roles.cache.has(rol.id)) {
                    await bot.roles.remove(rol).catch(console.error)
                }
            });
            const accion = agregar ? 'asignado' : 'quitado';
            await interaction.editReply(`El rol ${rol} se ha ${accion} a todos los bots del servidor.`);
        } 
        
        else if (interaction.options.getSubcommand() === 'humans') {
                await interaction.deferReply();
                await interaction.guild.members.fetch();
                
                
                humans.each(async human => {
                    if (agregar && !human.roles.cache.has(rol.id)) {
                        await human.roles.add(rol).catch(console.error);
                    } else if (!agregar && human.roles.cache.has(rol.id)) {
                        await human.roles.remove(rol).catch(console.error);
                    }
                    
                    /*
                    Si es un servidor pequeño se puede usar " for of " y agregar un contador
                    con la cantidad de miembros a la cual se le asigno el rol,
                    como mi servidor tiene mas de 15k miembros use un "each" para
                    que trabaje sobre todos los miembros y no uno a uno 
                    (El mismo for of puede ser utilizado en all y bots para tener el contador)
                    
                    let count = 0;
                    for (const human of humans) {
                        if (agregar && !human.roles.cache.has(rol.id)) {
                            await human.roles.add(rol).catch(console.error);
                            count++;
                        } else if (!agregar && human.roles.cache.has(rol.id)) {
                            await human.roles.remove(rol).catch(console.error);
                            count++;
                        }
                    }
                    */
                    
                });
                const accion = agregar ? 'asignado' : 'quitado';
                await interaction.editReply(`El rol ${rol} se ha ${accion} a todos lo miembros humanos del servidor.`);
            }
    },
};
