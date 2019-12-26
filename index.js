const Discord = require("discord.js");
const fs = require("fs");
const bot = new Discord.Client();
let prefix = "-"

bot.commands = new Discord.Collection();
bot.settings = require("./settings.json");

fs.readdir("./commands/", (err, files) => {
    if (err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if (jsfile.length <= 0) return console.log(`${bot.settings.botname} No commands found. Try to Re-download the resource`);

    jsfile.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`[${bot.settings.botname}] > Command Loaded > ${f}`);
        bot.commands.set(props.help.name, props);
    });

});

bot.on("ready", async() => {
    bot.user.setActivity(bot.settings.BotStatus, { type: "WATCHING" });
    console.log(`\u001b[31m`, `------------[ E-HUB ]------------`)
    console.log(`\u001b[32m`, `E-HUB is now online`)
    console.log(`\u001b[31m`, `------------[ E-HUB ]------------`)

    console.log(`\u001b[31m`, `\n\n------------[ E-HUB Stats ]------------`)
    console.log(`\u001b[32m`, `Bot Username: ${bot.user.username}\nInvite Link: https://discordapp.com/api/oauth2/authorize?client_id=${bot.user.id}&permissions=8&scope=bot`)
    console.log(`\u001b[31m`, `------------[ E-HUB Stats ]------------`)

});

bot.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    if (message.content.indexOf(bot.settings.prefix) !== 0) return;

    let messageArray = message.content.split(" ");
    const args = message.content.slice(bot.settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd = bot.commands.get(command);
    if (!cmd) return;
    cmd.run(bot, message, args);
});
bot.on("message", async message => {
    const args = message.content.slice(prefix.length).trim().split(/ +/g) //arguments
    const command = args.shift().toLowerCase(); //command

    if (message.content.indexOf(prefix) !== 0) return;

    if (command == "avatar") {

        var user;
        user = message.mentions.users.first(); //mentioned user, if any
        if (!user) { //if no one is mentioned
            if (!args[0]) { //if the command is only "!avatar". I.e. no one is mentioned and no id is specified
                user = message.author;
                getuseravatar(user);
            } else { //if a user id IS specified (need developer mode on on discord to get it)
                var id = args[0]
                client.fetchUser(id).then(user => {
                    getuseravatar(user) //get avatar of the user, whose id is specified

                }).catch(error => console.log(error))

            }

        } else { //if someone IS mentioned
            getuseravatar(user);
        }

        function getuseravatar(user) {
            var embed = new Discord.MessageEmbed()
                .setColor("#2ca37e") //can specifiy color of embed here
                .setDescription(`Profile picture of ${user}`)
                .setImage(user.avatarURL)
            message.channel.send(embed)

        }

    }
})

bot.login(process.env.token);
