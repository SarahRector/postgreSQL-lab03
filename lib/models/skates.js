const pool = require('../utils/pool');

class Skate {
  id;
  owner;
  brand;
  wheels;

  constructor(row) {
    this.id = row.id;
    this.owner = row.owner;
    this.brand = row.brand;
    this.wheels = row.wheels;
  }

  static async insert(skate) {
    const { rows } = await pool.query(
      'INSERT INTO skates (owner, brand, wheels) VALUES ($1, $2, $3) RETURNING *',
      [skate.owner, skate.brand, skate.wheels]
    );

    return new Skate(rows[0]);
  }

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM skates WHERE id = $1',
      [id]
    );

    if(!rows[0]) return null;
    else return new Skate(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM skates'
    );

    return rows.map(row => new Skate(row));
  }

  static async update(id, updatedSkate) {
    const { rows } = await pool.query(
      `UPDATE skates
      SET owner = $1,
          brand = $2,
          wheels = $3
      WHERE id = $4
      RETURNING *
      `,
      [updatedSkate.owner, updatedSkate.brand, updatedSkate.wheels, id]
    );

    return new Skate(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM skates WHERE id = $1 RETURNING *',
      [id]
    );

    return new Skate(rows[0]);
  }
}

module.exports = Skate;
