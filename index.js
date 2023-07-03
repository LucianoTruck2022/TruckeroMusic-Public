const { Client, GatewayIntentBits, Partials, Collection, EmbedBuilder } = require("discord.js");
const { loadbButtons } = require("./Handlers/buttonHandler");
const { Guilds, GuildMembers, GuildMessages, GuildVoiceStates } = GatewayIntentBits;
const { User, user, Message, GuildMember, ThreadMember } = Partials;
//INCIO DE CONTADOR
const { QuickDB } = require('quick.db')
const db = new QuickDB() 
//FIN DE CONTADOR
//INICIO & MUSIC
const { DisTube } = require("distube");
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');
const { YtDlpPlugin } = require('@distube/yt-dlp');
////////FIN DE MUSIC

const client = new Client({ intents:[Object.keys(GatewayIntentBits)], partials:[Object.keys(Partials)] })


const { loadEvents } = require("./Handlers/eventHandler");
const { loadbMenus } = require("./Handlers/menuHandler");
const { loadModals } = require("./Handlers/modalHandler");
const { loadShemas } = require("./Handlers/shemasHandler");


client.config = require("./config.json");
client.events = new Collection();
client.commands = new Collection();
client.buttons = new Collection();
client.menus = new Collection();
client.modals = new Collection();
client.shemas = new Collection();
client.color = '#ff0000'

loadEvents(client);
loadbButtons(client);
loadbMenus(client);
loadModals(client);
loadShemas(client);

// Anti-Crash
require("./Handlers/anti-crash.js")(client);

client.login(client.config.token);

const prefix = `-`;

// PREFIX
client.on("messageCreate", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();

  const messageArray = message.content.split(" ");
  const argument = messageArray.slice(1);
  const cmd = messageArray[0];

  if (command === `test`) { message.channel.send("El bot esta funcionando"); }
});

//Contador 25/05/23
client.on('messageCreate', async(message, client) => {
    
  if (message.author.bot) return;
  if (message.channel.id !== '1101730095187632180') return;
  let numberCount = await db.get(`numberCount_${message.channel.id}`)
  if (!numberCount) numberCount = 89

  if (isNaN(message.content)) return message.reply({ content: 'This is not a number' }).then(msg => {
      setTimeout( () => { msg.delete(), message.delete() }, 5000) })

  if (Number(message.content) !== numberCount + 1) return message.reply({ content: `The correct number is\`${numberCount + 1}\`.` }).then(msg => {
      setTimeout( () => { msg.delete(), message.delete() }, 5000) })

  await db.set(`numberCount_${message.channel.id}`, Number(message.content))
  message.react('<a:Accepted:1110776741103939674>')
})

//MECIONAR EL BOT QUE RESPONDE 25/05/23
client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  let mencoes = [`<@${client.user.id}>`, `<@!${client.user.id}>`]

  mencoes.forEach(element => {
    if (message.content === element) {

      //(message.content.includes(element))

      const embed = new EmbedBuilder()
      .setColor(client.color)
      .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynaimc: true }) })
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setDescription(`**Hi, nice to meet you, my name is** \`${client.user.username}\`.\n\n*For now I'm in development, you can type* \`/\` *to see my commands. or \`/help\`*\n\n🛠 Hello ${message.author}\nFor server operation, support from server administration and server members. Which bug do you want to find with my commands to report to the Server Staff in order to repair as quickly as possible.\n\n*This message will be deleted in* \`1 minutes.\``)
      .setFooter({ text: `Solicitado por: ${message.author.tag}` , iconURL: `${message.author.displayAvatarURL({ dynamic: true })}`})
      
      message.reply({ embeds: [embed]}).then(msg => {
        setTimeout( () => { msg.delete(), message.delete() }, 60000) })
    }
  })

})

//MUSI 02/07/23
//
client.distube = new DisTube(client, {
  emitNewSongOnly: true,
  leaveOnFinish: true,
  emitAddSongWhenCreatingQueue: false,
  plugins: [new SpotifyPlugin()]
});

module.exports = client


