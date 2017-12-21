"use strict"
module.exports = class Deck {
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


