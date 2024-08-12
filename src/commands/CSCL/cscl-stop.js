const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
} = require("discord.js");
const { exec } = require("child_process");
const wait = require("timers/promises").setTimeout;
require("dotenv").config();

const username = process.env.DATHOST_USERNAME;
const password = process.env.DATHOST_PASSWORD;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cscl-stop")
    .setDescription(
      "[Admin] Send a STOP command to a FKZ ClassicCounter server"
    )
    .addStringOption((option) =>
      option
        .setName("server")
        .setDescription("Which server do you want to stop")
        .setRequired(true)
        .addChoices(
          { name: "CS:CL FKZ 1 - VNL KZ 128t", value: "cscl-fkz-1" },
          { name: "CS:CL FKZ 2 - VNL KZ 64t", value: "cscl-fkz-2" },
          { name: "CS:CL FKZ 3 - KZTimer 128t", value: "cscl-fkz-3" }
        )
    ),

  async execute(interaction) {
    const { options } = interaction;
    const servers = options.getString("server");

    const embed = new EmbedBuilder()
      .setColor("#ff00b3")
      .setTimestamp()
      .setTitle("FKZ ClassicCounter Stop")
      .setFooter({ text: `FKZ` });

    const server = {
      "cscl-fkz-1": {
        name: "CS:CL FKZ 1 - VNL KZ 128t",
        user: "cscl-fkz-1",
        id: null,
      },
      "cscl-fkz-2": {
        name: "CS:CL FKZ 2 - VNL KZ 64t",
        user: "cscl-fkz-2",
        id: null,
      },
      "cscl-fkz-3": {
        name: "CS:CL FKZ 3 - KZTimer 128t",
        user: "cscl-fkz-3",
        id: null,
      },
    }[servers];

    const { name, user, id } = server;

    if (
      !interaction.member.permissions.has(PermissionFlagsBits.Administrator) ||
      !interaction.member.roles.cache.has(`${process.env.CSCL_MANAGER_ROLE}`)
    ) {
      embed.setDescription("You don't have perms to use this command.");
      return await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
    }

    try {
      embed.setDescription(`Stopping: ${name}`);
      await interaction.reply({
        embeds: [embed],
        ephemeral: true,
      });
      exec(
        `sudo -iu ${user} /home/${user}/csgoserver stop`,
        async (error, stdout, stderr) => {
          if (error) console.log(error);
          //if (stderr) console.log(stderr);
          //if (stdout) console.log(stdout);
        }
      );
      await wait(3000);
      embed.setDescription(`Stopped: ${name}`);
      return await interaction.editReply({
        embeds: [embed],
        ephemeral: true,
      });
    } catch (error) {
      await interaction.reply({
        content: `Error: ${error}`,
        ephemeral: true,
      });
    }
  },
};
