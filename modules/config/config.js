const config = {

    "admins": [],
  
    "support": [],
  
    "token": "ODEyMTQ5MzM3MjYxNDczODEy.YC8jAw.7_MA4WWTusg50dp_N-pa-SY7sJc",

    permLevels: [

     {  level: 0,
        name: "User", 
        check: () => true
      },
  
      { level: 2,
        name: "Moderator",
        check: (message) => {
          try {
            const modRole = message.guild.roles.cache.find(r => r.name.toLowerCase() === "mod");
            if (modRole && message.member.roles.cache.has(modRole.id)) return true;
          } catch (e) {
            return false;
          }
        }
      },
  
      { level: 3,
        name: "Administrator", 
        check: (message) => {
          try {
            const adminRole = message.guild.roles.cache.find(r => r.name.toLowerCase() === "admin");
            return (adminRole && message.member.roles.cache.has(adminRole.id));
          } catch (e) {
            return false;
          }
        }
      },

      { level: 4,
        name: "Server Owner", 
        check: (message) => message.channel.type === "text" ? (message.guild.ownerID === message.author.id ? true : false) : false
      },
 
      { level: 8,
        name: "Bot Support",
        check: (message) => config.support.includes(message.author.id)
      },
  
      { level: 9,
        name: "Bot Admin",
        check: (message) => config.admins.includes(message.author.id)
      },
  
      { level: 10,
        name: "Bot Owner", 
        check: (message) => message.client.owners.includes(message.author.id)
      }
    ]
  };
  
  module.exports = config;