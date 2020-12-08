        //declaring variables to be used in the code
        var suits = ["Spades", "Hearts", "Diamonds", "Clubs"];
        var values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
        var deck = new Array();
        var players = new Array();
        var dealer = new Array();
        var currentPlayer = 0;
        
        //creating a deck and pushing them in an array
        //adding the suit of the card, the number or the face and the weight to the array
        function createDeck()
        {
            deck = new Array();
            for (var i = 0 ; i < values.length; i++)
            {
                for(var x = 0; x < suits.length; x++)
                {
                    var weight = parseInt(values[i]);
                    if (values[i] == "J" || values[i] == "Q" || values[i] == "K")
                        weight = 10;
                    if (values[i] == "A")
                        weight = 11;
                    var card = { Value: values[i], Suit: suits[x], Weight: weight };
                    deck.push(card);
                }
            }
        }

        //creating players with param num being the number of players being added
        //the last player will be the dealer
        function createPlayers(num)
        {
            players = new Array();
            
            
            for(var i = 1; i <= num; i++)
            {
                var hand = new Array();
                var player = { Name: 'Player ' + i, ID: i, Points: 0, Hand: hand };
                players.push(player);
            }
            
            var hand = new Array();
            var dealer = { Name: 'Dealer',ID: num+1 , Points: 0, Hand: hand };
            players.push(dealer);

            //players will consist of the name, ID, points and the hand of that player at the moment
            console.log(players);
        }

        //using DOM creating players in the HTML file the player being the dealer
        function createPlayersUI()
        {
            document.getElementById('players').innerHTML = '';
            
            for(var i = 0; i < (players.length-1); i++)
            {
                var div_player = document.createElement('div');
                var div_playerid = document.createElement('div');
                var div_hand = document.createElement('div');
                var div_points = document.createElement('div');
                

                div_points.className = 'points';
                div_points.id = 'points_' + i;
                div_player.id = 'player_' + i;
                div_player.className = 'player';
                div_hand.id = 'hand_' + i;
                

                div_playerid.innerHTML = 'Player ' + players[i].ID;
                div_player.appendChild(div_playerid);
                div_player.appendChild(div_hand);
                div_player.appendChild(div_points);
                document.getElementById('players').appendChild(div_player);
            }
            
            var div_player = document.createElement('div');
            var div_playerid = document.createElement('div');
            var div_hand = document.createElement('div');
            var div_points = document.createElement('div');
            

            div_points.className = 'points';
            div_points.id = 'points_' + 4;
            div_player.id = 'player_' + 4;
            div_player.className = 'player';
            div_hand.id = 'hand_' + 4;
            

            div_playerid.innerHTML = 'Dealer';
            div_player.appendChild(div_playerid);
            div_player.appendChild(div_hand);
            div_player.appendChild(div_points);
            document.getElementById('players').appendChild(div_player);

        }

        //shuffling the cards for 1000 turns to randomize the location of each card
        function shuffle()
        {
            // for 1000 turns
            // switch the values of two random cards
            for (var i = 0; i < 1000; i++)
            {
                var location1 = Math.floor((Math.random() * deck.length));
                var location2 = Math.floor((Math.random() * deck.length));
                var tmp = deck[location1];

                deck[location1] = deck[location2];
                deck[location2] = tmp;
            }
        }

        //the function that starts the game being triggered by the start or the restart function
        function startblackjack()
        {
            document.getElementById('btnStart').value = 'Restart';
            document.getElementById("status").style.display="none";
            // deal 2 cards to every player object
            currentPlayer = 0;
            createDeck();
            shuffle();
            createPlayers(4);
            createPlayersUI();
            dealHands();
            document.getElementById('player_' + currentPlayer).classList.add('active');
        }

        //dealing 2 cards to each player and dealing one to the dealer and updating the deck
        function dealHands()
        {
            // alternate handing cards to each player
            // 2 cards each
            for(var i = 0; i < 2; i++)
            {
                for (var x = 0; x < players.length-1; x++)
                {
                    var card = deck.pop();
                    players[x].Hand.push(card);
                    renderCard(card, x);
                    // console.log(card,x)
                    updatePoints();
                }
            }

            var dealerIndex = players.length-1;
            // console.log(dealerIndex);
            var card = deck.pop();
            players[dealerIndex].Hand.push(card);
            renderCard(card, x);
            updatePoints();


            updateDeck();
        }

        //renders the card to the respective player 
        function renderCard(card, player)
        {
            var hand = document.getElementById('hand_' + player);
            hand.appendChild(getCardUI(card));
        }

        //getting the icon for each card 
        function getCardUI(card)
        {
            var el = document.createElement('div');
            var icon = '';
            if (card.Suit == 'Hearts')
            icon='&hearts;';
            else if (card.Suit == 'Spades')
            icon = '&spades;';
            else if (card.Suit == 'Diamonds')
            icon = '&diams;';
            else
            icon = '&clubs;';
            
            el.className = 'card';
            el.innerHTML = card.Value + '<br/>' + icon;
            return el;
        }

        // returns the number of points that a player has in hand
        function getPoints(player)
        {
            var points = 0;
            for(var i = 0; i < players[player].Hand.length; i++)
            {
                points += players[player].Hand[i].Weight;
            }
            players[player].Points = points;
            return points;
        }

        //updates the points of each user by calculating the total points 
        function updatePoints()
        {
            for (var i = 0 ; i < players.length; i++)
            {
                getPoints(i);
                document.getElementById('points_' + i).innerHTML = players[i].Points;
            }
        }
        

        function hitMe()
        {
            // pop a card from the deck to the current player
            // check if current player new points are over 21
            
            var card = deck.pop();
            players[currentPlayer].Hand.push(card);
            renderCard(card, currentPlayer);
            updatePoints();
            updateDeck();
            if (players[currentPlayer].Points >= 21){
                stand();
            }
            // check();

        }

        function stand()
        {
            // move on to next player
            // console.log(currentPlayer, players.length);

            if (currentPlayer != players.length-2) {
                document.getElementById('player_' + currentPlayer).classList.remove('active');
                currentPlayer += 1;
                document.getElementById('player_' + currentPlayer).classList.add('active');
                // console.log(currentPlayer);
            }
            else
            {
                console.log("Game finished")
                end();
            }

         }

        //would be used to double the players bet and hit and move forward
        function double()
        {
            hitMe();
            stand();
        }

        //game played by the dealer
        function dealerGame()
        {   
            var dealerIndex = players.length-1;
            var card = deck.pop();
            players[dealerIndex].Hand.push(card);
            renderCard(card, dealerIndex);
            updatePoints();
            updateDeck();

            if(getPoints(dealerIndex) <= 16)
            {
                // console.log(getPoints(dealerIndex));
                dealerGame();
            }
            else
            {
                console.log("Dealer Game ended here");
                check();
            }
        }
        
        //ending turn of each player
        function endTurn()
        {
            console.log("EndTurn()");
            var winner = -1;
            var score = 0;

            for(var i = 0; i < players.length; i++)
            {
                if (players[i].Points > score && players[i].Points <= 22)
                {
                    winner = i;
                }

                score = players[i].Points;
            }

        //     document.getElementById('status').innerHTML = 'Winner: Player ' + players[winner].ID;
        //     document.getElementById("status").style.display = "inline-block";
        // 
        }  

        function end()
        {
            // window.removeEventListener();
            window.removeEventListener("mousemove",hello());
        }
        
        function hello()
        {
            dealerGame();
        }

        //checking each player's points with that of the dealer
        function check()
        {
            for(var i=0; i< players.length-1; i++)
            {
                if (players[players.length-1].Points < players[i].Points && players[i].Points < 22)
                    {
                        console.log("Player " + (i+1) + " Won");
                        console.log(players[i].Points);
                        // document.getElementById('status').innerHTML = 'Player: ' + players[currentPlayer].ID + ' LOST';
                        // document.getElementById('status').style.display = "inline-block";
                        endTurn();
                    }
                else if (players[players.length-1].Points > 21)
                {
                    if(players[i].Points < 21 )
                        {
                            console.log("Player " + (i+1) +" Won")
                        }
                }
                else if (players[i].points > 21)
                {
                    console.log("Player" + i + "Busted");
                }
            } 
        }

        //updating the deck count for every time to keep track of the cards left in the deck
        function updateDeck()
        {
            document.getElementById('deckcount').innerHTML = deck.length;
        }

        //adding eventListener to check on each action done by the user
        window.addEventListener('load', function(){
            // dealerGame();
            createDeck();
            shuffle();
            createPlayers(4);
            
        });