const {
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionsBitField,
} = require("discord.js");
const weschema = require("../../Schemas.js/welcome");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("welcome-channel")
    .setDMPermission(false)
    .setDescription("[Admin] Configure your server's welcome channel.")
    .addSubcommand((command) =>
      command
        .setName("set")
        .setDescription("Sets your welcome channel.")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Specified channel will be your welcome channel.")
            .setRequired(true)
        )
    )
    .addSubcommand((command) =>
      command.setName("remove").setDescription("Removes your welcome channel.")
    ),
  async execute(interaction) {
    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      ) &&
      interaction.user.id !== "619944734776885276"
    )
      return await interaction.reply({
        content: "You **do not** have the permission to do that!",
        ephemeral: true,
      });

    const sub = interaction.options.getSubcommand();

    switch (sub) {
      case "set":
        const channel = interaction.options.getChannel("channel");
        const welcomedata = await weschema.findOne({
          Guild: interaction.guild.id,
        });

        if (welcomedata)
          return interaction.reply({
            content: `You **already** have a welcome channel! (<#${welcomedata.Channel}>) \n> Do **/welcome-channel remove** to undo.`,
            ephemeral: true,
          });
        else {
          await weschema.create({
            Guild: interaction.guild.id,
            Channel: channel.id,
          });

          const embed = new EmbedBuilder()
            .setColor("#ff00b3")
            .setTitle(`> Your welcome channel has \n> been set successfully!`)
            .setTimestamp()
            .setFields({
              name: `• Channel was Set`,
              value: `> The channel ${channel} has been \n> set as your Welcome Channel.`,
              inline: false,
            });

          await interaction.reply({ embeds: [embed] });
        }

        break;

      case "remove":
        if (
          !interaction.member.permissions.has(
            PermissionsBitField.Flags.Administrator
          ) &&
          interaction.user.id !== "619944734776885276"
        )
          return await interaction.reply({
            content: "You **do not** have the permission to do that!",
            ephemeral: true,
          });

        const weldata = await weschema.findOne({ Guild: interaction.guild.id });
        if (!weldata)
          return await interaction.reply({
            content: `You **do not** have a welcome channel yet. \n> Do **/welcome-channel set** to set up one.`,
            ephemeral: true,
          });
        else {
          await weschema.deleteMany({
            Guild: interaction.guild.id,
          });

          const embed1 = new EmbedBuilder()
            .setColor("#ff00b3")
            .setTitle(
              `> Your welcome channel has \n> been removed successfully!`
            )
            .setTimestamp()
            .setFields({
              name: `• Your Channel was Removed`,
              value: `> The channel you have previously set \n> as your welcome channel will no longer \n> receive updates.`,
              inline: false,
            });

          await interaction.reply({ embeds: [embed1] });
        }
    }
  },
};
