const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  Username: { type: String, required: true, unique: true, trim: true, },
  Password: { type: String, required: true,},
  IsZeus: { type: Boolean, default: false, required: true,},
  IsOwner: { type: Boolean, default: false, required: true,},
});

const User = mongoose.model('Users', UserSchema);
module.exports = User; // Export so can be accessed by other node modules