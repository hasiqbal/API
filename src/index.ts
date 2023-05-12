import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import { Subject } from '../Interface';
import { listenPort } from "../Interface";

const new_subject: Subject = {
  id: 6,
  name: 'cooking'
};

const app = express();
app.use(bodyParser.json());

// Set the default request body to new_subject
app.use((req, res, next) => {
  req.body = new_subject;
  next();
});

app.get('/', (req, res) => {
  res.send('Hello');
});

app.get('/subjects.json', (req, res) => {
  fs.readFile('subjects.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ success: false, error: err });
    } else {
      const subjects = JSON.parse(data);
      res.status(200).json({ success: true, data: subjects });
    }
  });
});

app.post('/subjects.json', (req, res) => {
  const update: Subject = req.body;
  console.log('Received data:', update);

  fs.readFile('subjects.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ success: false, error: err });
    } else {
      let subjects: Subject[] = [];
      try {
        subjects = JSON.parse(data);
      } catch (err) {
        console.error('Error parsing JSON:', err);
      }

      subjects.push(update);

      fs.writeFile('subjects.json', JSON.stringify(subjects), (err) => {
        if (err) {
          res.status(500).json({ success: false, error: err });
        } else {
          res.status(200).json({ message: 'Post created successfully' });
        }
      });
    }
  });
});

app.delete('/subjects.json/:id', (req, res) => {
  const id = parseInt(req.params.id);

  fs.readFile('subjects.json', 'utf8', (err, data) => {
    if (err) {
      res.status(500).json({ success: false, error: err });
    } else {
      let subjects: Subject[] = [];
      try {
        subjects = JSON.parse(data);
      } catch (err) {
        console.error('Error parsing JSON:', err);
        res.status(500).json({ success: false, error: 'Invalid JSON data' });
        return;
      }

      const index = subjects.findIndex((subject) => subject.id === id);

      subjects.splice(index, 1);

      fs.writeFile('subjects.json', JSON.stringify(subjects), (err) => {
        if (err) {
          res.status(500).json({ success: false, error: err });
        } else {
          res.status(200).json({ message: 'Subject deleted successfully' });
        }
      });
    }
  });
});

const localHostPort: listenPort = { PORT: 3000 };
app.listen(localHostPort.PORT, () => {
  console.log(`Server running on port ${localHostPort.PORT}`);
});

