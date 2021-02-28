const Guild = require("../lib/database/schema/Guild");
const UUID = require("uuid")

module.exports = class {
    constructor(client) {
        this.client = client;
    }

    async run(guild) {
        let message = "And Guarding"

        if (message.includes("{{servers}}")) {
            message = message.replace("{{servers}}", this.client.guilds.cache.size)
        } else if (message.includes("{{users}}")) {
            message = message.replace("{{users}}", this.client.users.cache.size)
        } else if (message.includes("{{prefix}}")) {
            message = message.replace("{{prefix}}", "?")
        }

        this.client.user.setActivity(message, {
            type: "LISTENING"
        })

        Guild.findOne({
            GuildID: guild.id
        }, (err, data) => {
            if (err) console.log(err)
            if (data) {
                let newGuild = new Guild({
                    _id: UUID.v4(),
                    GuildID: guild.id,
                    GuildName: guild.name,
                    GuildUUID: UUID.v4(),
                    GuildKey: "NOT SET",
                    GuildActive: "Active",
                    GuildVcStatus: "false",
                    GuildVcFileExtion: ".mp4"
                }).save()
            }
        })
    }
};