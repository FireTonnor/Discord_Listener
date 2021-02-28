const { Team } = require("discord.js");

module.exports = class {
  constructor (client) {
    this.client = client;
  }

  async run () {

    await this.client.wait(1000);

    this.client.appInfo = await this.client.fetchApplication();
    if (this.client.owners.length < 1) {
      if (this.client.appInfo.owner instanceof Team) {
        this.client.owners.push(...this.client.appInfo.owner.members.keys());
      } else {
        this.client.owners.push(this.client.appInfo.owner.id);
      }
    }
    setInterval( async () => {
      this.client.appInfo = await this.client.fetchApplication();
    }, 60000);

    let message = "And Guarding"

    if (message.includes("{{servers}}")) {
        message = message.replace("{{servers}}", this.client.guilds.cache.size)
    } else if (message.includes("{{users}}")){
        message = message.replace("{{users}}", this.client.users.cache.size)
    } else if (message.includes("{{prefix}}")) {
        message = message.replace("{{prefix}}", "?")
    }

    this.client.user.setActivity(message,  { type: "LISTENING" })
  
    this.client.logger.log(`${this.client.user.tag}, ready to serve ${this.client.users.cache.size} users in ${this.client.guilds.cache.size} servers.`, "ready");
  }
};

