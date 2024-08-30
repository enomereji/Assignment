const express = require("express")

const app = express()

const dotenv = require("dotenv")

const mongoose = require("mongoose")

dotenv.config()

app.use(express.json())

app.get("/", (request, response) => {
    response.send("HelloWorld!")
})

const PORT = process.env.PORT || 3000

mongoose.connect(`${process.env.MONGODB_URL}`)
.then(()=>{
    console.log("MongoDB connected")
})

app.listen(PORT, ()=>{
    console.log(`Server started running on ${PORT} `)
})

const User = require("./models/User")

app.post("/add-user", async (request, response)=> {
    const { name, email, age } = request.body

    try {
        const user = new User({ name, email, age })
        await user.save()
        response.status(201).send(user)
    } catch (error) {
        response.status(400).send(error.message)
    
    }
})

app.post('/update-email', async (request, response) => {
    const { name, email } = request.body;

    try {
        const user = await User.findOneAndUpdate({ name }, { email }, { new: true, runValidators: true });
        if (!user) {
            return response.status(404).send('User not found');
        }
        response.send(user);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

app.post('/add-users', async (request, response) => {
    const users = request.body;

    try {
        const insertedUsers = await User.insertMany(users, { ordered: true });
        response.status(201).send(insertedUsers);
    } catch (error) {
        response.status(400).send(error.message);
    }
});

app.post('/add-users', async (request, response) => {
    const users = request.body;

    try {
        for (let user of users) {
            if (user.age < 18 || user.age > 99) {
                return response.status(400).send(`Age for user ${user.name} must be between 18 and 99.`);
            }
        }
        const insertedUsers = await User.insertMany(users, { ordered: true });
        response.status(201).send(insertedUsers);
    } catch (error) {
        response.status(400).send(error.message);
    }
});
