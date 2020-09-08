const pool = require('../utils/pool');

class Monsters {
  id;
  name;
  creepfactor;
  phrase;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.creepfactor = row.creepfactor;
    this.phrase = row.phrase;
  }

  static async insert(monster) {
    const { rows } = await pool.query(
      'INSERT INTO monsters (name, creepfactor, phrase) VALUES ($1, $2, $3) RETURNING *',
      [monster.name, monster.creepfactor, monster.phrase]
    );

    return new Monsters(rows[0]);
  }

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM monsters WHERE id = $1',
      [id]
    );

    if(!rows[0]) return null;
    else return new Monsters(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM monsters'
    );

    return rows.map(row => new Monsters(row));
  }

  static async update(id, updatedMonster) {
    const { rows } = await pool.query(
      `UPDATE monsters
      SET name = $1,
          creepfactor = $2,
          phrase = $3
      WHERE id = $4
      RETURNING *
      `,
      [updatedMonster.name, updatedMonster.creepfactor, updatedMonster.phrase, id]
    );

    return new Monsters(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM monsters WHERE id = $1 RETURNING *',
      [id]
    );

    return new Monsters(rows[0]);
  }
}

module.exports = Monsters;
