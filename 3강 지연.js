const log = console.log;


const curry = f => (a,...bs) => 
  bs.length ? f(a, ...bs) // 인자가 2개 있는 경우 리턴 
      : (...bs) => f(a,...bs); // 인자가 하나 인 경우 그 다음 값을 받 았을때 리턴 하게 한다. 

//새로운 nameSpace 
const L = {};

L.range = function *(stop) 
{
  let i = -1;
  while( ++i < stop ) yield i;
};

//yield의 특징 
L.filter = curry(function *(f, iter )
  {
    for (const a of iter  )
    {
      // 특정 조건에서 그만 둠, 멈춤 
      if (f (a) ) yield a;
    }
  }
)

L.map = curry (function *(f, iter ){
    for (const a of iter  )
    {
      yield f(a);
    }
  }
)

const take = curry (function ( length, iter ){
    let res = [];
    for ( const a of iter)
    {
      res.push(a);
      if( res.length == length) return res; 
    }
  } 
)

//이런식으로 변경하면 축약해서 사용 가능해 진다. 
const reduce = curry( function ( f, acc, iter){
    if (arguments.length == 2){
      iter = acc[Symbol.iterator]();
      acc = iter.next().value;
    }
    for( const a of iter){
      // acc  = acc + a 
      acc = f(acc, a); //외부에서 어떻게 연산을 할 것인지 위임 하는 형식 
    }
    return acc; 
  }
)

const add = (a, b) => a+ b;


// 위의 변경된 reduce를 사용하면 축약된 형태로 작성 가능해 진다. 
const go = (...fs) =>  reduce( (a,f) => f(a) , fs); 

const add2 = curry( (a,b) => a+b );


const arr = [
  [1,2],
  [3,4,5],
  [6,7,8],
  [9,10]
];

var users = 
[ 
  {name : 'a', age : 21, family : [
    {name : 'a1', age : 31 }, {name : 'a2', age : 41},
    {name : 'a3', age : 23 }, {name : 'a4', age : 11}
  ]},
  {name : 'b', age : 21, family : [
    {name : 'b1', age : 11 }, {name : 'b2', age : 21},
    {name : 'b3', age : 51 }, {name : 'b4', age : 31}
  ]},
  {name : 'c', age : 21, family : [
    {name : 'c1', age : 11 }, {name : 'c2', age : 21},
  ]},
  {name : 'd', age : 21, family : [
    {name : 'd1', age : 11 }, {name : 'd2', age : 21},
    {name : 'd3', age : 51 }, {name : 'd4', age : 31}
  ]}
];

// 이런식으로 yield 용도로 사용하지만 더 줄일 수도 있다. 
// L.flat = function *(iter)
// {
//   for (const a of iter)
//   {
//     if ( a && a[Symbol.iterator]) 
//     {
//       for (const b of a ) 
//       {
//         console.log(b);
//         yield b;
//       }
//     }
//     else
//     {
//       console.log(a);
//       yield a; 
//     } 
//   }
// }

// yield만 쓰는 경우를 축약하여 사용하는 것도 가능하다. 
L.flat = function *(iter)
{
  for (const a of iter)
  {
    if ( a && a[Symbol.iterator])  yield* a;
    else yield a
  }
}
var it = L.flat(arr);

it.next();
//{ value: 2, done: false }
// log([...L.flat(arr)]);
/* 다음과 같이 출력 
[
  1, 2, 3, 4,  5,
  6, 7, 8, 9, 10
]
*/ 

go(
  arr,
  L.flat,
  L.filter(a => a%2),
  L.map( a=> a*a),
  take(2),
  reduce(add),
  log
  );

go(
  users,
  L.map(u => u.family),
  // L.map(u => u.name),
  L.flat,
  L.filter( u => u.age < 20),
  L.map( u => u.age), // 나이만 뽑고 
  _ => [..._], //데이터를 풀어 버린다. 
  take(3),  // 길이만 뽑고 
  reduce(add), // add 적용 
  log
  );
//curry 사용 
//축약이 엄청나게 진행 된다. 
//명령형 코드와 시간복잡도가 같아지게 된다.
//이를 지연 평가라고 한다. 
const f = (list, length) =>
 go(
    list, 
    L.filter( a => a%2),
    L.map(a => a*a),
    take(length),
    reduce(add)
);
//함수형 프로그래밍의 강점 함수를 축약할 수 있다. 

function main() {

  // log(f3([1,2,3,4,5], 3) );
  // log(f(L.range(Infinity), 200)); 
}

main();
