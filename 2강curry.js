const log = console.log;

// 일반적인 프로그래밍 형태 
// *는 generator를 의미 한다. 

// 인자가 하나만 들어오는 경우는 하나만 처리 2개 들어오는 경우는 2개로 처리 
const curry = f => (a,...bs) => 
  bs.length ? f(a, ...bs) // 인자가 2개 있는 경우 리턴 
      : (...bs) => f(a,...bs); // 인자가 하나 인 경우 그 다음 값을 받 았을때 리턴 하게 한다. 

const filter = curry(function *(f, iter )
  {
    for (const a of iter  )
    {
      // 특정 조건에서 그만 둠, 멈춤 
      if (f (a) ) yield a;
    }
  }
)

const map = curry (function *(f, iter ){
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
// 순서대로 동작 
// go(10, a => a + 10, a => a + 1, log );

const add2 = curry( (a,b) => a+b );

//curry 사용 
//축약이 엄청나게 진행 된다. 
//명령형 코드와 시간복잡도가 같아지게 된다.
//이를 지연 평가라고 한다. 
const f3 = (list, length) =>
 go(
    list, 
    filter( a => a%2),
    map(a => a*a),
    take(length),
    reduce(add)
);
//함수형 프로그래밍의 강점 함수를 축약할 수 있다. 

function main() {
  // log(f([1,2,3,4,5], 1));
  // log(f([1,2,3,4,5], 2));
  // log(f([1,2,3,4,5], 3));
  log(f3([1,2,3,4,5], 3) );
}

main();
