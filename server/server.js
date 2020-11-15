const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/jobs', require('./routes/jobs'));
app.use('/addresses', require('./routes/addresses'));
app.use('/persons', require('./routes/persons'));
app.use('/work_places', require('./routes/workPlaces'));
app.use('/doctors', require('./routes/doctors'));
app.use('/hospitals', require('./routes/hospitals'));
app.use('/schedules', require('./routes/schedules'));
app.use('/time_slots', require('./routes/timeSlots'));


const PORT = process.env.PORT || 5000;

const db = require('./config/database');

//sequelize.sync({force:true}) 

db.sequelize.authenticate()
    .then(() => console.log('Connection has been established successfully.'))
    .catch(error => console.error('Unable to connect to the database:', error));

app.listen(PORT, () => console.log(`Server is running on Port: ${PORT}`));