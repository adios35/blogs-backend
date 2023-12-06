
  import mongoose from 'mongoose';
  import bcrypt from 'bcrypt';

  // Define the User schema
  const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    posts:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article'
    }]
  });

// Hash password sebelum menyimpan ke database
userSchema.pre('save', async function (next) {
  const hash = await bcrypt.hash(this.password, 10); // tingkat hashing 10
  this.password = hash;
  next();
});

// Metode untuk mengecek password pengguna
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

  // Create a User model using the userSchema
const User = mongoose.model('User', userSchema);

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content:{
    type:String,
    required:true,
  },
  author:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true
  },
  category:[String],
  createdAt:{
    type:Date,
    default:Date.now
  }
})

const Article = mongoose.model('Article',articleSchema)

export {User ,Article}