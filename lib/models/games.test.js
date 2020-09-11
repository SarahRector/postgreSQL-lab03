const fs = require('fs');
const Game = require('./games');
const pool = require('../utils/pool');

describe('Game model', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('inserts a new game into the database', async() => {
    const createdGame = await Game.insert({
      name: 'ticket to ride',
      players: 4,
      rating: '5 stars'
    });

    const { rows } = await pool.query('SELECT * FROM games WHERE id = $1',
      [createdGame.id]
    );

    expect(rows[0]).toEqual(createdGame);
  });

  it('finds a game by id', async() => {
    const games = await Game.insert({
      name: 'ticket to ride',
      players: 4,
      rating: '5 stars'
    });

    const foundGames = await Game.findById(games.id);

    expect(foundGames).toEqual({
      id: games.id,
      name: 'ticket to ride',
      players: 4,
      rating: '5 stars'
    });
  });
  it('returns null if it cant find a game by id', async() => {
    const game = await Game.findById(8765);

    expect(game).toEqual(null);
  });

  it('finds all gamess', async() => {
    await Promise.all([
      Game.insert({
        name: 'ticket to ride',
        players: 4,
        rating: '5 stars'
      }),
      Game.insert({
        name: 'lanterns',
        players: 2,
        rating: '8 stars'
      }),
      Game.insert({
        name: 'sunset by water',
        players: 2,
        rating: '4 stars'
      }),
    ]);

    const games = await Game.find();

    expect(games).toEqual(expect.arrayContaining([
      { id: expect.any(String), name: 'ticket to ride', players: 4, rating: '5 stars' },
      { id: expect.any(String), name: 'lanterns', players: 2, rating: '8 stars' },
      { id: expect.any(String), name: 'sunset by water', players: 2, rating: '4 stars' },
    ]));
  });

  it('updates a row by id', async() => {
    const createdGame = await Game.insert({
      name: 'ticket to ride',
      players: 4,
      rating: '5 stars'
    });

    const updatedGame = await Game.update(createdGame.id, {
      name: 'racko',
      players: 4,
      rating: '6 stars'
    });

    expect(updatedGame).toEqual({
      id: createdGame.id,
      name: 'racko',
      players: 4,
      rating: '6 stars'
    });
  });

  it('deletes a row by id', async() => {
    const createdGame = await Game.insert({
      name: 'racko',
      players: 4,
      rating: '6 stars'
    });

    const deletedGame = await Game.delete(createdGame.id);

    expect(deletedGame).toEqual({
      id: createdGame.id,
      name: 'racko',
      players: 4,
      rating: '6 stars'
    });
  });

});
