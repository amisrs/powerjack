var Discord = require("discord.js")
var commander = require("commander")
var uuidv4 = require("uuid/v4")
var fs = require("fs");

var bot = new Discord.Client()

var token = fs.readFileSync("token.txt", "utf-8").toString().split("\n")[0];
bot.login(token);

var instances = []

var join_emoji = '🃏'
var confirm_emoji = '💤'
var hit_emoji = '🔂'
var stay_emoji = '⏹'



// everyone loses
// draw order


//keys

const max_players = 8

var parse_command = function(command, msg) {
    if(command[0].substring(1) == "create") {
      console.log("create")
      create_game(msg)
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

var create_game = function(msg) {
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
            message.react(join_emoji)
            message.react(confirm_emoji)

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
                    new_game =  new GInstance(message.channel, reacted_users)

                })
        })

}

// when get enough players, GInstance start game

// split this into separate file
class GInstance {
    constructor(channel, players) {
        this.channel = channel
        this.uuid = uuidv4()
        this.players = []
        this.players = players.map((player) => {
            var new_player = new Player(player)
            //players.push(new_player)
            return new_player
        })

        var players_string = ""
        this.players.forEach((player) => {
            players_string += player.user.username + "\n"
        })
        channel.send({ embed: {
          color: 3447003,
          title: "Starting with players:",
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
        // 4. player turns: for each hand, until they bust or > hard 20 or soft 21
        //  a. hit
        //  b. stand
        //  c. double
        //  d. split
        //  e. surrender
        // 5. resolve dealer's hand
        //  a. draw until >17 or bust
        // 6. decide winner
        //  a. blackjack always wins, except tying with blackjack
        //  b.
        this.game_phase = 0
        this.start_game()
    }

    add_player(player) {
        this.players.push(player)

        // if(this.players.size == max_players) {
        //     start_game()
        // }
    }

    remove_player(player) {
    // use  array.find()

    }


    start_game() {
        console.log("Creating empty hands...")
        // game has enough players or host started
        var dealer = null
        var deck = this.deck
        var channel = this.channel
        var players = this.players
        var players_done = 0

        this.game_phase = 1

        players.forEach(function(player) {
            // need map of uuids for each game, value being an array of hands
            // player.games

            var new_hand = new Hand(deck)

            // wrong: a player can split multiple hands in 1 game
            //player.hands.set(this.uuid, new_hand)

            // right: but need to find a way to find by uuid
            player.hands.push(new_hand)

            if(!player.is_dealer) {
                player.hands[0].draw_card()
                console.log(player.user.username + "'s hand: " + player.hands[0].cards)
            } else {
                dealer = player
            }
            // wait for bets
            // msg.channel.send("Place your bets.")
            // reaction emojis for amounts, need a confirm reaction as well

        })
        //every player has 1 card except dealer
        if(dealer != null) {
            dealer.hands[0].draw_card()
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
        players.forEach((player) => {

            if(!player.is_dealer) {
                player.hands[0].draw_card()
                console.log(player.user.username + "'s hand: " + player.hands[0].cards)

            }
        })

        // dealer draws last card
        if(dealer != null) {
            dealer.hands[0].draw_card()
            channel.send({embed: {
                color: 3447003,
                title: "The dealer has drawn ",
                description: Deck.parse_card(dealer.hands[0].cards[0]) + "\n:asterisk::asterisk:" //draw downcard
            }})
        }

        // player turns
        var player_turn_finished = function() {
            console.log("Dealer turns callback.")
            players_done++

            console.log("players: " + players.length)

            if(players_done == players.length - 1) {
                console.log("Finished all players turns.")
                // now dealer's turns
                while(dealer.hands[0].get_best_value() <= 17) {
                  dealer.hands[0].draw_card()
                }

                if(dealer.hands[0].check_bust) {

                }



                channel.send({ embed: {
                    color: 3447003,
                    title: "Dealer",
                    description: Deck.parse_cards(dealer.hands[0].cards)
                }})

                var winning_players = []
                var dealer_value = dealer.hands[0].get_best_value()
                console.log("Dealer value: " + dealer_value)

                players.forEach((player) => {
                    var player_value = 21-player.hands[0].get_best_value()
                    console.log(player.user.username + ": " + player_value)
                    if(player == dealer) {

                    } else if((player_value <= 21-dealer_value && player_value >= 0) || (21-dealer_value < 0 && player_value >= 0)) {
                        winning_players.push(player)
                    }
                })

                if(winning_players.length == 0) {
                    channel.send({ embed: {
                        color: 3447003,
                        title: "The End",
                        description: Deck.parse_cards(dealer.hands[0].cards) + "\n Dealer wins."
                    }})
                } else {
                    var winstring = ""
                    winning_players.forEach((winner) => {
                        winstring += Deck.parse_cards(winner.hands[0].cards) + "\n" + winner.user.username + " "
                    })
                    channel.send({ embed: {
                        color: 3447003,
                        title: "The End",
                        description:  winstring + " wins."
                    }})
                }


            }
        }

        players.forEach(function(player) {
            if(!player.is_dealer) {
                var is_twentyone = player.hands[0].check_twentyone()
                console.log(player.user.username + "'s turn.")
                show_hand(player, channel, false, is_twentyone, player_turn_finished)
            }
        })




    }

}


var handle_turn = function(player, message, player_turn_finished) {
    // var keep_going = true
    //
    // while(keep_going) {
        message.react(hit_emoji)
        message.react(stay_emoji)

        message.createReactionCollector(
            (reaction, user) => reaction.emoji.name === hit_emoji && user.id == player.user.id,
            { max: 1 }
        )
            .on('collect', r => console.log(player.user.username + " hit."))
            .on('end', (r) => {

                message.clearReactions()
                // var new_embed = message.embeds[0]
                // var new_desc = message.embeds[0].description.substring(0, message.embeds[0].description.lastIndexOf('\n'))
                // new_embed.description = new_desc
                // console.log(new_embed.description)
                // message.edit("", new_embed)
                var is_bust = false
                var is_twentyone = false
                player.hands[0].draw_card()

                is_bust = player.hands[0].check_bust()
                console.log("isbust: " + is_bust)

                is_twentyone = player.hands[0].check_twentyone()


                show_hand(player, message.channel, is_bust, is_twentyone, player_turn_finished)

                console.log("End of loop for that player.")
            })
        message.createReactionCollector(
            (reaction, user) => reaction.emoji.name === stay_emoji && user.id == player.user.id,
            { max: 1 }
        )
          .on('collect', r => console.log(player.user.username + " stays."))
          .on('end', (r) => {
              //continue
              message.clearReactions()
              // message.edit(message.embeds[0].description.substring(0, message.embeds[0].description.lastIndexOf('\n')),message.embeds[0])
              player_turn_finished()
          })
      //message.react(double_emoji)
      //message.react(split_emoji)
      //message.react(surrender_emoji)

    // }

}

var show_hand = function(player, channel, is_bust, is_twentyone, player_turn_finished) {
    var comment_string = ""
    if(is_bust) {
        comment_string = "You suck!!"
    } else if (is_twentyone) {
        comment_string = "Nice!!!"
    } else {
        comment_string = hit_emoji + " Hit     " + stay_emoji + " Stay"
    }

    console.log("Showing " + player.user.username + "'s hand.")
    channel.send({ embed: {
        color: 3447003,
        title: player.user.username,
        description: Deck.parse_cards(player.hands[0].cards) + "\n"+comment_string
    }})
        .then((message) => {
            if(!is_bust) {
                if(is_twentyone) {
                    console.log("twentyone in showhand")
                    player_turn_finished()
                    player.playing = false
                } else {
                    handle_turn(player, message, player_turn_finished)
                }
            } else {
                console.log("bust in showhand")
                player_turn_finished()
            }
        })
}

var is_player_dealer = function(player) {
    return player.is_dealer
}

class Player {
    constructor(user) {
        //this.games = []
        this.user = user
        this.hands = [] // hand per game, store dealer status too?
        this.playing = true
        user.bot ? this.is_dealer = true : this.is_dealer = false

        console.log("New user: " + user.username)
    }
}

class Hand {
    constructor(deck) {
        this.deck = deck
        //this.id
        //this.is_dealer = is_dealer
        this.cards = []
        this.num_aces = 0
        this.bet = 0
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
        var closest = 9999
        this.get_values().forEach((value) => {
            if(21 - value < closest && value <= 21) {
                closest = value
            }
        })
        return closest
    }

    draw_card() {
        // may be different for dealer
        var drawn_card = (this.deck.draw_cards(1)) // use initial hand size var
        if(drawn_card % 13 == 0) {
            this.num_aces++
        }
        this.cards = this.cards.concat(drawn_card)

        return drawn_card
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
