const { User } = require("../models/User");

let auth = (req, res, next) => {
  // 인증처리 하는 곳

  // 클라이언트 쿠키에서 토큰을 가져온다
  let token = req.cookie.x_auth;

  // 토큰을 복호화 한후 유저를 찾는다
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true });

    req.token = token;
    req.user = user;
    next(); //미들웨어 다음 동작이 실행 될 수 있게 next()
  });

  // 유저가 있다면 인증 ok 없으면 no
};

module.exports = { auth };

// const { User } = require('../models/User');

// let auth = (req, res, next) => {
//   let token = req.cookies.w_auth;

//   User.findByToken(token, (err, user) => {
//     if (err) throw err;
//     if (!user)
//       return res.json({
//         isAuth: false,
//         error: true
//       });

//     req.token = token;
//     req.user = user;
//     next();
//   });
// };

// module.exports = { auth };
