const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
  ChannelType,
} = require("discord.js");
const unbanSchema = require("../../Schemas.js/unbanSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban-disable")
    .setDescription("[Admin] Disable the unban system"),
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

    const { channel, guildId, options } = interaction;
    const unbanChannel = options.getChannel("channel");

    const embed = new EmbedBuilder();

    unbanSchema.deleteMany({ Guild: guildId }, async (err, data) => {
      embed
        .setColor("#ff00b3")
        .setDescription(`The unban system has been disabled.`);

      return await interaction.reply({ embeds: [embed] });
    });
  },
};
