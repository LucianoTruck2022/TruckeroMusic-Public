const {EmbedBuilder, GuildMember, ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");

module.exports = {
    name: "guildMemberRemove",
    execute(member, client) {
        const {user, guild} = member;
        const welcomeChannel = member.guild.channels.cache.get("1113880774022791248");//id del canal
        const welcomeMessage = `Adiós <@${member.id}> De Castores Trucking, nos vemos en las carreteras.`;
        //const memberRole = "";//id del rol

        /*const welcomeboton = new ActionRowBuilder().addComponents(
            new ButtonBuilder() .setURL(`https://discord.com/channels/1101730093606387772/1101730094575263746`) .setLabel(`Reglas Server`) .setEmoji(`<:CT_Rules:1103386079450648606>`) .setStyle(ButtonStyle.Link), 
            new ButtonBuilder()  .setURL(`https://discord.com/channels/1101730093606387772/1101730094575263749`) .setLabel(`Identificarte`) .setEmoji(`<a:CT_Verified:1101765630669094972>`) .setStyle(ButtonStyle.Link),);*/
        

        /*const welcomeEmbed = new EmbedBuilder()
        .setTitle("**Bienvenido a Castores Trucking**")
        .setDescription(`Hola <@${member.id}> recuerda leer nuestra <#1101730094575263746> y asignar roles en <#1101730094575263749> para conocer sobre tu estadía en el servidor.\n\nHello <@${member.id}> remember to read our <#1101730094575263746> and assign roles in <#1101730094575263749> to learn about your stay on the server.`)
        .setColor(client.color)
        .setThumbnail(member.user.displayAvatarURL())
        .setImage('https://i.imgur.com/K6FQcUN.gif');*/

        //welcomeChannel.send({embeds: [welcomeEmbed], content: `${welcomeMessage}`, components: [welcomeboton] });
        welcomeChannel.send({content: `${welcomeMessage}`});
        //welcomeChannel1.send({embeds: [welcomeEmbed], content: `${welcomeMessage}`, components: [welcomeboton] });
        //member.roles.add(memberRole);
    },
};
