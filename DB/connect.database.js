import mongoose from 'mongoose';
const ConnectionDatabase = ()=>{
    mongoose.connect('mongodb+srv://mahmoud:123@cluster0.0qd359r.mongodb.net/taheeddb', { });

}

export default ConnectionDatabase;