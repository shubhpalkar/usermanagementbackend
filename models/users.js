var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    name: String,
    about: String,
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    skills: [
        {
            skill: {
                type: String,
                required: true,
            },
            level: {
                type: String,
                required: false,
                enum: ['beginner', 'intermediate', 'expert']
            }
        }
    ],
    status: {
        type: String,
        enum: ['inactive', 'active', 'blocked'],
        default: 'active',
    },
},
{
    timestamps: true
});

const user = module.exports = mongoose.model('user', schema);

module.exports.findUserById = (id, cb) => {
    user.findById(id)
        .exec((error, userDetails) => {
            if (error) {
                cb(error)
            }else {
                cb(error, userDetails)
            }
        })
}