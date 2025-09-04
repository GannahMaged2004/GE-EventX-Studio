// model for user
// For the frontend to connect with the backend, we need to create a model for the user.
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
    type: String,
    required: true,
    trim: true
  },
    email: {
    type: String,
    required: true,
    unique: true,
    },
    password: {
    type: String,
    required: true,
    minlength: 8,
  },
  age:{
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    default: 'other'
  },

    role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
    },
    interests:
    [{type: String}],
    location:{
    type: String
    }},
    {
    timestamps: true
    });

    userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
    return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
    });

    userSchema.methods.comparePassword = function(entered){
    return bcrypt.compare(entered, this.password);
    }
;
userSchema.methods.comparePassword = function(entered){
    return bcrypt.compare(entered, this.password);
    };

    export default mongoose.model('User', userSchema);