const pool = require('../utils/pool');

class Plant {
  id;
  name;
  leaves;
  height;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.leaves = row.leaves;
    this.height = row.height;
  }

  static async insert(plant) {
    const { rows } = await pool.query(
      'INSERT INTO plants (name, leaves, height) VALUES ($1, $2, $3) RETURNING *',
      [plant.name, plant.leaves, plant.height]
    );

    return new Plant(rows[0]);
  }

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM plants WHERE id = $1',
      [id]
    );

    if(!rows[0]) return null;
    else return new Plant(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM plants'
    );

    return rows.map(row => new Plant(row));
  }

  static async update(id, updatedPlant) {
    const { rows } = await pool.query(
      `UPDATE plants
      SET name = $1,
          leaves = $2,
          height = $3
      WHERE id = $4
      RETURNING *
      `,
      [updatedPlant.name, updatedPlant.leaves, updatedPlant.height, id]
    );

    return new Plant(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM plants WHERE id = $1 RETURNING *',
      [id]
    );

    return new Plant(rows[0]);
  }
}

module.exports = Plant;
