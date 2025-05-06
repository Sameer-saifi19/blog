const mongoose = require  ("mongoose");
const Schema  = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const adminSchema = new Schema({
    name: String,
    email: {type: String, unique: true},
    password: String
})

const postSchema = new Schema({
    title: String,
    description: String,
    authorId: ObjectId
})

const adminModel = mongoose.model('admin', adminSchema);
const postModel = mongoose.model('posts', postSchema)

module.exports  = {
    adminModel: adminModel,
    postModel: postModel
}