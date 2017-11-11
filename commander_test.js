var Discord = require("discord.js")
var commander = require("commander")
var fs = require("fs");

var bot = new Discord.Client()

var token = fs.readFileSync("token.txt", "utf-8").toString().split("\n")[0];
bot.login(token);

commander
    .command("create")
    .action(function() {
        console.log("create")
        //create_game()
        // wrong: how does the msg channel get to the commander?`
        // msg.channel.send("A game has been created. React to join:")
        //     .then(message => message.react(emoji))
        //     .then(message => message.createReactionCollector(
        //         (reaction) => reaction.emoji.name === 'a'
        //     )
        //         .on('collect', r => console.log("Collected ${r.emoji.name}"))
        //         .on('end', collected => console.log("Collected ${collected.size} items"))
        //     )
    })

commander
    .command("join")
    .action(function() {
        console.log("join")
    })




bot.on("message", msg => {
    if(msg.channel.name == "casino" && msg.content.startsWith("!p") && msg.author.username != "powerjack") {
        argv = msg.content.substring(3)
        console.log(argv)

        console.log(commander.parse(argv))
    }
})
