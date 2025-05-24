const mongoose = require('mongoose');
const {Schema} = mongoose;

main().then(() => console.log('Database Connected🚀')).catch(err => console.log(`Error in connection to DB: ${err.message}`));

async function main() {
   await mongoose.connect('mongodb://127.0.0.1:27017/dbRelation');
   saveToDb();
}

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    address: [
        {
            location : {
            type: String,
            required: true
            }, city: {
            type: String,
            required: true
            }
        }
    ],
});

const User = mongoose.model("user", userSchema);

async function saveToDb() {
    //first delete everything
    User.deleteMany({});

    const newUser = new User({
        username: "Aadi",
        age: 19,
        address: [
            {location: "Hetauda, Makwanpur", city: "Hetauda"}
        ],
    });

    await newUser.save();
}