// 유저관련 데이터를 보관하기
// 모델이란? schema를 감싸주기 위해
// schema란? 상품을 예로들면 상품에 대한 정보와 타입을 하나하나 정보들을 지정해준 것

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const saltRounds = 10; // salt생성하고 비밀번호 암호화
// saltRounds는 salt가 몇 글자인지 설정하는 것
const jwt = require("jsonwebToken");

const userSchema = mongoose.Schema({
  // 사용자가 작성한 스키마를 기준으로 데이터를 DB에 넣기 전에 먼저 검사
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true, // 띄워쓰기를 없애줌
    unique: 1, // 고유한 것 겹치지 않는 것
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number, //관리자 설정
    default: 0,
  },
  image: String,
  token: {
    //유효성 검사 위해 필요
    type: String,
  },
  tokenExp: {
    // 토큰 유효기간 지정
    type: Number,
  },
});

userSchema.pre("save", function (next) {
  var user = this; // userSchema를 가르킨다
  //비밀번호를 암호화 시킨다
  if (user.isModified("password")) {
    //비밀번호 변경시에만 bcrypt를 이용한다 조건!
    // console.log('password changed')
    //클라이언트에서 받은 패스워드로 salt를 생성
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash; // 패스워드를 hash로 암호화
        next(); //암호화가 완료되면 다음단계로.. 데이터 저장!
      });
    });
  } else {
    next();
  }
});

// 비밀번호체크 //this는 userSchema
userSchema.method.comparePassword = function (plainPassword, cb) {
  //ex) plainPassword 1234567 , 암호화된 비밀번호 해쉬 #@$sdfnuia324sdf비교
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    // 비밀번호가 일치한다면 에러는 없고 isMatch
    cb(null, isMatch);
  });
};

/////

/////

// 매치되는 비밀번호가 있을때 토큰을 발급해주는 곳! jsonwebtoken 패키지 다운로드!
userSchema.method.generateToken = function (cb) {
  //jsonwebToken을 이용해 토큰 생성

  var user = this; //데이터 베이스의 유저를 가지고 오고 거기서 아이디를 빼준다

  var token = jwt.sign(user._id.toHexString(), "secretToken"); //토큰이름은 아무거나
  //mongodb 에서 생성된 id (user._id)는 string이 아니므로, mongoDB의 toHexString()
  // user._id + "secretToken"= token;
  user.token = token; //스키마에 넣어줌
  user.save(function (err, user) {
    if (err) return cb(err);
    //에러가 없다면 유저정보 전달
    cb(null, user);
  });
};




//스키마를 모델로 감싸준다 ('모델이름',스키마)
const User = mongoose.model("User", userSchema);

module.exports = { User }; // 다른데 에서도 쓸 수 있게 exports
