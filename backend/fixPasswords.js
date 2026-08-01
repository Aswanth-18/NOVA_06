const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./src/models/User');

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        const salt = await bcrypt.genSalt(12);
        const hash = await bcrypt.hash('1234', salt);

        // Update all users
        await User.updateMany({}, { $set: { password: hash } });

        console.log('Fixed ALL passwords to 1234');
        process.exit(0);
    });
