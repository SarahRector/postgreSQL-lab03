const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Plant = require('../lib/models/plants');

describe('postgreSQL-lab03 routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('creates a new plant via POST', async() => {
    const response = await request(app)
      .post('/api/v1/plants')
      .send({ name: 'cactus', leaves: 5, height: '2 feet' });

    expect(response.body).toEqual({
      id: expect.any(String),
      name: 'cactus',
      leaves: 5,
      height: '2 feet'
    });
  });

  it('deletes a plant via DELETE', async() => {
    const createdPlant = await Plant.insert({
      name: 'cactus',
      leaves: 5,
      height: '2 feet'
    });

    const response = await request(app)
      .delete(`/api/v1/plants/${createdPlant.id}`);

    expect(response.body).toEqual({
      id: createdPlant.id,
      name: 'cactus',
      leaves: 5,
      height: '2 feet'
    });
  });

  it('gets all plants using a GET route', async() => {
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
      })
    ]);

    const response = await request(app)
      .get('/api/v1/plants');

    expect(response.body).toEqual(expect.arrayContaining([
      {
        id: expect.any(String),
        name: 'cactus',
        leaves: 5,
        height: '2 feet'
      }, {
        id: expect.any(String),
        name: 'green thing',
        leaves: 12,
        height: '5 feet'
      }, {
        id: expect.any(String),
        name: 'fuzzy boi',
        leaves: 8,
        height: '3 feet'
      }
    ]));
  });

  it('updates a plant using a PUT route', async() => {
    const newPlant = await Plant.insert({
      name: 'fuzzy boi',
      leaves: 8,
      height: '3 feet'
    });

    const response = await request(app)
      .put(`/api/v1/plants/${newPlant.id}`)
      .send(newPlant);

    expect(response.body).toEqual({
      id: expect.any(String),
      name: 'fuzzy boi',
      leaves: 8,
      height: '3 feet'
    });
  });
});
