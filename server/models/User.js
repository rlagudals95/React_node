// 유저관련 데이터를 보관하기
// 모델이란? schema를 감싸주기 위해
// schema란? 상품을 예로들면 상품에 대한 정보와 타입을 하나하나 정보들을 지정해준 것

const mongoose = require('mongoose')


const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength : 50,
    },
    email: {
        type: String,
        trim: true, // 띄워쓰기를 없애줌
        unique: 1 // 고유한 것 겹치지 않는 것
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number, //관리자 설정
        default:0
    },
    image: String,
    token: { //유효성 검사 위해 필요
        type: String
    },
    tokenExp: { // 토큰 유효기간 지정
        type: Number
    }
})
//스키마를 모델로 감싸준다 ('모델이름',스키마)
const User = mongoose.model('User',userSchema)

module.exports= {User}// 다른데 에서도 쓸 수 있게 exports


















// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const saltRounds = 10;
// const jwt = require('jsonwebtoken');
// const moment = require("moment");

// const userSchema = mongoose.Schema({
//     name: {
//         type:String,
//         maxlength:50
//     },
//     email: {
//         type:String,
//         trim:true,
//         unique: 1 
//     },
//     password: {
//         type: String,
//         minglength: 5
//     },
//     lastname: {
//         type:String,
//         maxlength: 50
//     },
//     role : {
//         type:Number,
//         default: 0 
//     },
//     image: String,
//     token : {
//         type: String,
//     },
//     tokenExp :{
//         type: Number
//     }
// })


// userSchema.pre('save', function( next ) {
//     var user = this;
    
//     if(user.isModified('password')){    
//         // console.log('password changed')
//         bcrypt.genSalt(saltRounds, function(err, salt){
//             if(err) return next(err);
    
//             bcrypt.hash(user.password, salt, function(err, hash){
//                 if(err) return next(err);
//                 user.password = hash 
//                 next()
//             })
//         })
//     } else {
//         next()
//     }
// });

// userSchema.methods.comparePassword = function(plainPassword,cb){
//     bcrypt.compare(plainPassword, this.password, function(err, isMatch){
//         if (err) return cb(err);
//         cb(null, isMatch)
//     })
// }

// userSchema.methods.generateToken = function(cb) {
//     var user = this;
//     console.log('user',user)
//     console.log('userSchema', userSchema)
//     var token =  jwt.sign(user._id.toHexString(),'secret')
//     var oneHour = moment().add(1, 'hour').valueOf();

//     user.tokenExp = oneHour;
//     user.token = token;
//     user.save(function (err, user){
//         if(err) return cb(err)
//         cb(null, user);
//     })
// }

// userSchema.statics.findByToken = function (token, cb) {
//     var user = this;

//     jwt.verify(token,'secret',function(err, decode){
//         user.findOne({"_id":decode, "token":token}, function(err, user){
//             if(err) return cb(err);
//             cb(null, user);
//         })
//     })
// }

// const User = mongoose.model('User', userSchema);

// module.exports = { User }