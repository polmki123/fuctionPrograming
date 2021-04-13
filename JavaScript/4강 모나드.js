//  모나드, promise 
// Promise 는 퓨처 모나드 
/*  f, g
    f(g(x)) = f(g(x)) 프로그래밍에서는 이런 x 
    f(g(x)) = x  Kleisli composition 
*/

const log = console.log;

const g = a => a + 1;
const f = a => a * a;

[1] // 이걸 모나드? 어떤 박스안에 어떤 값이 들어간것
log(f(g(1))); 
[1,2,3,4,5].map(g).map(f).forEach(a => log(a));

// 비동기적으로 어떤 일이 끝날지 모를 때 그것을 기다렸다가 합성을 진행하게 만듬
// 에러 해결을 위해 사용 
Promise.resolve(1).then(g).then(f).then(a => log(a));

// Kleisli Composition, Promise
// - f(g(x)) = g(x)

// const g = JSON.parse;
// const f = ({k}) => k;

