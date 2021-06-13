//백엔드의 시작점
//터미널에 node index.js로 테스트 할 수 있다
const express = require("express"); //npm installexpress로 설치해 리액트 처럼 import
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose"); //npm install mongoose --save
const { User } = require("./models/User"); //회원가입시 필요한 유저 모델형식 가져온다

// bodyParser에 옵션을 줘야한다
// 클라리언트에서 오는 정보를 일기 위함

//application/x-www-form-0urlencoded 같은 형식을 읽기 위함
app.use(bodyParser.urlencoded({ extended: true }));
//application/json 타입을 분석해서 가져올 수 있게함
app.use(bodyParser.json());

mongoose
  .connect(
    // mongoDB에서 만든 데이터베이스에 연결
    "mongodb+srv://dbfudgudals:tkdel12@@!!@youtubeclone.rqkg7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
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
  res.send("hello world");
});

// 회원가입시 필요한 정보들을 client에서 받으면
// 그것들을 데이터 베이스에 넣어준다!
app.post("/register", (req, res) => {
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

const port = process.env.PORT || 5000;

// 5000포트가 기본이다
app.listen(port, () => console.log(`Example app listening on port ${port}`));
