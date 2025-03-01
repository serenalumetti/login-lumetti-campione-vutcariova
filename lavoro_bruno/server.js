const express = require('express');
const path = require('path');
const UsersComponent = require('./UsersComponent');
const app = express();
const PORT = 8080;


const usersComponent = new UsersComponent('./state.json');


// Per abilitare il parsing delle form in formato urlencoded
app.use(express.urlencoded({ extended: true }));


// Middleware per servire i file statici
app.use(express.static('public'));


// Gestione della rotta principale
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Rotta per la pagina di login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});


// Rotta per la homepage
app.get('/homepage', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'homepage.html'));
});


// Gestione del login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const isAuthenticated = await usersComponent.login(email, password);
  if (isAuthenticated) {
    res.send('Login effettuato con successo!');
  } else {
    res.status(401).send('Credenziali non valide.');
  }
});


// Rotta per la pagina di registrazione
app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});


// Gestione della registrazione
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const userExists = await usersComponent.userExists(email);
  if (userExists) {
    res.status(409).send('Utente già registrato.');
  } else {
    await usersComponent.create({ email, password });
    res.send('Registrazione completata con successo!');
  }
});


// rotta per il cambio password
app.get('/reset-password', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'reset_password.html'));
});


app.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;
  const userExists = await usersComponent.userExists(email);


  if (!userExists) {
    return res.status(404).send('Utente non trovato.');
  }


  await usersComponent.updatePassword(email, newPassword);
  res.send('Password aggiornata con successo.');
});


app.listen(PORT, () => console.log('Server in ascolto sulla porta', PORT));
