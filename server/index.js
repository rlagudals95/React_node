//백엔드의 시작점
//터미널에 node index.js로 테스트 할 수 있다
const express = require("express"); //npm installexpress로 설치해 리액트 처럼 import
const app = express();
const mongoose = require("mongoose"); //npm install mongoose --save
mongoose
  .connect(
    // mongoDB에서 만든 데이터베이스에 연결
    "mongodb+srv://dbfudgudals:tkdel12@@!!@youtubeclone.rqkg7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .then(() => {
    //mongoose에서 오는 deprecation 경고를 없애기 위해쓴다
    console.log("DB connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  //터미널에 node index.js > localhost:5000으로 접속하면 "hello world"가 보인다
  res.send("hello world");
});

// 5000포트가 기본이다
app.listen(5000);
