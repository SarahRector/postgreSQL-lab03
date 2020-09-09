const fs = require('fs');
const Creature = require('./creatures');
const pool = require('../utils/pool');

describe('Creature model', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('inserts a new creature into the database', async() => {
    const createdCreature = await Creature.insert({
      name: 'jackalope',
      teeth: 15,
      crazyfeature: 'antlers'
    });

    const { rows } = await pool.query('SELECT * FROM creatures WHERE id = $1',
      [createdCreature.id]
    );

    expect(rows[0]).toEqual(createdCreature);
  });

  it('finds a creature by id', async() => {
    const jackalope = await Creature.insert({
      name: 'jackalope',
      teeth: 15,
      crazyfeature: 'antlers'
    });

    const foundJackalope = await Creature.findById(jackalope.id);

    expect(foundJackalope).toEqual({
      id: jackalope.id,
      name: 'jackalope',
      teeth: 15,
      crazyfeature: 'antlers'
    });
  });
  it('returns null if it cant find a creature by id', async() => {
    const creature = await Creature.findById(8765);

    expect(creature).toEqual(null);
  });

  it('finds all creatures', async() => {
    await Promise.all([
      Creature.insert({
        name: 'jackalope',
        teeth: 15,
        crazyfeature: 'antlers'
      }),
      Creature.insert({
        name: 'chupacabra',
        teeth: 6,
        crazyfeature: 'dorsal spines'
      }),
      Creature.insert({
        name: 'kraken',
        teeth: 1,
        crazyfeature: 'really really big'
      }),
    ]);

    const creatures = await Creature.find();

    expect(creatures).toEqual(expect.arrayContaining([
      { id: expect.any(String), name: 'jackalope', teeth: 15, crazyfeature: 'antlers' },
      { id: expect.any(String), name: 'chupacabra', teeth: 6, crazyfeature: 'dorsal spines' },
      { id: expect.any(String), name: 'kraken', teeth: 1, crazyfeature: 'really really big' },
    ]));
  });

  it('updates a row by id', async() => {
    const createdCreature = await Creature.insert({
      name: 'jackalope',
      teeth: 15,
      crazyfeature: 'antlers'
    });

    const updatedCreature = await Creature.update(createdCreature.id, {
      name: 'nessie',
      teeth: 47,
      crazyfeature: 'basically a dinosaur'
    });

    expect(updatedCreature).toEqual({
      id: createdCreature.id,
      name: 'nessie',
      teeth: 47,
      crazyfeature: 'basically a dinosaur'
    });
  });

  it('deletes a row by id', async() => {
    const createdCreature = await Creature.insert({
      name: 'nessie',
      teeth: 47,
      crazyfeature: 'basically a dinosaur'
    });

    const deletedCreature = await Creature.delete(createdCreature.id);

    expect(deletedCreature).toEqual({
      id: createdCreature.id,
      name: 'nessie',
      teeth: 47,
      crazyfeature: 'basically a dinosaur'
    });
  });

});
