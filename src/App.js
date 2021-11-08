import { useState, useEffect } from 'react';
import { Col, Row, Button, Modal } from 'antd';
import styles from './App.css';
import axios from 'axios';
import Details from './details';

const App = () => {
  const [cards, setCards] = useState(); // Containing cards for 4 players
  const [drawCardSum, setDrawCardSum] = useState({}); // Sum of 4 random card
  const [winner, setWinner] = useState({
    showWinner: false,
    player: '',
  });
  const [startGame, setStartGame] = useState(false);
  const [pointsBySuit, setPointBySuit] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

  const cardValues = new Map([
    ['ACE', 4],
    ['KING', 3],
    ['QUEEN', 2],
    ['JACK', 1],
  ]);

  const playersName = new Map([
    [1, 'NORTH'],
    [2, 'WEST'],
    [3, 'EAST'],
    [4, 'SOUTH'],
  ]);

  const cardOrder = [
    'ACE',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'JACK',
    'QUEEN',
    'KING',
  ];

  const api = axios.create({
    baseURL: 'https://deckofcardsapi.com/api/deck/',
  });

  const sortCardsByValues = (cards) => {
    const temp = cardOrder?.map((value) =>
      cards?.find((card) => card?.value === value)
    );
    return temp?.filter((item) => item); //to remove undefined from array
  };

  const createDeckAndDraw = async () => {
    const { data } = await api.get('new/shuffle/', {
      params: {
        deck_count: 1,
      },
    });
    const { deck_id } = data;
    const { data: cardsResponse } = await api.get(`${deck_id}/draw/`, {
      params: {
        count: 52,
      },
    });
    const deck = cardsResponse.cards;
    let setPlayer = {};
    // Set cards for 4 players
    for (var j = 1; j < 5; j++) {
      // Get 13 random cards for each player
      for (var i = 0; i < 13; i++) {
        const index = Math.floor(Math.random() * deck.length);
        if (j in setPlayer) {
          setPlayer[j].push(deck[index]);
        } else {
          setPlayer[j] = [deck[index]];
        }
        deck.splice(index, 1);
      }
      setPlayer[j] = sortCardsBySuit(selectFourFaces(setPlayer[j], j), j);
    }
    setCards(setPlayer);
    setWinner({});
    setStartGame(true);
  };

  const findWinner = () => {
    let values = Object.values(drawCardSum);
    let maxSetValue = Math.max(...values);
    const index = values.indexOf(maxSetValue) + 1;
    setWinner({
      showWinner: true,
      player: `${playersName.get(index)} has won the game !!`,
      north: values[0],
      west: values[1],
      east: values[2],
      south: values[3],
    });
    console.log('Console points by Suit', pointsBySuit);
  };

  const selectFourFaces = (card_set, player) => {
    let cardSet = card_set;
    const indexArray = [];
    let sum = 0;
    while (indexArray.length < 4) {
      const index = Math.floor(Math.random() * card_set.length);
      if (!indexArray.includes(index)) {
        cardSet[index] = { ...cardSet[index], highlight: true };
        sum =
          sum +
          (cardValues.get(cardSet[index]?.value) === undefined
            ? 0
            : cardValues.get(cardSet[index]?.value));
        indexArray.push(index);
      }
    }
    setDrawCardSum((drawCardSum) => ({ ...drawCardSum, [player]: sum }));
    return cardSet;
  };

  // useEffect(() => {
  //   createDeckAndDraw();
  // }, []);

  const sortCardsBySuit = (setOfCards, player) => {
    const sortCards = {
      SPADES: [],
      HEARTS: [],
      DIAMONDS: [],
      CLUBS: [],
    };

    setOfCards.map((card) => sortCards[card.suit].push(card));
    const sortedCards = [
      ...sortCardsByValues(sortCards['SPADES']),
      ...sortCardsByValues(sortCards['HEARTS']),
      ...sortCardsByValues(sortCards['DIAMONDS']),
      ...sortCardsByValues(sortCards['CLUBS']),
    ];
    // sortCardsByValues(sortedCards);

    calculatePointBySuit(sortCards, player);
    return sortedCards;
  };

  const handleOk = () => {
    setShowDetails(false);
  };

  const handleCancel = () => {
    setShowDetails(false);
  };
  // TO calculate point by suit. Not displayed on UI. Can be viewed in console.log
  const calculatePointBySuit = (sortCards, player) => {
    let total = {};
    Object.keys(sortCards).map((suit) => {
      let arr = sortCards[suit].map((card) =>
        cardValues.get(card?.value) === undefined
          ? 0
          : cardValues.get(card?.value)
      );
      total[suit] = arr.reduce((accumulator, a) => {
        return accumulator + a;
      }, 0);
    });
    setPointBySuit((pointsBySuit) => [
      ...pointsBySuit,
      {
        PLAYER: playersName.get(player),
        ...total,
      },
    ]);
    return total;
  };

  return (
    <>
      {startGame ? (
        <div style={{ background: 'green', height: '100vh' }}>
          {/* Player NORTH */}
          <div>
            <h4 className="heading">NORTH</h4>
            <Row>
              <Col span={5}></Col>
              {cards[1].map((card) => {
                return (
                  <Col span={1}>
                    <img
                      src={card.image}
                      alt={card.code}
                      height={'100px'}
                      width={'80px'}
                      className={card.highlight ? 'selected_card' : ''}
                    />
                  </Col>
                );
              })}
              <Col span={6}></Col>
            </Row>
          </div>
          <Row>
            {/* Player WEST */}

            <Col span={4}>
              <h4 className="heading">WEST</h4>
              <Row
                style={{
                  display: 'grid',
                  height: '500px',
                  justifyContent: 'center',
                }}
              >
                {cards[2].map((card) => {
                  return (
                    <Col span={1}>
                      <img
                        src={card.image}
                        alt={card.code}
                        height={'100px'}
                        width={'80px'}
                        className={card.highlight ? 'selected_card' : ''}
                      />
                    </Col>
                  );
                })}
              </Row>
            </Col>
            <Col span={16}>
              <div className="style_button">
                {winner.showWinner ? (
                  <div>
                    <h2 className="heading">{winner.player}</h2>
                    <h2 className="heading">SCORES : </h2>
                    <h4 className="heading">NORTH: {winner.north}</h4>
                    <h4 className="heading">WEST: {winner.west}</h4>
                    <h4 className="heading">EAST: {winner.east}</h4>
                    <h4 className="heading"> SOUTH: {winner.south}</h4>
                    <br />
                    <div className="style_button">
                      <Button
                        onClick={() => {
                          setPointBySuit([]);
                          setStartGame(false);
                        }}
                      >
                        RESTART
                      </Button>
                      <Button onClick={() => setShowDetails(true)}>
                        DETAILS
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button onClick={findWinner}>Get Result</Button>
                )}
              </div>
            </Col>
            {/* Player EAST*/}

            <Col span={4}>
              <h4 className="heading">EAST</h4>

              <Row
                style={{
                  display: 'grid',
                  height: '500px',
                  justifyContent: 'center',
                }}
              >
                {cards[3].map((card) => {
                  return (
                    <Col span={1}>
                      <img
                        src={card.image}
                        alt={card.code}
                        height={'100px'}
                        width={'80px'}
                        className={card.highlight ? 'selected_card' : ''}
                      />
                    </Col>
                  );
                })}
              </Row>
            </Col>
          </Row>

          {/* Player SOUTH*/}
          <div>
            <h4 className="heading">SOUTH</h4>
            <Row>
              <Col span={5}></Col>
              {cards[4].map((card) => {
                return (
                  <Col span={1}>
                    <img
                      src={card.image}
                      alt={card.code}
                      height={'100px'}
                      width={'80px'}
                      className={card.highlight ? 'selected_card' : ''}
                    />
                  </Col>
                );
              })}
              <Col span={6}></Col>
            </Row>
          </div>
        </div>
      ) : (
        <div
          style={{ background: 'green', height: '100vh' }}
          className="style_button"
        >
          <Button onClick={createDeckAndDraw}>Start Game</Button>
        </div>
      )}

      <Modal
        title="Score Details"
        visible={showDetails}
        onOk={handleOk}
        onCancel={handleCancel}
        width="450px"
      >
        <Details data={pointsBySuit} />
      </Modal>
    </>
  );
};

export default App;
