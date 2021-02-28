const discord = require("discord.js");
const util = require("util");
const klaw = require("klaw");
const fs = require("fs");
const readdir = util.promisify(require("fs").readdir);
const path = require("path");

class FireRaven extends discord.Client {
    constructor(options) {
        super(options);

        this.config = require("./modules/config/config");
        this.commands = new discord.Collection();
        this.aliases = new discord.Collection();
        this.owners = new Array();
        this.logger = require("./modules/Logger");
        this.wait = require("util").promisify(setTimeout);
        this.musicQueue = new Map()
        this.streams = {}
    }

    permlevel (message) {
        let permlvl = 0;
    
        const permOrder = this.config.permLevels.slice(0).sort((p, c) => p.level < c.level ? 1 : -1);
    
        while (permOrder.length) {
          const currentLevel = permOrder.shift();
          if (message.guild && currentLevel.guildOnly) continue;
          if (currentLevel.check(message)) {
            permlvl = currentLevel.level;
            break;
          }
        }
        return permlvl;
      }
    
      loadCommand (commandPath, commandName) {
        try {
          const props = new (require(`${commandPath}${path.sep}${commandName}`))(this);
          this.logger.log(`Loading Command: ${props.help.name}. ✅`, "log");
          props.conf.location = commandPath;
          if (props.init) {
            props.init(this);
          }
          this.commands.set(props.help.name, props);
          props.conf.aliases.forEach(alias => {
            this.aliases.set(alias, props.help.name);
          });
          return false;
        } catch (e) {
          return `Unable to load command ${commandName}: ${e}`;
        }
      }
    
      async unloadCommand (commandPath, commandName) {
        let command;
        if (this.commands.has(commandName)) {
          command = this.commands.get(commandName);
        } else if (this.aliases.has(commandName)) {
          command = this.commands.get(this.aliases.get(commandName));
        }
        if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;
    
        if (command.shutdown) {
          await command.shutdown(this);
        }
        delete require.cache[require.resolve(`${commandPath}${path.sep}${commandName}.js`)];
        return false;
      }
    
      async clean (text) {
        if (text && text.constructor.name == "Promise")
          text = await text;
        if (typeof text !== "string")
          text = require("util").inspect(text, { depth: 1 });
    
        text = text
          .replace(/`/g, "`" + String.fromCharCode(8203))
          .replace(/@/g, "@" + String.fromCharCode(8203))
          .replace(this.token, "mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0");
    
        return text;
      }

      async awaitReply (msg, question, limit = 60000) {
        const filter = m => m.author.id === msg.author.id;
        await msg.channel.send(question);
        try {
          const collected = await msg.channel.awaitMessages(filter, { max: 1, time: limit, errors: ["time"] });
          return collected.first().content;
        } catch (e) {
          return false;
        }
    }
}

const client = new FireRaven();

const init = async () => {

    klaw("./commands").on("data", (item) => {
        const cmdFile = path.parse(item.path);
        if (!cmdFile.ext || cmdFile.ext !== ".js") return;
        const response = client.loadCommand(cmdFile.dir, `${cmdFile.name}${cmdFile.ext}`);
        if (response) client.logger.error(response);
      });
    
      const evtFiles = await readdir("./events/");
      client.logger.log(`Loading a total of ${evtFiles.length} events.`, "log");
      evtFiles.forEach(file => {
        const eventName = file.split(".")[0];
        client.logger.log(`Loading Event: ${eventName}`);
        const event = new (require(`./events/${file}`))(client);
        client.on(eventName, (...args) => event.run(...args));
        delete require.cache[require.resolve(`./events/${file}`)];
      });
    
      client.levelCache = {};
      for (let i = 0; i < client.config.permLevels.length; i++) {
        const thisLevel = client.config.permLevels[i];
        client.levelCache[thisLevel.name] = thisLevel.level;
      }
    
    client.login(client.config.token); 
    require("./lib/database/index")
}

init()

client.on("disconnect", () => client.logger.warn("Bot is disconnecting..."))
  .on("reconnecting", () => client.logger.log("Bot reconnecting...", "log"))
  .on("error", e => client.logger.error(e))
  .on("warn", info => client.logger.warn(info));

String.prototype.toProperCase = function () {
  return this.replace(/([^\W_]+[^\s-]*) */g, function (txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};

process.on("uncaughtException", (err) => {
  const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
  console.error("Uncaught Exception: ", errorMsg);
  process.exit(1);
});

process.on("unhandledRejection", err => {
  console.error("Uncaught Promise Error: ", err);
});