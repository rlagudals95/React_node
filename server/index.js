//백엔드의 시작점
//터미널에 node index.js로 테스트 할 수 있다
const express = require("express"); //npm installexpress로 설치해 리액트 처럼 import
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();

const mongoose = require("mongoose"); //npm install mongoose --save
const { User } = require("./models/User"); //회원가입시 필요한 유저 모델형식 가져온다
const config = require("./config/key");
// bodyParser에 옵션을 줘야한다
// 클라리언트에서 오는 정보를 일기 위함

//application/x-www-form-0urlencoded 같은 형식을 읽기 위함
app.use(bodyParser.urlencoded({ extended: true }));
//application/json 타입을 분석해서 가져올 수 있게함
app.use(bodyParser.json());
app.use(cookieParser());

mongoose
  .connect(
    // mongoDB에서 만든 데이터베이스에 연결
    // 그런데 mongoDB 아이디와 비밀번호가 github에 그대로 들어가면 위험하다 따로 파일로 빼줘서 gitignore로 설정해주자
    config.mongoURI,
    {
      useNewUrlParser: true, //에러가 안뜨게 써준다
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => {
    //mongoose에서 오는 deprecation 경고를 없애기 위해쓴다
    console.log("DB connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  // 콜백함수로 req와 res
  //터미널에 node index.js > localhost:5000으로 접속하면 "hello world"가 보인다
  res.send("hello world!!");
});

// 회원가입시 필요한 정보들을 client에서 받으면
// 그것들을 데이터 베이스에 넣어준다!
app.post("/api/users/register", (req, res) => {
  // req.body안에는 json형식으로 데이터가 있다!
  // 이렇게 json형식으로 읽을 수 있는 이유는 bodyParser덕분!
  const user = new User(req.body);

  user.save((err, userInfo) => {
    // 회원가입 실패
    if (err) return res.json({ success: false, err });
    // 회원가입 성공
    return res.status(200).json({
      success: true,
    });
  }); // mongoDB에 저장
});

// 로그인 기능

app.post("/api/users/login", (req, res) => {
  // 데이터 베이스 내에서 요청한 email찾기
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      // 데이터 베이스에 일치하는 이메일이 없다면
      return res.json({
        loginSuccess: false,
        message: "일치하는 이메일이 없습니다!",
      });
    }

    // 요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는지 체크
    user.comparePassword(req.body.password, (err, isMatch) => {
      //User에서 검사한 다음 매치하는 비밀번호가 없다면 응답
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다",
        });

      // 일치하는 비밀번호가 있으면 토큰생성!
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        // 토큰을 저장한다.. 어디에? 쿠키?, 로컬? 세션?
        // 쿠키에 저장해보자 쿠키 파서를 설치! npm install cookie-parser --sava
        res
          .cookie("x_auth", user.token) //쿠키에 x-auth란 키값으로 들어간다
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });

    // 비밀번호가 일치한다면 token생성!
  });
});
const port = process.env.PORT || 5000;

// 5000포트가 기본이다
app.listen(port, () => console.log(`Example app listening on port ${port}`));
