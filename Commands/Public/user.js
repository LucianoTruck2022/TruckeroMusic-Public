const { EmbedBuilder, ChatInputCommandInteraction, SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Asigna un rol a los miembros o bots del servidor')
        .addSubcommand(subcommand =>
            subcommand
            .setName("info")
            .setDescription(`Obten informacion del usuario`)
            .addUserOption(option => option.setName(`user`).setDescription(`el usuario del que desea obtener información`).setRequired(true)),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('banner')
                .setDescription('Asigna un rol a un miembro específico')
                .addUserOption(option => option.setName(`user`).setDescription(`el usuario del que desea obtener su banner`).setRequired(true)),
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('avatar')
                .setDescription('Te enseñare el avatar del usuario que quieras')
                .addUserOption(option => option.setName(`user`).setDescription(`el usuario del que desea obtener su avatar`).setRequired(true)),
        ),
            /**
             * 
             * @param {ChatInputCommandInteraction} interaction
             */

    async execute(interaction, client) {
        
        const user = interaction.options.getUser(`user`) || interaction.user;
        const member = await interaction.guild.members.fetch(user.id);
        const banner = await (await client.users.fetch(user.id, { force: true })).bannerURL({ size: 4096 });
        
        const MutualServers = []
        const JoinPosition = await interaction.guild.members.fetch().then(Members => Members.sort((a, b) => a.joinedAt - b.joinedAt).map((User) => User.id).indexOf(member.id) + 1)

        for (const Guild of client.guilds.cache.values()) {
            if (Guild.members.cache.has(member.id)) {
                MutualServers.push(`[${Guild.name}](https://discord.com/guilds/${Guild.id})`)
            }
        }

        const bot = new EmbedBuilder() // you can remove this if you want
        .setColor(`Red`)
        .setDescription(`Los bots no están disponibles`)
        if (member.user.bot) return await interaction.channel.sendTyping(), await interaction.reply({ embeds: [bot]});

        if (interaction.options.getSubcommand() === 'info') {
            const booster = member.premiumSince ? `Yes` : `No`; //Change the emoji
            const topRoles = member.roles.cache
                .sort((a, b) => b.position - a.position)
                .map(role => role)
                .slice(0, 1)
            /*if (!user) user = interaction.user;
            const miembro = await interaction.guild.members.fetch(user.id);
            let member = await user.fetch({ force: true });*/

            const embed = new EmbedBuilder()
                .setAuthor({ name: `${member.user.tag}`, iconURL: member.displayAvatarURL()})
                .setTitle(`**Información de ${member.user.tag}**`)
                .setColor(client.color)
                .setThumbnail(member.displayAvatarURL())
                .addFields({name: "Info Del Usuario", value: [`<:User:1097740467950604328> **Tag:** <@${member.id}>`, `👑 **ID:** ${member.id}`, `<a:nitro:1097728072763064343> **Nitro:** ${booster}`, `<:Role:1097740883983597618> **Rol principal:** ${topRoles}`, `<:avatar:1098291511088652408> **Avatar:** [click Aqui](${user.avatarURL({ format: `png` })})`].join("\n")})
                .addFields({ name: `<:join:1097917492871041074> Cuenta Creada`, value:`<t:${parseInt(user.createdAt / 1000)}:R>`,inline: true})
                .addFields({ name: `<:join:1097917492871041074> Se unió`, value:`<t:${parseInt(member.joinedAt / 1000)}:R>`,inline: true})
                .addFields({ name: `Banner`, value: banner ? " " : "None"})
                .setImage(banner)
                .setFooter({ text:  `Solicitado por ${interaction.member.user.tag}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
                

                await interaction.channel.sendTyping(), await interaction.reply({ embeds: [embed] });
                //await interaction.editReply(`El rol ${rol} se ha ${accion} a todos los miembros del servidor.`);
        } 

        else if (interaction.options.getSubcommand() === 'banner') {
            const formatter = new Intl.ListFormat(`en-GB`, { style: `narrow`, type: `conjunction` });

        const user = interaction.options.getUser(`user`) || interaction.user;
        const member = await interaction.guild.members.fetch(user.id);
        const banner = await (await client.users.fetch(user.id, { force: true })).bannerURL({ size: 4096 });
        const MutualServers = []

        for (const Guild of client.guilds.cache.values()) {
            if (Guild.members.cache.has(member.id)) {
                MutualServers.push(`[${Guild.name}](https://discord.com/guilds/${Guild.id})`)
            }
        }

        const bot = new EmbedBuilder() // you can remove this if you want
        .setColor(`Red`)
        .setDescription(`Los bots no están disponibles`)
        if (member.user.bot) return await interaction.channel.sendTyping(), await interaction.reply({ embeds: [bot]});

        const embed = new EmbedBuilder()
        .setTitle(`**Banner de ${member.user.tag}**`)
        .setColor(client.color)
        .setImage(banner)
        .setFooter({ text:  `Solicitado por ${interaction.member.user.tag}`, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })

        await interaction.channel.sendTyping(), await interaction.reply({ embeds: [embed] });
        }

        else if (interaction.options.getSubcommand() === 'avatar') {
            const user = interaction.options.getUser(`user`) || interaction.user;
        
            const embed = new EmbedBuilder()
              .setTitle(`Avatar de ${user.tag}`)
              .setDescription(`[PNG](${user.avatarURL({ format: `png` })}) / [WEBP](${user.avatarURL({dynamic: true,})}) / [JPG](${user.avatarURL({ format: `jpg` })})`)
              .setImage(user.displayAvatarURL({ size: 1024, dynamic: true }))
              .setFooter({
                text: `Pedido por: ${interaction.user.username}`,
                iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}`,
              });
        
            interaction.reply({ embeds: [embed] });
          }
    },
};
