require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const ProducerRoutes = require('./Routes/ProducerRoutes');
const ListenerRoutes = require('./Routes/ListenerRoutes');
const DBroutes = require('./Routes/DBroutes');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// User routes (for creating users, etc.)

app.use('/producer', ProducerRoutes);
app.use('/listener', ListenerRoutes);
app.use('/db', DBroutes);

app.get('/',  (req, res) => {
    res.render('pages/home', { title: 'Home Page' });
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;