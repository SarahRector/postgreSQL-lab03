const pool = require('../utils/pool');

class Game {
  id;
  name;
  players;
  rating;

  constructor(rows) {
    this.id = rows.id;
    this.name = rows.name;
    this.players = rows.players;
    this.rating = rows.rating;
  }

  static async insert(game) {
    const { rows } = await pool.query(
      'INSERT INTO games (name, players, rating) VALUES ($1, $2, $3) RETURNING *',
      [game.name, game.players, game.rating]
    );

    return new Game(rows[0]);
  }

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM games WHERE id = $1',
      [id]
    );

    if(!rows[0]) return null;
    else return new Game(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM games'
    );

    return rows.map(row => new Game(row));
  }

  static async update(id, updatedGame) {
    const { rows } = await pool.query(
      `UPDATE games
      SET name = $1,
          players = $2,
          rating = $3
      WHERE id = $4
      RETURNING *
      `,
      [updatedGame.name, updatedGame.players, updatedGame.rating, id]
    );

    return new Game(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM games WHERE id = $1 RETURNING *',
      [id]
    );

    return new Game(rows[0]);
  }
}

module.exports = Game;





