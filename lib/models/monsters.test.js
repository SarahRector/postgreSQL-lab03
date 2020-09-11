const fs = require('fs');
const Monster = require('./monsters');
const pool = require('../utils/pool');

describe('Monster model', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('inserts a new monster into the database', async() => {
    const createdMonster = await Monster.insert({
      name: 'Dracula',
      creepfactor: 5,
      phrase: 'May I come in?'
    });

    const { rows } = await pool.query('SELECT * FROM monsters WHERE id = $1',
      [createdMonster.id]
    );

    expect(rows[0]).toEqual(createdMonster);
  });

  it('finds a monster by id', async() => {
    const vampire = await Monster.insert({
      name: 'Dracula',
      creepfactor: 5,
      phrase: 'May I come in?'
    });

    const foundVampire = await Monster.findById(vampire.id);

    expect(foundVampire).toEqual({
      id: vampire.id,
      name: 'Dracula',
      creepfactor: 5,
      phrase: 'May I come in?'
    });
  });

  it('returns null if it cant find a monster by id', async() => {
    const monster = await Monster.findById(8765);

    expect(monster).toEqual(null);
  });

  it('finds all monsters', async() => {
    await Promise.all([
      Monster.insert({
        name: 'Dracula',
        creepfactor: 5,
        phrase: 'May I come in?'
      }),
      Monster.insert({
        name: 'Wolfman',
        creepfactor: 8,
        phrase: 'Anyone seen my tennis ball?'
      }),
      Monster.insert({
        name: 'Creature from the Black Lagoon',
        creepfactor: 10,
        phrase: 'Wanna go for a swim?'
      }),
    ]);

    const monsters = await Monster.find();

    expect(monsters).toEqual(expect.arrayContaining([
      { id: expect.any(String), name: 'Dracula', creepfactor: 5, phrase: 'May I come in?' },
      { id: expect.any(String), name: 'Wolfman', creepfactor: 8, phrase: 'Anyone seen my tennis ball?' },
      { id: expect.any(String), name: 'Creature from the Black Lagoon', creepfactor: 10, phrase: 'Wanna go for a swim?' },
    ]));
  });

  it('updates a row by id', async() => {
    const createdMonster = await Monster.insert({
      name: 'Dracula',
      creepfactor: 5,
      phrase: 'May I come in?'
    });

    const updatedMonster = await Monster.update(createdMonster.id, {
      name: 'The Mummy',
      creepfactor: 4,
      phrase: 'Do I have to clean up after everyone?'
    });

    expect(updatedMonster).toEqual({
      id: createdMonster.id,
      name: 'The Mummy',
      creepfactor: 4,
      phrase: 'Do I have to clean up after everyone?'
    });
  });

  it('deletes a row by id', async() => {
    const createdMonster = await Monster.insert({
      name: 'Dracula',
      creepfactor: 5,
      phrase: 'May I come in?'
    });

    const deletedMonster = await Monster.delete(createdMonster.id);

    expect(deletedMonster).toEqual({
      id: createdMonster.id,
      name: 'Dracula',
      creepfactor: 5,
      phrase: 'May I come in?'
    });
  });
});
