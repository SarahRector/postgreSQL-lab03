const pool = require('../utils/pool');

class Creature {
  id;
  name;
  teeth;
  crazyfeature;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.teeth = row.teeth;
    this.crazyfeature = row.crazyfeature;
  }

  static async insert(creature) {
    const { rows } = await pool.query(
      'INSERT INTO creatures (name, teeth, crazyfeature) VALUES ($1, $2, $3) RETURNING *',
      [creature.name, creature.teeth, creature.crazyfeature]
    );


    return new Creature(rows[0]);
  }

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM creatures WHERE id = $1',
      [id]
    );

    if(!rows[0]) return null;
    return new Creature(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM creatures'
    );

    return rows.map(row => new Creature(row));
  }

  static async update(id, updatedCreature) {
    const { rows } = await pool.query(
      `UPDATE creatures
      SET name = $1,
          teeth = $2,
          crazyfeature = $3
      WHERE id = $4
      RETURNING *
      `,
      [updatedCreature.name, updatedCreature.teeth, updatedCreature.crazyfeature, id]
    );

    return new Creature(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM creatures WHERE id = $1 RETURNING *',
      [id]
    );

    return new Creature(rows[0]);
  }
}

module.exports = Creature;


