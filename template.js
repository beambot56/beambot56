// Load up the discord.js library
const Discord = require("discord.js");

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});


client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.
  
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;
  
  // Also good practice to ignore any message that does not start with our prefix, 
  // which is set in the configuration file.
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  // Let's go with a few common example commands! Feel free to delete or change those.
  
  if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }
  
  if(command === "say") {
    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
    // To get the "message" itself we join the `args` back into a string with spaces: 
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{}); 
    // And we get the bot to say the thing: 
    message.channel.send(sayMessage);
  }
  
  if(command === "kick") {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit: 
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if(!message.member.roles.some(r=>["BeamBoi Admin","sWeepsweep"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    
    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    // We can also support getting the member by ID, which would be args[0]
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable) 
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
    
    // slice(1) removes the first part, which here should be the user mention or ID
    // join(' ') takes all the various parts to make it a single string.
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    // Now, time for a swift kick in the nuts!
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);

  }
  
  if(command === "ban") {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
  if(!message.member.roles.some(r=>["BeamBoi Admin"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.bannable) 
      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "No reason provided";
    
    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  }
  
  if(command === "purge") {
    // This command removes all messages from all users in the channel, up to 100.
    
    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);
    
    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Please provide a number between 2 and 100 for the number of messages to delete");
    
    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }
  
   if(command === "help") {
	  // yeet
	  
	  // yeet
	  const sayMessage = args.join(" ")
	   message.delete().catch(O_o=>{}); 
	   message.reply(` 
	   Standard Commands! (for mod commands do ***?modhelp***)
	  **?ping**
	  **?purge**
	  **?say**
	  **?anthem**
	  **?nsfw**
	  **?tiktok**
	  **?pray**
	  **?cookie**  
	  **?stalin**
	  **?animequote**
	  **?version**
	  **?support**
	  **?unboredify**
	  **?invite**`)
	   
  }
  
  if(command === "cookie") {
	  // yeet
	  
	  //yeet
	  const m = await message.channel.send("Baking! uwu");
	  m.edit(`Here's a freshly baked cookie from me! <3`)
  }
  
  if(command === "anthem") {
	  // yeet
	  
	  // yeet
	  const m = await message.channel.send("Amplifying");
	  m.edit(`United forever in friendship and labour,
Our mighty republics will ever endure.
The Great Soviet Union will live through the ages.
The dream of a people their fortress secure.

Long live our Soviet motherland,
Built by the people's mighty hand.
Long live our people, united and free.
Strong in our friendship tried by fire.
Long may our crimson flag inspire,
Shining in glory for all men to see.

Through days dark and stormy where Great Lenin lead us
Our eyes saw the bright sun of freedom above
And Stalin our leader with faith in the people,
Inspired us to build up the land that we love.

Long live our Soviet motherland,
Built by the people's mighty hand.
Long live our people, united and free.
Strong in our friendship tried by fire.
Long may our crimson flag inspire,
Shining in glory for all men to see.

We fought for the future, destroyed the invaders,
And brought to our homeland the laurels of fame.
Our glory will live in the memory of nations
And all generations will honour her name.

Long live our Soviet motherland,
Built by the people's mighty hand.
Long live our people, united and free.
Strong in our friendship tried by fire.
Long may our crimson flag inspire,
Shining in glory for all men to see.`)
  }

  if(command === "nsfw") {
	  // yeet
	  
	  //yeet
	  const m = await message.channel.send("Un-SFWing")
	  m.edit(`What'd you expect? Me to search porn up? Hell nah.`)
  } 
  
  if(command === "brokentest") {
	  // yeet
	  
	  // yeet
	  message.reply(`Hello there!`)
  }
  
  if(command === "tiktok") {
	  // yeet
	  
	  // yeet
	  const m = await message.channel.send("Memeing")
	  m.edit(`https://www.youtube.com/watch?v=s-ogfa3WYOA`)
  } 
  
  if(command === "pray") {
	  const m = await message.channel.send("Get ready...")
      m.edit(`To all whom wish to pray to our god, please bow your head. Today, we honor Mr.Shea and all his glory. Having known to love is what lead us to our god. Let us pray to him knowing that he is listening to us. Whether it may be tough times, or a bad day, may he be always there for us. Amen.`)
  }
  
  if(command === "warn") {
	  // same things as ban or kick
	  // just slight difference
  if(!message.member.roles.some(r=>["BeamBoi Admin"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");
   
   let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.bannable) 
      return message.reply("I cannot warn this user! Do they have higher role than me?");
  
   let reason = args.slice(1).join(' ');
    if(!reason) reason = "no reason provided";
	
	message.reply(`warned ${member.user.tag} for ${reason}`)
	}
	
   if(command === "support") {
	 const m = await message.channel.send("Creating link")
	  m.edit(`Needing help with Beam? Come join the official server at https://discord.gg/e7yafHV !`)
   }

   if(command === "modhelp") {
	   const sayMessage = args.join(" ")
	   message.delete().catch(O_o=>{}); 
	   message.reply(` 
	   Moderator Commands! (do ***?help*** for standard commands) 
	   **?kick**
	   **?ban**
	   **?warn**`)
   }
   
   if(command === "version") {
	   const sayMessage = args.join (" ")
	   message.delete().catch (O_o=>{});
	   message.reply(`Version 0.2.2 (Alpha)`)
   }
   
   if(command === "rwarn") {
	   const sayMessage = args.join (" ")
	   message.delete().catch (O_o=>{});
	   message.reply(`says NO HARD R'S!`)
   }
   
   if(command === "stalin") {
	   const m = await message.channel.send("Listen Peasants!")
	   m.edit(`When we hang the capitalists, we will make them buy the rope!`)
   }
   
   if(command === "ethan") {
	   const sayMessage = args.join(" ")
	   message.reply(`ALLAHU AKBAR!`)
   }
   
   if(command === "animequote") { 
	const m = await message.channel.send("CHARGING....")	
     m.edit(`Go beyond, plus ultraaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`) 
   }
   
   if(command === "unboredify") {
	   const sayMessage = args.join(" ")
	   message.reply(`https://www.reddit.com/r/dankmemes`) 
   }
   
   if(command === "invite") {
	   const m = await message.channel.send("Generating Link!")
	   m.edit(`Here ya go! https://discordapp.com/api/oauth2/authorize?client_id=519268952954634252&permissions=8&scope=bot`)
   }
   
   
   if(command === "freenitro") {
	   const sayMessage = args.join(" ") 
	   message.channel.send("https://cdn.discordapp.com/attachments/383678733145341957/527761340052275215/Gnomed.png")
   }
  });

client.login(config.token);
