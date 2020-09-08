const fs = require('fs');
const Skate = require('./skates');
const pool = require('../utils/pool');

describe('Skate model', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('inserts a new skate into the database', async() => {
    const createdSkate = await Skate.insert({
      owner: 'GnarWall',
      brand: 'Reidel',
      wheels: 95
    });

    const { rows } = await pool.query('SELECT * FROM skates WHERE id = $1',
      [createdSkate.id]
    );

    expect(rows[0]).toEqual(createdSkate);
  });

  it('finds a skate by id', async() => {
    const skate = await Skate.insert({
      owner: 'GnarWall',
      brand: 'Reidel',
      wheels: 95
    });

    const foundSkate = await Skate.findById(skate.id);

    expect(foundSkate).toEqual({
      id: skate.id,
      owner: 'GnarWall',
      brand: 'Reidel',
      wheels: 95
    });
  });
  it('returns null if it cant find a skate by id', async() => {
    const skate = await Skate.findById(8765);

    expect(skate).toEqual(null);
  });

  it('finds all skates', async() => {
    await Promise.all([
      Skate.insert({
        owner: 'GnarWall',
        brand: 'Reidel',
        wheels: 95
      }),
      Skate.insert({
        owner: 'PoundsTooth',
        brand: 'Bont',
        wheels: 93
      }),
      Skate.insert({
        owner: 'HalleyTosis',
        brand: 'Chaya',
        wheels: 94
      }),
    ]);

    const skates = await Skate.find();

    expect(skates).toEqual(expect.arrayContaining([
      { id: expect.any(String), owner: 'GnarWall', brand: 'Reidel', wheels: 95 },
      { id: expect.any(String), owner: 'PoundsTooth', brand: 'Bont', wheels: 93 },
      { id: expect.any(String), owner: 'HalleyTosis', brand: 'Chaya', wheels: 94 },
    ]));
  });

  it('updates a row by id', async() => {
    const createdSkate = await Skate.insert({
      owner: 'GnarWall',
      brand: 'Reidel',
      wheels: 95
    });

    const updatedSkate = await Skate.update(createdSkate.id, {
      owner: 'Sybil Disobedience',
      brand: 'Antik',
      wheels: 92
    });

    expect(updatedSkate).toEqual({
      id: createdSkate.id,
      owner: 'Sybil Disobedience',
      brand: 'Antik',
      wheels: 92
    });
  });

  it('deletes a row by id', async() => {
    const createdSkate = await Skate.insert({
      owner: 'GnarWall',
      brand: 'Reidel',
      wheels: 95
    });

    const deletedSkate = await Skate.delete(createdSkate.id);

    expect(deletedSkate).toEqual({
      id: createdSkate.id,
      owner: 'GnarWall',
      brand: 'Reidel',
      wheels: 95
    });
  });

});

