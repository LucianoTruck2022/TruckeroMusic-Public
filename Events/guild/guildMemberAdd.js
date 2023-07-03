const {EmbedBuilder, GuildMember, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");

module.exports = {
    name: "guildMemberAdd",
    execute(member, client) {
        const {user, guild} = member;
        const welcomeChannel = member.guild.channels.cache.get("1101730094952755206");//id del canal
        const welcomeMessage = `Bienvenido <@${member.id}> Al Servidor De Castores Trucking`;
        //const memberRole = "";//id del rol

        const welcomeboton = new ActionRowBuilder().addComponents(
            new ButtonBuilder() .setURL(`https://discord.com/channels/1101730093606387772/1101730094575263746`) .setLabel(`Reglas Server`) .setEmoji(`<a:Rules:1110778088528302100>`) .setStyle(ButtonStyle.Link), 
            new ButtonBuilder()  .setURL(`https://discord.com/channels/1101730093606387772/1101730094575263749`) .setLabel(`Identificarte`) .setEmoji(`<:VerfiedDeveloper:1097730464959172799>`) .setStyle(ButtonStyle.Link),
            new ButtonBuilder() .setURL(`https://discord.com/channels/1101730093606387772/1101730094575263752`) .setLabel(`Aspirante A VTC`) .setEmoji(`<:CT_Castor:1101751795723800639>`) .setStyle(ButtonStyle.Link),);
            //new ButtonBuilder() .setURL(`https://discord.com/channels/848391973139644446/1045521385482633316`) .setLabel(`Soporte Tecnico`) .setEmoji(`<:CT_Ticket:1036758697671655544>`) .setStyle(ButtonStyle.Link) .setDisabled(true),
        

        const welcomeEmbed = new EmbedBuilder()
        .setTitle("**Bienvenido a Castores Trucking**")
        .setDescription(`Hola <@${member.id}> recuerda leer nuestra <#1101730094575263746> y asígnate roles en ⁠<#1101730094575263749> para conocer sobre tu estadía en el servidor y Si estas interesado de unirte a la VTC en <#1101730094575263752>.`)
        .setColor(client.color)
        .setThumbnail(member.user.displayAvatarURL())
        .setImage('https://i.imgur.com/cf1Tk9q.gif')

        welcomeChannel.send({embeds: [welcomeEmbed], content: `${welcomeMessage}`, components: [welcomeboton] });
        //welcomeChannel1.send({embeds: [welcomeEmbed], content: `${welcomeMessage}`, components: [welcomeboton] });
        //member.roles.add(memberRole);
    },
};
