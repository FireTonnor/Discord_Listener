const { MessageEmbed } = require("discord.js");
const Command = require("../base/Command");
const Guild = require("../lib/database/schema/Guild");

class Settings extends Command {
  constructor (client) {
    super(client, {
      name: "settings",
      description: "can enable and disable the settings",
      usage: "settings [number] [data]",
      permLevel: 3
    });
  }

  async run (message, args, level) {
    Guild.findOne({GuildID: message.guild.id}, (err, data) => {
      if (err) console.log(err)
      if (data) {
        switch(args[0]) {
          default: 
            let emb = new MessageEmbed()
              .setTitle(`${message.guild.name} Server Settings`)
              .addFields(
                {name: "GuildVcStatus", value: data.GuildVcStatus},
            )

            message.channel.send(emb)
            break;

            case 'GuildVcStatus':
              let status = args[1]
              message.channel.send({
                embed: {
                  title: "GuildVcStatus Settings",
                  description: `\`\`\` GuildVcStatus: ${status} \`\`\``
                }
              })

              GuildVcStatus(status, message.guild.id)
            break;
          }
        }
      })
    }
}

module.exports = Settings;

async function GuildVcFile(data, id) {
  await Guild.findOneAndUpdate({GuildID: id}, {"$set": {"GuildVcFileExtion": data}})
}

async function GuildVcStatus(data, id) {
  await Guild.findOneAndUpdate({GuildID: id}, {"$set": {"GuildVcStatus": data}})
}