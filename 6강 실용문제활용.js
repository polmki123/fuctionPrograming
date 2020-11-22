const log = console.log;

// 메모리 상의 약간의 차이가있을 수 있으나 거의 비슷하다고 본다. (단 절차형의 경우는 더 떨어짐)
const curry = f => (a,...bs) => 
      bs.length ? f(a, ...bs) // 인자가 2개 있는 경우 리턴 
      : (...bs) => f(a,...bs); // 인자가 하나 인 경우 그 다음 값을 받 았을때 리턴 하게 한다. 

const L = {};


// 안전한 합성을 다루어야 한다. 
const go1 = (a, f) => a instanceof Promise ? a.then(f) : f(a); 

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

L.flat = function *(iter)
{
  for (const a of iter)
  {
    if ( a && a[Symbol.iterator])  yield* a;
    else yield a
  }
}
const take = curry (function ( length, iter ){
    let res = [];
    for ( const a of iter)
    {
      res.push(a);
      if( res.length == length) return res; 
    }
    return res;
  } 
)

// 신규 추가 takewhile 아닐때 까지 돌겠다. 
// 들어온 값일 Promise 일때도 조절 하고 싶다면 
const takewhile = curry (function ( f, iter ){
    iter = iter[ Symbol.iterator](); // iter를 만들고
    iter.return = null; // 비동기가 일어났을때 나는 끝내지 않겠다는 뜻
    let res = [];
    // for ( const a of iter) 
    // { 
    //   if( !f(a)) return res;
    //   res.push(a);
    // } 
    // return res; 
    return function recur() {
      for ( const a of iter)
      {  
        const b = go1(a,f);
        
        if( !b ) return res;
        if ( b instanceof Promise ) return b.then(
          async b => b ? ( res.push( await a //a 도 Promise 일 수 있음으로
              ), recur() ): res);
        res.push(a);
        
      }
      return res; 
    } ();
  } 
);

// log ( takewhile( a => a <=2, [Promise.resolve(1), Promise.resolve(2)])) 
// takewhile( a => a < 2, [Promise.resolve(1), Promise.resolve(2)]).then(log);

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

const delay = (time, a) => new Promise( resolve => 
  setTimeout( () => resolve(a), time ) 
  ); 


const go = (...fs) =>  reduce( go1, fs); 


const Impt = {
  payments : {
    0 : [ {iid : 11, oid : 1}, {iid : 12, oid : 2}, {iid : 13, oid : 3} ],
    1 : [ {iid : 14, oid : 4}, {iid : 15, oid : 5}, {iid : 16, oid : 6} ],
    2 : [ {iid : 17, oid : 7}, {iid : 18, oid : 8} ],
    3 : [],
    4 : []
  },
  getPayments : page => {
    log('http://...?page=' + page );
    return delay(100, Impt.payments[page]);
  },
  cancelPayment : paymentId => Promise.resolve( paymentId +' 취소완료')
};

//주문 목록 가져오기 
const getOrders = ids => delay(100, [{id : 1}, {id : 3}, {id : 7}]); 


function job() {
  go(
    L.range(Infinity),
    L.map(Impt.getPayments),
    takewhile(ps => ps.length), 
    L.flat,
    _ => [..._],
    log
    );
}

async function job2() {
  const payments = await go(
    L.range(Infinity),
    L.map(Impt.getPayments),
    takewhile(ps => ps.length), 
    L.flat,
    take(Infinity)
    );

  const orderIds = await go(
    payments,
    L.map( p => p.oid),
    take(Infinity),
    getOrders, //실제로 적용 되는 건 아니지만 in 으로 select 햇다고 가정 
    L.map(o => o.id),
    take(Infinity)
  )
  return Promise.all 
  // Promise.all은 모든 Promise들이 끝났을떄 작동
  // 비슷한 Promise race 3개를 던져서 이중 제일 빨리 끝난 것을 받음 
    (go(
    payments,
    L.filter(p => !orderIds.includes(p.oid)),
    L.map(p => p.iid),
    take(Infinity),
    L.map(Impt.cancelPayment),
    take(Infinity)
  ) ); 
}


// job();
async function recur() 
{
  // await delay(1000*3);
  // return job2().then(log).then(recur);
  Promise.all( 
    [
      delay(1000*3),  
      job().then(log) // 이 코드가 더 오래 걸리면 더 오래걸리게 된다. 
    ] // 이 코드의 경우 둘다 완료가 되어야만 다음 코드를 동작하게 된다. 
  ).then(recur);
}

recur(); // 재귀적으로 계속 발생 

