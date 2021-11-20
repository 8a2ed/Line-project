const {
  Client,
  Collection,
  Intents,
  MessageEmbed,
  MessageAttachment,
} = require("discord.js");
const client = new Client({
  intents: 32765,
  fetchAllMember: true,
  shards: "auto",
  disableEveryone: true,
});
client.login(""); // TOKEN HERE

/// Main Variables
const prefix = "#";
const db = require("quick.db");
const checkImage = require("image-url-validator");

/// Events
client.on("messageCreate", async (message) => {
  if (message.channel.type == "DM" || !message.guild || message.author.bot)
    return;
  if (message.content.startsWith(prefix + "setchannel")) {
    const args = message.content.split(" ").slice(1);
    if (!args) return message.channel.send({ content: `Mention channel.` });
    const channel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(args) ||
      message.guild.channels.cache.find(
        (ch) => ch.id === args || ch.name.toLowerCase() === args
      );
    if (!channel) return message.channel.send(`I couldn't find this channel.`);
    await db.set(`${message.guild.id}_channel`, channel.id);
    message.channel.send({ content: `Auto line channel is ${channel}.` });
  }
});

client.on("messageCreate", async (message) => {
  if (message.channel.type == "DM" || !message.guild || message.author.bot)
    return;
  if (message.content.startsWith(prefix + "setline")) {
    const args = message.content.split(" ").slice(1);
    if (!args) return message.channel.send({ content: `Specify line url.` });
    if (await checkImage(args)) {
      await db.set(`${message.guild.id}_line`, args);
      const embed = new MessageEmbed()
        .setColor("DARK_BUT_NOT_BLACK")
        .setDescription(`If you cann't see the line try another one !`)
        .setImage(args);
      return message.channel.send({ embed: [embed] });
    } else {
      return message.channel.send({ content: `Specify a valid line url.` });
    }
  }
});

client.on("messageCreate", async (message) => {
  if (message.channel.type == "DM" || !message.guild || message.author.bot)
    return;
  if (message.content.startsWith(prefix + "line")) {
    const line = db.get(`${message.guild.id}_line`);
    if (line === null)
      return message.channel.send({
        content: `There is no any lines in db.`,
      });
    message.channel.send({ content: line });
  }
});

client.on("messageCreate", async (message) => {
  if (message.channel.type == "DM" || !message.guild || message.author.bot)
    return;
  const channel = db.get(`${message.guild.id}_channel`);
  if (channel === null) return;
  if (message.channel.id !== channel) return;
  const line = db.get(`${message.guild.id}_line`);
  if (line === null) return;
  message.channel.send({ content: line });
});

client.on("ready", () => {
  client.user.setActivity(`Line project.`);
  console.log(`${client.user.username} is online !`);
});

// Made by .8à2éd#0690 | Don't share this project with your rights or you'll regret it.
