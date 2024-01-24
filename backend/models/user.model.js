const mongoose=require('mongoose');

const userSchema=mongoose.Schema({
    name:{type:String,required:true},
    age:String,
    gender:String,
    email:{type:String,required:true},
    pass:{type:String,required:true},
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    }
},{
    versionKey:false
})

const UserModel=mongoose.model('user',userSchema);

module.exports={
    UserModel
}
