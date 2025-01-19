const { EmbedBuilder, Events } = require("discord.js");
const schema = require("../../Schemas/base-system.js");
const logs = require("../../Schemas/logger/emojis.js");
const settings = require("../../Schemas/logger/settings.js");

module.exports = {
  name: Events.GuildEmojiCreate,
  async execute(emoji, client) {
    const settingsData = await settings.findOne({
      Guild: emoji.guild.id,
    });
    if (settingsData.Emojis === false) return;
    if (settingsData.Store === false && settingsData.Post === false) return;

    const auditlogData = await schema.findOne({
      Guild: emoji.guild.id,
      ID: "audit-logs",
    });
    if (!auditlogData || !auditlogData.Channel) return;
    const channel = await client.channels.cache.get(auditlogData.Channel);
    if (!channel) return;

    const logData = await logs.findOne({
      Guild: emoji.guild.id,
      Emoji: emoji.id,
    });

    const embed = new EmbedBuilder()
      .setColor("#ff00b3")
      .setTimestamp()
      .setImage(emoji.imageURL({ size: 128 }) || logData.Image)
      .setFooter({ text: `FKZ • ID: ${emoji.id}` })
      .setTitle("Emoji Added")
      .addFields(
        {
          name: "Name",
          value: emoji.name ? logData.Name : "Unknown",
          inline: false,
        },
        {
          name: "Author",
          value: emoji.author ? logData.User : "Unknown",
          inline: false,
        },
        {
          name: "Animated?",
          value: emoji.animated ? logData.Animated : "Unknown",
          inline: false,
        }
      );
    try {
      if (logData && settingsData.Store === true) {
        await logs.findOneAndUpdate(
          { Guild: emoji.guild.id, Emoji: emoji.id },
          {
            Name: emoji.name,
            User: emoji.author.id,
            Animated: emoji.animated || null,
            Image: emoji.imageURL({ size: 128 }),
          }
        );
      } else if (!logData && settingsData.Store === true) {
        await logs.create({
          Guild: emoji.guild.id,
          Emoji: emoji.id,
          Name: emoji.name,
          User: emoji.author.id,
          Created: emoji.createdAt,
          Animated: emoji.animated,
          Image: emoji.imageURL({ size: 128 }),
        });
      }

      if (settingsData.Post === true) {
        await channel.send({ embeds: [embed] });
      }
    } catch (error) {
      console.error("Error in EmojiCreate event:", error);
    }
  },
};
