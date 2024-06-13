const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { exec } = require("child_process");
const wait = require("timers/promises").setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("csgo-restart")
    .setDescription("Send a RESTART command to Fruity CS:GO server"),

  async execute(interaction) {
    try {
      await interaction.reply({
        content: `Restarting: Fruity CS:GO`,
        ephemeral: true,
      });
      exec(
        "sudo -iu csgo-salad-1 /home/csgo-salad-1/csgoserver restart",
        async (error, stdout, stderr) => {
          await wait(5000);
          if (!interaction) return;
          if (error) {
            return await interaction.editReply({
              content: `Error: ${error.message}`,
              ephemeral: true,
            });
          }
          if (stderr) {
            return await interaction.editReply({
              content: `Stderr: ${stderr}`,
              ephemeral: true,
            });
          }
          return await interaction.editReply({
            content: `Restarted: Fruity CS:GO`,
            ephemeral: true,
          });
        }
      );
    } catch (error) {
      if (interaction) {
        await interaction.editReply({
          content: `Error: ${error}`,
          ephemeral: true,
        });
      }
    }
  },
};
