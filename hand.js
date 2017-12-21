"use strict"
var Deck = require("./deck.js")

module.exports = class Hand {
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
