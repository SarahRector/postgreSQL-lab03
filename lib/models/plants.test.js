const fs = require('fs');
const Plant = require('./plants');
const pool = require('../utils/pool');

describe('Plant model', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('inserts a new plant into the database', async() => {
    const createdPlant = await Plant.insert({
      name: 'cactus',
      leaves: 5,
      height: '2 feet'
    });

    const { rows } = await pool.query('SELECT * FROM plants WHERE id = $1',
      [createdPlant.id]
    );

    expect(rows[0]).toEqual(createdPlant);
  });

  it('finds a plant by id', async() => {
    const cactus = await Plant.insert({
      name: 'cactus',
      leaves: 5,
      height: '2 feet'
    });

    const foundCactus = await Plant.findById(cactus.id);

    expect(foundCactus).toEqual({
      id: cactus.id,
      name: 'cactus',
      leaves: 5,
      height: '2 feet'
    });
  });
  it('returns null if it cant find a plant by id', async() => {
    const plant = await Plant.findById(8765);

    expect(plant).toEqual(null);
  });

  it('finds all plants', async() => {
    await Promise.all([
      Plant.insert({
        name: 'cactus',
        leaves: 5,
        height: '2 feet'
      }),
      Plant.insert({
        name: 'green thing',
        leaves: 12,
        height: '5 feet'
      }),
      Plant.insert({
        name: 'fuzzy boi',
        leaves: 8,
        height: '3 feet'
      }),
    ]);

    const plants = await Plant.find();

    expect(plants).toEqual(expect.arrayContaining([
      { id: expect.any(String), name: 'cactus', leaves: 5, height: '2 feet' },
      { id: expect.any(String), name: 'green thing', leaves: 12, height: '5 feet' },
      { id: expect.any(String), name: 'fuzzy boi', leaves: 8, height: '3 feet' },
    ]));
  });

  it('updates a row by id', async() => {
    const createdPlant = await Plant.insert({
      name: 'cactus',
      leaves: 5,
      height: '2 feet'
    });

    const updatedPlant = await Plant.update(createdPlant.id, {
      name: 'fern',
      leaves: 4,
      height: '1 foot'
    });

    expect(updatedPlant).toEqual({
      id: createdPlant.id,
      name: 'fern',
      leaves: 4,
      height: '1 foot'
    });
  });

  it('deletes a row by id', async() => {
    const createdPlant = await Plant.insert({
      name: 'cactus',
      leaves: 5,
      height: '2 feet'
    });

    const deletedPlant = await Plant.delete(createdPlant.id);

    expect(deletedPlant).toEqual({
      id: createdPlant.id,
      name: 'cactus',
      leaves: 5,
      height: '2 feet'
    });
  });

});
