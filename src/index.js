const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const cors = require('cors');


dotenv.config();

const app = express();

//Middlewares configuration
app.use(cors());
app.use(express.json());


// MongoDB connection

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to MongoDB'))
.catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/users/', userRoutes);
app.use('/messages/', messageRoutes); 


// Starting the server
const PORT = process.env.PORT || 5000;
mongoose.connection.once('open',()=>{
    app.listen(PORT, () => {console.log(`Server running on port ${PORT}`)});
})

