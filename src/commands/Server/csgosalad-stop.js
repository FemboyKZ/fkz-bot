const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { exec } = require("child_process");
const wait = require("timers/promises").setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("csgosalad-stop")
    .setDescription("[Salad] Send a stop command to Fruity CS:GO server"),

  async execute(interaction) {
    try {
      await interaction.reply({
        content: `Stopping: Fruity CS:GO`,
        ephemeral: true,
      });
      exec(
        "sudo -iu csgo-salad-1 /home/csgo-salad-1/csgoserver stop",
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
            content: `Stopped: Fruity CS:GO`,
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
