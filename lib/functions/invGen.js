const event = require("events")

class Invite {
    gen = () => {
        const link = "https://discord.com/api/oauth2/authorize?client_id=812149337261473812&permissions=332467382&scope=bot"

        return link
    }
}

module.exports = Invite