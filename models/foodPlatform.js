const mongoose = require('mongoose');
const {Schema} = mongoose;

main().then(() => console.log('Database connected🚀')).catch(err => console.log(`Failed to connect to database: ${err.message}`));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/foodPlatform');
    await saveUser();
    await saveOrder();
    await deleteUser();
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

//you need to have this middleware registered just before model create for it to accurately get registered and work
    userSchema.post('findOneAndDelete', async (userData) => {
    if(userData) {
        await Order.deleteMany({user: userData._id});
    }
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

        const anotherUser = new User({
        username: "swe01",
        address: [
            {streetAddress: "150 N Washington St", city: "Harrisburg", country: "USA"}
        ],
        contact: 9844046882,
        age: 19
    });

    await newUser.save();
    await anotherUser.save();

    const user1 = new User({
    username: "kripa99",
    address: [
        {streetAddress: "22 Main Bazaar", city: "Pokhara", country: "Nepal"}
    ],
    contact: 9801123456,
    age: 21
    });

    const user2 = new User({
    username: "nisha88",
    address: [
        {streetAddress: "4800 Pine St", city: "Philadelphia", country: "USA"}
    ],
    contact: 9876543210,
    age: 23
    });

    const user3 = new User({
    username: "aarav12",
    address: [
        {streetAddress: "7 MG Road", city: "Kathmandu", country: "Nepal"}
    ],
    contact: 9812345678,
    age: 22
    });

    const user4 = new User({
    username: "manju33",
    address: [
        {streetAddress: "221B Baker St", city: "London", country: "UK"}
    ],
    contact: 447700900123,
    age: 25
    });

    const user5 = new User({
    username: "rohanX",
    address: [
        {streetAddress: "17 Queen’s Ave", city: "Sydney", country: "Australia"}
    ],
    contact: 61412345678,
    age: 26
    });

    // Save all users
    await user1.save();
    await user2.save();
    await user3.save();
    await user4.save();
    await user5.save();

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
    user: {
        type: Schema.Types.ObjectId,
        ref: "user",
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
        user: _id
    });

    await newOrder.save();

        // Kripa's order
    const { _id: kripaId } = await User.findOne({ username: "kripa99" }, { _id: 1 });
    const order1 = new Order({
        items: [
            { name: "Veg Mo:Mo", price: 300 },
            { name: "Lassi", price: 150 }
        ],
        user: kripaId
    });

    // Nisha's order
    const { _id: nishaId } = await User.findOne({ username: "nisha88" }, { _id: 1 });
    const order2 = new Order({
        items: [
            { name: "Chocolate Cake", price: 750 }
        ],
        user: nishaId
    });

    // Aarav's order
    const { _id: aaravId } = await User.findOne({ username: "aarav12" }, { _id: 1 });
    const order3 = new Order({
        items: [
            { name: "Burger", price: 400 },
            { name: "Coke", price: 100 }
        ],
        user: aaravId
    });

    // Manju's order
    const { _id: manjuId } = await User.findOne({ username: "manju33" }, { _id: 1 });
    const order4 = new Order({
        items: [
            { name: "English Breakfast", price: 1200 }
        ],
        user: manjuId
    });

    // Rohan's order
    const { _id: rohanId } = await User.findOne({ username: "rohanX" }, { _id: 1 });
    const order5 = new Order({
        items: [
            { name: "Sushi Platter", price: 1800 },
            { name: "Green Tea", price: 200 }
        ],
        user: rohanId
    });

    // Save all orders
    await order1.save();
    await order2.save();
    await order3.save();
    await order4.save();
    await order5.save();


    //practice populate method of mongoose - which populates the data of the ObjectId
    let userResult = await Order.find({}).populate("user"); //can take 2nd argument of fields - , "username contact"
    console.log(JSON.stringify(userResult, null, 3));
}

//handling deletion - if a document in one collection is deleted - then it should delete the document which is linked in another collections(if we want such function in our app)
async function deleteUser() {
    const {_id: id} = await User.findOne({username: 'aadi01'});
    await User.findByIdAndDelete(id);
}

