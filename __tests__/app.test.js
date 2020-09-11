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
});
