const Counter = require('../models/Counter');

//Function to generate a new unique userid
const generateUserId = async()=>{
    try {
        const counter = await Counter.findByIdAndUpdate(
            {_id:'userid'},
            {$inc: {seq:1}},
            {new:true,upsert: true}
        );
        return `sdpmss${counter.seq}`;
    } catch (error) {
        throw new Error('Error generating user ID');
    }
};

module.exports = generateUserId;