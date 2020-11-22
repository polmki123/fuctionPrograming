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

// 모나드를 추가로 적용해 본다.  
// 위의 변경된 reduce를 사용하면 축약된 형태로 작성 가능해 진다. 

const go1 = (a, f) => a instanceof Promise ? a.then(f) : f(a); 

// 안전한 합성을 다루어야 한다. 

const go = (...fs) =>  reduce( go1, fs); 

const delay = (time, a) => new Promise( resolve => 
  setTimeout( () => resolve(a), time ) 
  ); 

const a = 10;
const b = delay(1000, 5);

/*
var c = go(Promise.resolve(1),
    a => a + 1,
    a => delay(100, a + 100000),
    a => delay(100, a + 100000))

// 이렇게 promise객체를 만들면 어떠한 시점에 평가된 값을 볼 수 있다. 
c.then(log); 
*/

// log(go(Promise.resolve(1),
//     a => a + 1,
//     a => delay(100, a + 100000),
//     a => delay(100, a + 100000),
//     log))
// Promise { <pending> }

async function af() {
  var b = await go(Promise.resolve(1), // 카스켈의 두노케이션 
    a => a + 1,
    a => delay(100, a + 100000),
    a => delay(100, a + 100000));

  var c = await go(Promise.resolve(1), // 카스켈의 두노케이션 
    a => a + 1,
    a => delay(100, a + 100000));

  log(b, c);
}

af();

