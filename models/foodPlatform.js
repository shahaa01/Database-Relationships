const mongoose = require('mongoose');
const {Schema} = mongoose;

main().then(() => console.log('Database connected🚀')).catch(err => console.log(`Failed to connect to database: ${err.message}`));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/foodPlatform');
    saveUser().then(() => saveOrder()).catch(err => console.log(err.message));
}

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    address: [
        {
            streetAddress: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            country: {
                type: String,
                required: true
            }
        }
    ],
    contact: {
        type: Number,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
});

const User = mongoose.model("user", userSchema);

async function saveUser() {
    //for testting purpose - delete everything first
    await User.deleteMany({});

    const newUser = new User({
        username: "aadi01",
        address: [
            {streetAddress: "300 N Washington St", city: "Gettysburg", country: "Nepal"}
        ],
        contact: 9819235243,
        age: 20
    });

    await newUser.save();
}

const orderSchema = new Schema({
    items: [
        {
            _id: false,
            name: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
});

//Model for Order
const Order = mongoose.model("order", orderSchema);

async function saveOrder() {
    //clear everything up - just for testing purposes 
    await Order.deleteMany({});

    //get the user
    const {_id} = await User.findOne({username: "aadi01"}, {_id: 1});

    const newOrder = new Order({
        items: [
            {name: "Puddings", price: 1100}
        ],
        userId: _id
    });

    await newOrder.save();
}