//  모나드, promise 
// 모나드 어떤일이 일어날지 모르는 효과를 감싸놓고
// 나는 이런 형태의 값이야 라고 이야기 하는 것

// Promise
// Promise는 Promise를 값으로 다루기 위해서 사용되는 것 
// 비동기적인 상황과 성공과 실패를 값으로 다루는 형태의 모나드 
// 중요한 것은 이게 값이라는 것 

// 일반 적인 call back 형태로 비동기성을 잡는 것은  값이 아니라 context이다
// 흘러가는 어떤 것 
// 비동기적인 상황을 박스로 만들어 놓고 다루는 것이 중요 

// Promise 는 퓨처 모나드 
/*  f, g
    f(g(x)) = f(g(x)) 프로그래밍에서는 이런 x 
    f(g(x)) = x  Kleisli composition 
*/

const log = console.log;

// Kleisli Composition, Promise
// - f(g(x)) = g(x)

const g = JSON.parse;
const f = ({k}) => k;

const fg = x => Promise.resolve(x)
  .then(g)
  .then(f); 

// fg('{"k" : 10 }').then(log);
fg('{"k : 10 }').catch(_ => '미안...').then(log);

// 이렇게 Promise를 읽음 형태로 다를 수 있음 
const delay = (time, a) => new Promise( resolve => 
  setTimeout( () => resolve(a), time ) 
  ); 

// var a = delay(100, 5); 
//Promise { <pending> }

// const go1 = (a, f) => f(a);
// go1(10, log);
// go1(delay(1000,5), log);
// 10
// Promise { <pending> }

const go1 = (a, f) => a instanceof Promise ? a.then(f) : f(a); 

const a = 10;
const b = delay(1000, 5);

go1(a, log );
go1(b, log );