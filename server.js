const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose(); 
const path = require('path'); 

const app = express();
const PORT = 3000;


const db = new sqlite3.Database('./blog.db', (err) => {
    if (err) {
        console.error('Error opening database ' + err.message);
    } else {
        console.log('Connected to the SQLite database in blog.db file.');

        
        db.run(`CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT NOT NULL
        )`, (err) => {
            if (err) {
                console.error('Error creating table ' + err.message);
            } else {
                console.log('Table `posts` exists or was created.');
            }
        });
    }
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/posts', (req, res) => {
    db.all('SELECT * FROM posts', [], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(rows);
        }
    });
});


app.post('/posts', (req, res) => {
    const { title, content } = req.body;
    db.run('INSERT INTO posts (title, content) VALUES (?, ?)', [title, content], function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json({ id: this.lastID });
        }
    });
});


app.delete('/posts/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM posts WHERE id = ?', [id], function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json({ deletedID: id });
        }
    });
});


app.put('/posts/:id', (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    db.run('UPDATE posts SET title = ?, content = ? WHERE id = ?', [title, content, id], function (err) {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json({ updatedID: id });
        }
    });
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
