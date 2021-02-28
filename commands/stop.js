const Command = require("../base/Command");
const fs = require("fs")
const { MessageEmbed } = require("discord.js")
const url = "https://discordlistenerfileserver.herokuapp.com"
const FormData = require('form-data');
const axios = require("axios");
const File = require("../lib/database/schema/File");
const nodelame = require("node-lame").Lame

class Stop extends Command {
  constructor (client) {
    super(client, {
      name: "stop",
      description: "Well join and stay and listen to audio",
      usage: "join",
    });
  }

  async run (message, args, level) { 

  console.log("hi")
  const voiceChannel = message.member.voice.channel
  voiceChannel.join().then((conn) => {
    const dispatcher = conn.play("./sounds/drop.mp3")

      dispatcher.on("finish", () => {
        voiceChannel.leave();
        console.log(`\nSTOPPED RECORDING\n`);
    });
  })

  voiceChannel.leave();


  File.findOne({userid: message.author.id}, (err, result) => {
    if (err) throw err

    if (result) {
      const formData = new FormData()
 
      formData.append("file", fs.createReadStream(`./commands/recordings/${result.date}.pcm`))

      // const res = axios.post( url + '/upload', formData, {headers: formData.getHeaders()})

      // deleteFile(message.author.id)
    }

    if (!result) {
      console.log("SOMETHING IS WRONG")
      }
    })
  }
}

module.exports = Stop;

async function deleteFile(id) {
  await File.findByIdAndDelete({userid: id})
}
