module.exports = class {
    constructor (client) {
      this.client = client;
    }
  
    async run (guild) {
        let message = "And Guarding"

        if (message.includes("{{servers}}")) {
            message = message.replace("{{servers}}", this.client.guilds.cache.size)
        } else if (message.includes("{{users}}")){
            message = message.replace("{{users}}", this.client.users.cache.size)
        } else if (message.includes("{{prefix}}")) {
            message = message.replace("{{prefix}}", "?")
        }
    
        this.client.user.setActivity(message,  { type: "LISTENING" })

    }
};