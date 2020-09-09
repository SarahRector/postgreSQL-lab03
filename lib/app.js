const express = require('express');
const Plant = require('./models/plants');
const app = express();

app.use(express.json());

app.post('/api/v1/plants', async(req, res, next) => {
  try {
    const createdPlant = await Plant.insert(req.body);
    res.send(createdPlant);
  } catch(error) {
    next(error);
  }
});

app.delete('/api/v1/plants/:id', async(req, res, next) => {
  try {
    const deletedPlant = await Plant.delete(req.params.id);
    res.send(deletedPlant);
  } catch(error) {
    next(error);
  }
});

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
