const Command = require("../base/Command");
const Guild = require("../lib/database/schema/Guild");
let ids;
const getUserId = (id) => {ids = id}
const fs = require("fs")
const axios = require("axios")
const url = "https://discordlistenerfileserver.herokuapp.com"
const FormData = require('form-data');
const File = require("../lib/database/schema/File");
const uuid = require("uuid")

class Join extends Command {
  constructor (client) {
    super(client, {
      name: "join",
      description: "Well join and stay and listen to audio",
      usage: "join",
    });
  }

  async run (message, args, level) { 
    let date = Date.now()

  File.findOne({userid: message.author.id}, (err, result) => {
    if (err) throw err

    if (result) {
      date = result.date
    }

    if (!result) {
      let newFile = new File({
        _id: uuid.v4(),
        date: date,
        userid: message.author.id
      }).save()
    }
  })
  
  const createNewChuck = () => {
    const path = __dirname + `/recordings/${date}.pcm`;
    return fs.createWriteStream(path);
  }

    let user = message.author.id;
    let VoiceChannel = message.member.voice.channel

    if (!VoiceChannel || VoiceChannel.type !== "voice") return message.channel.send("That is not a voie channel or vc does not exists")

    message.channel.send({
      embed: {
        title: "Joining Vc",
        description: "Join Vc And Binnding MySelf To It"
      }
    })

      VoiceChannel.join()
        .then((conn) => {
          const dispatcher = conn.play("./sounds/drop.mp3");

            const receiver = conn.receiver;
            conn.on("speaking", (user, speaking) => {
              if (speaking) {
                console.log(`${user.username} started speaking`)
                
                getUserId(user)
                const audio = receiver.createStream(user, {mode: "pcm", end: "manual"})

                audio.pipe(createNewChuck());
                audio.on("end", () => {
                  console.log(`${user.username} Stopped Speaking`)
              })
              }
            })
          })
      .catch(err => {throw err})
  }
}

module.exports = Join;