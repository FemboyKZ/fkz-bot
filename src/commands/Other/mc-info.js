const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChannelType,
  PermissionsBitField,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mc-info-embed")
    .setDescription("[Admin] Posts the embeds the for MC-Info channel")
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel where to send the embed")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    ),

  async execute(interaction) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    )
      return await interaction.reply({
        content: "You don't have perms to use this command.",
        ephemeral: true,
      });

    const channel = interaction.options.getChannel("channel");

    const embed1 = new EmbedBuilder()
      .setTitle("**FKZ Minecraft Info**")
      .setImage("https://femboy.kz/images/wide.png")
      .setColor("#ff00b3")
      .setDescription(
        "> FemboyKZ has its own Minecraft server! Its mainly a survival server to build cool stuff as a community, but we could do other things on it in the future."
      );

    const embed2 = new EmbedBuilder()
      .setTitle("**FKZ Minecraft Whitelist**")
      .setImage("https://femboy.kz/images/wide.png")
      .setColor("#ff00b3")
      .setDescription(
        "> The Server has a separate whitelist from the CS servers. To connect to the servers you must be whitelisted."
      )
      .addFields([
        {
          name: "** **",
          value:
            "To get whitelisted run `/mc-whitelist-request` in any channel and fill in your information.",
        },
      ]);

    await channel.send({
      embeds: [embed1, embed2],
    });
    await interaction.reply({
      content: `The embeds have been posted on ${channel}.`,
      ephemeral: true,
    });
  },
};
