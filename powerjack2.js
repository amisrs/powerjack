var Discord = require("discord.js")
var commander = require("commander")
var uuidv4 = require("uuid/v4")
var fs = require("fs");
var async = require("async")

var bot = new Discord.Client()

var token = fs.readFileSync("token.txt", "utf-8").toString().split("\n")[0];
bot.login(token);

var instances = []

var join_emoji = '🃏'
var confirm_emoji = '💤'
var hit_emoji = '🔂'
var stay_emoji = '⏹'


// TODO:
// edit the embeds instead of sending new ones
// finish bets
// draw order

const max_players = 8

var parse_command = function(command, msg) {

    // use string-argv
    // 
    // var argv = require('minimist')(stringArgv(command).slice(2)); // if using minimist


    //
    // var parser = new ArgumentParser({
        //version: '0.0.1',
        //addHelp:true,
        //description: 'a'
    //})
    //parser.addArgument(
    //    [ '-b', '--bank'],
    //    {
    //        //help: '$'    
    //    }
    //)
    // etc
    //
    // var argv = parser.parseArgs();


    if(command[0].substring(1) == "create") {
        console.log("create")

        bank_param = 100000

        if(Number.isInteger(parseInt(command[1]))) {
            bank_param = parseInt(command[1])
        }

        create_game(msg, bank_param)
        
        // wrong: how does the msg channel get to the commander?`

        // )
        //   .then(message => message.createReactionCollector(
        //       (reaction) => reaction.emoji.name === join_emoji
        //   )
        //       .on('collect', r => console.log("Collected ${r.emoji.name}"))
        //       .on('end', collected => console.log("Collected ${collected.size} items"))
        //   )
    }


}

// commander
//     .command("create")
//     .action(function() {
//         console.log("create")
//         create_game()
//         // wrong: how does the msg channel get to the commander?`
//         msg.channel.send("A game has been created. React to join:")
//             .then(message => message.react(emoji))
//             .then(message => message.createReactionCollector(
//                 (reaction) => reaction.emoji.name === 'a'
//             )
//                 .on('collect', r => console.log("Collected ${r.emoji.name}"))
//                 .on('end', collected => console.log("Collected ${collected.size} items"))
//             )
//     })
//
// commander
//     .command("join")
//     .action(function() {
//         console.log("join")
//     })

// Listen for start
bot.on("message", msg => {
    if(msg.content.startsWith("!") && msg.author.username != "powerjack") {
        var argv = msg.content.split(" ")
        console.log(argv)
        //argv.shift() // get rid of "!pj"

        // commander.parse(argv)
        parse_command(argv, msg)
    }
})

var create_game = function(msg, bank_param) {
    console.log("create game")
    var players = []
    msg.channel.send({ embed: {
        color: 3447003,
        description: "A game has been created. \n\n " + join_emoji + " Join \n" + confirm_emoji + " Start (host only)",
        fields: [{
          name: "Rules",
          value: "The rules go here."
        }]
    }})
        .then((message) => {
            console.log("After create message sent") 

            message.createReactionCollector(
                (reaction, user) => reaction.emoji.name === join_emoji && !user.bot
            )
                .on('collect', (r) => {
                    console.log("Collected ${r.emoji.name}")
            //
                })
            //     //.on('end', collected => console.log("Collected ${collected.size} items"))
            message.createReactionCollector(
                (reaction, user) => reaction.emoji.name === confirm_emoji && user.id === msg.author.id,
                { max: 1 }
            )
                .on('collect', (r) => {
                    console.log("Collected start confirmation from host.")
                })
                .on('end', (r) => {``
                    console.log("End collection")
                    //var reactions = r.message.reactions
                    //console.log(r.array()[0].message)

                    var reacted_users = message.reactions.get(join_emoji).users
                    console.log(reacted_users)
                    //new_game =  new Round(message.channel, reacted_users, bank_param)
                    new_tournament = new Tournament(message.channel, reacted_users, bank_param)

                })
            message.react(join_emoji).then(message.react(confirm_emoji))
            
        })

}

class Tournament {
    constructor(channel, players, bank_param) {
        this.channel = channel
        //this.playing_players = []
        this.eliminated_players = []

        this.rounds = []
        this.max_rounds = 30
        this.elimination_rounds = [8, 16, 25]

        this.playing_players = players.map((player) => {
            var new_player = new Player(player, bank_param)
            //players.push(new_player)
            return new_player
        })

        this.start_game(this.round_ended.bind(this))
    }

    start_game(callback) {
        


        var first_round = new Round(this.channel, this.playing_players, callback)

    }

    round_ended(round) {
        this.rounds.push(round)

        if(this.elimination_rounds.includes(this.rounds.length)) {
            // eliminate poorest player
        }

        if(this.rounds.length >=  this.max_rounds) {
            // tournament end

        } else {
            var next_round = new Round(this.channel, this.playing_players, callback)
        }
    }

    add_player(player) {
        this.playing_players.push(player)

        // if(this.players.size == max_players) {
        //     start_game()
        // }
    }

    remove_player(player) {
    // use  array.find()

    }

}

// when get enough players, Round start game

// split this into separate file
class Round {
    constructor(channel, players, callback) {
        this.callback = callback
        this.channel = channel
        this.uuid = uuidv4()
        this.players = players
        this.round_players = players.map((player) => {
            return new RoundPlayer(player)
        })


        var players_string = ""
        this.round_players.forEach((round_player) => {
            players_string += round_player.player.user.username + "\n"

        })
        channel.send({ embed: {
          color: 3447003,
          title: "Starting round with players:",
          description: players_string
        }})

        this.deck = new Deck(1) // use num_decks arg

        // game phase?

        // options:
        // --s17 | [--h17]
        //     dealer stands or hits on a soft 17
        //
        // [--hole]
        //     the dealer draws their second card face down after the upcard
        //
        //     [--obo]
        //         only for no-hole games
        //         if player loses to dealer blackjack, you only lose your original bet
        //         (doubles, splits are given back)

        // [--late-surrender]
        //     allow surrender only after checking the hole card
        //     otherwise, allow surrender before
        //
        // [--resplit <n>]
        //     allow splitting again if new hand is splittable
        //
        // [--hit-split-aces]
        //     if you split aces you're allowed to hit
        //
        // [--split-double]
        //     allow double down on a split hand
        //
        // [--reno-us] | --reno-eu
        //     us: double only on hard 9/10/11
        //     eu: double only on hard 10/11

        // blackjack goes:
        // 1. every player bets
        // 2. deal
        //  a. one card each clockwise from dealer's left
        //  b. dealer's upcard
        //  c. if dealer's upcard = ace, offer insurance bet
        //  d. dealer's hole card (reveal if blackjack)
        //  e. one card each clockwise from dealer's left
        // 3. player turns: for each hand, until they bust or > hard 20 or soft 21
        //  a. hit
        //  b. stand
        //  c. double
        //  d. split
        //  e. surrender
        // 4. resolve dealer's hand
        //  a. draw until >17 or bust
        // 5. decide winner
        //  a. blackjack always wins, except tying with blackjack
        //  b.

        // round_phase values
        // 0 = waiting for players to join
        // 1 = dealing cards
        // 2 = player turns
        // 3 = dealer turns
        // 4 = finished

        this.round_phase = 0
        this.start_round()
    }


    start_round() {
        console.log("Creating empty hands...")
        this.round_phase = 1

        var dealer = null
        var deck = this.deck
        var channel = this.channel
        var round_players = this.round_players
        var players_done = 0


        //betting
        round_players.forEach(function(round_player) {
            var new_hand = new Hand()
            round_player.hands.push(new_hand)
            // wait for bets
            // msg.channel.send("Place your bets.")
            // react to sum up the values of bets
            // 250, 500, 1000, 2000, 4000, 8000, 16000, 32000
            // min 1000 max 50000
            // reaction emojis for amounts, need a confirm reaction as well
            // type your bets
        })

        channel.send({ embed: {
            color: 3447003,
            description: "Place your bets. Value = sum of reactions. \n\n "
        }})
        
        //first draw
        round_players.forEach(function(round_player) {
            // need map of uuids for each game, value being an array of hands
            // player.games

            // wrong: a player can split multiple hands in 1 game
            //player.hands.set(this.uuid, new_hand)

            // right: but need to find a way to find by uuid

            if(!round_player.player.is_dealer) {
                round_player.hands[0].draw_card(deck)
                console.log(round_player.player.user.username + "'s hand: " + round_player.hands[0].cards)
            } else {
                dealer = round_player
            }

        })

        //every player has 1 card except dealer
        if(dealer != null) {
            dealer.hands[0].draw_card(deck)
            // this.channel.send({embed: {
            //     color: 3447003,
            //     title: "The dealer has drawn ",
            //     description: Deck.parse_card(dealer.hands[0].cards[0]) //draw upcard
            // }})
        } else {
            // you can't play without a dealer
            return
        }

        //players draw second card
        round_players.forEach((round_player) => {

            if(!round_player.player.is_dealer) {
                round_player.hands[0].draw_card(deck)
                console.log(round_player.player.user.username + "'s hand: " + round_player.hands[0].cards)

            }
        })

        // dealer draws last card
        if(dealer != null) {
            dealer.hands[0].draw_card(deck)
            channel.send({embed: {
                color: 3447003,
                title: "The dealer has drawn ",
                description: Deck.parse_card(dealer.hands[0].cards[0]) + "\n:asterisk::asterisk:" //draw downcard
            }})
        }

        // players turns
        this.round_phase = 2
        round_players.forEach(function(round_player) {
            if(!round_player.player.is_dealer) {

                //actually we have to go by hand, allowing splits
                round_player.hands.forEach(function(hand) {   
                    var hand_alive = true
                    //while player is still alive
                        //do stuff
                    
                    // show hand
                    var player_message = channel.send({ embed: {
                        color: 3447003,
                        title: round_player.player.user.username,
                        description: Deck.parse_cards(hand.cards) + "\n"
                    }})
                    
                    while(hand_alive) {
                        var waiting_for_input = true
                        if(hand.check_twentyone() || hand.check_bust()) {
                            console.log("hand is won or bust (end turn)")
                            hand_alive = false
                            
                        } 

                        console.log("Showing " + round_player.player.user.username + "'s hand.")

                        // player_message update
                        // add reactions and collectors to player_message



                        channel.send({ embed: {
                            color: 3447003,
                            title: round_player.player.user.username,
                            description: Deck.parse_cards(hand.cards) + "\n"
                        }})
                            .then((message) => {
                                message.createReactionCollector(
                                    (reaction, user) => reaction.emoji.name === hit_emoji && user.id == player.user.id,
                                    { max: 1 }
                                )
                                .on('collect', r => console.log(round_player.player.user.username + " hit."))
                                .on('end', (r) => {
                                    message.clearReactions()
                                    hand.draw_card(deck)
                                    waiting_for_input = false
                                })

                                message.createReactionCollector(
                                    (reaction, user) => reaction.emoji.name === stay_emoji && user.id == player.user.id,
                                    { max: 1 }
                                )
                                .on('collect', r => console.log(round_player.player.user.username + " stays."))
                                .on('end', (r) => {
                                    message.clearReactions()
                                    hand_alive = false
                                    next()
                                })
                                //.then(message.createReactionCollector(
                                    //(reaction, user) => reaction.emoji.name === double_emoji && user.id = player.user.id,
                                    //{ max: 1 }
                                //)
                                //.on('collect', r => console.log(player.user.username + " doubles down."))
                                //.on('end', (r) => {
                                    //message.clearReactions()
                                    //hand.double_down() // remember to check if they have enough money
                                //})
                        
                                message.react(hit_emoji).then(message.react(stay_emoji))
                            })
                    }
                })
                console.log(round_player.player.user.username+"'s turn has ended.")
            }
        })

        console.log("Finished all players turns.")
        
        // dealer's turns
        this.round_phase = 3
        while(dealer.hands[0].get_best_value() <= 17) {
            dealer.hands[0].draw_card(deck)
        }

        if(dealer.hands[0].check_bust) {

        }

        //dealer finished drawing, time to check winners

        channel.send({ embed: {
            color: 3447003,
            title: "Dealer",
            description: Deck.parse_cards(dealer.hands[0].cards)
        }})
        
        var winning_players = []
        var tied_players = []
        var losing_players = []

        var dealer_value = dealer.hands[0].get_best_value()
        var dealer_distance = 21 - dealer_value
        console.log("Dealer value: " + dealer_value)

        round_players.forEach((round_player) => {
            var player_value = round_player.hands[0].get_best_value()
            var player_distance = 21 - player_value

            console.log(round_player.player.user.username + ": " + player_value)
            if(round_player.player.is_dealer) {

            } else if(
                // both got blackjack
                (round_player.hands[0].check_blackjack() && dealer.hands[0].check_blackjack()) || 
                // both 21 but not blackjack
                (player_distance == dealer_distance && player_distance > 0 && !round_player.hands[0].check_blackjack() && !dealer.hands[0].check_blackjack()) ||
                // both bust
                (player_distance < 0 && dealer_distance < 0))
            {
                tied_players.push(round_player)
            } else if(
                // player closer than dealer
                (player_distance < dealer_distance && player_distance >= 0) || 
                // dealer bust and player not
                (dealer_distance < 0 && player_distance >= 0) ||
                // player blackjack dealer not
                (round_player.hands[0].check_blackjack() && !dealer.hands[0].check_blackjack())) 
            {
                winning_players.push(round_player)
            } else {
                losing_players.push(round_player)
            }
        })
    
        var winstring = ""
        winning_players.forEach((winner) => {
            winstring += Deck.parse_cards(winner.hands[0].cards) + "\n" + winner.player.user.username + " "
        })

        channel.send({ embed: {
            color: 3447003,
            title: "The Winners",
            description:  winstring
        }})

        var tiedstring = ""
        tied_players.forEach((tied) => {
            tiedstring += Deck.parse_cards(tied.hands[0].cards) + "\n" + tied.player.user.username + " "
        })
        channel.send({ embed: {
            color: 3447003,
             title: "The Ties",
            description:  tiedstring
        }})

        var losestring = ""
        losing_players.forEach((loser) => {
            losestring += Deck.parse_cards(loser.hands[0].cards) + "\n" + loser.player.user.username + " "
        })
        channel.send({ embed: {
            color: 3447003,
            title: "The Losers",
            description:  losestring
        }})
        .then(this.callback())
        
        round_phase = 4
    }
}

class Player {
    constructor(user, bank_param) {
        this.user = user
        this.round_players = []
        this.bank = bank_param
        user.bot ? this.is_dealer = true : this.is_dealer = false
    }

    new_round_player() {
        var player = new RoundPlayer(this)
        this.round_players.push(player)
        return player
    }
}

class RoundPlayer {
    constructor(player) {
        //this.games = []
        this.player = player

        this.hands = [] // hand per game, store dealer status too?
        this.playing = true

        console.log("New user: " + this.player.user.username)
    }
}

class Hand {
    constructor() {
        //this.id
        //this.is_dealer = is_dealer
        this.cards = []
        this.num_aces = 0
        this.bet = 0
    }
    current_size() {
        return this.cards.length
    }

    add_bet(amount) {
        this.bet += amount
    }

    double_down() {
        add_bet(this.bet)
    }

    get_values() {
        console.log("Getting hand value...")
        var value = 0
        this.cards.forEach((card) => {
            value += Deck.card_value(card)
        })

        var possible_values = []
        for(var i=0; i<=this.num_aces; i++) {
            console.log("    Hand class: possible value " + (value+(10*i)))
            possible_values.push(value + (10*i))
        }

        return possible_values
    }

    check_bust() {
        console.log("Checking bust")

        var is_bust = true
        var found_non_bust = false
        this.get_values().forEach((value) => {
            console.log("    Hand could be worth " + value)
            console.log(value <= 21)
            if(value <= 21) {
                console.log(value + " is less than 21.")
                found_non_bust = true

                // if(value == 21) {
                //     is_twentyone = true
                // }
            } else {
                console.log(value + " is greater than 21.")
            }
        })
        if(found_non_bust) {
          is_bust = false
        }
        return is_bust
    }



    check_twentyone() {
        console.log("Checking twentyone")
        var is_twentyone = false
        this.get_values().forEach((value) => {
            console.log("    Hand could be worth " + value)
            if(value == 21) {
                is_twentyone = true
            }
        })
        return is_twentyone
    }

    get_best_value() {
        var closest = 99999
        this.get_values().forEach((value) => {
            if(21 - value < closest && value <= 21) {
                closest = value
            }
        })
        return closest
    }

    draw_card(deck) {
        // may be different for dealer
        var drawn_card = (deck.draw_cards(1)) // use initial hand size var
        if(drawn_card % 13 == 0) {
            this.num_aces++
        }
        this.cards = this.cards.concat(drawn_card)

        return drawn_card
    }

    check_blackjack() {
        if(this.current_size() == 2 && this.check_twentyone()) {
            return true
        }
    }

}

class Deck {
    // card values:
    // 0-12 Diamonds
    // 13-25 Clubs
    // 26-38 Hearts
    // 39-51 Spades

    constructor(num_decks) {
        this.num_decks = num_decks // blackjack might mix together multiple decks

        this.cards = []
        for(var i = 0; i < num_decks; i++) {
            for(var j = 0; j < 52; j++) {
                this.cards.push(j)
            }
        }
        this.shuffle()

    }

    // fisher yates shuffle
    shuffle() {
        var j,x,i
        for(i = 0; i < this.cards.length; i++) {
            j = Math.floor(Math.random() * (i+1))
            x = this.cards[j]
            this.cards[j] = this.cards[i]
            this.cards[i] = x
        }
    }

    // pops a number of cards from the deck, and returns them in an array
    draw_cards(num_cards) {
        var draw = []
        for(var i = 0; i < num_cards; i++) {
            draw.push(this.cards.pop())
        }
        return draw
    }

    static card_value(number) {
        var value = (number % 13) + 1
        if(value > 10) {
            value = 10
        }

        return value
    }

    static parse_cards(numbers) {
        var emoji_string = ""
        numbers.forEach((n) => {
          emoji_string += this.parse_card(n) + "\n"
        })
        return emoji_string
    }

    static parse_card(number) {
        var suit = ''
        var value = 0
        var emoji = ''

        if(number <= 12) {
            suit = '♦'
        } else if (number <= 25) {
            suit = '♣'
        } else if (number <= 38) {
            suit = '♥'
        } else if (number <= 51) {
            suit = '♠'
        } else {
            // what the hell
        }

        value = number % 13

        // use a map.
        if(value == 0) {
            emoji = '🇦'
        } else if (value == 1) {
            emoji = ':two:'
        } else if (value == 2) {
            emoji = ':three:'
        } else if (value == 3) {
            emoji = ':four:'
        } else if (value == 4) {
            emoji = ':five:'
        } else if (value == 5) {
            emoji = ':six:'
        } else if (value == 6) {
            emoji = ':seven:'
        } else if (value == 7) {
            emoji = ':eight:'
        } else if (value == 8) {
            emoji = ':nine:'
        } else if (value == 9) {
            emoji = ':keycap_ten:'
        } else if (value == 10) {
            emoji = '🇯'
        } else if (value == 11) {
            emoji = '🇶'
        } else if (value == 12) {
            emoji = '🇰'
        } else {
            // what the hell
        }

        return emoji + suit
    }
}


