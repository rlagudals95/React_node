if (process.env.NODE_ENV === 'production') {
    // 개발(local)환경과 프로덕션모드
    module.exports = require('./prod');
} else {
    module.exports = require('./dev');
}