const log = console.log;

// 일반적인 프로그래밍 형태 
// *는 generator를 의미 한다. 

// 인자가 하나만 들어오는 경우는 하나만 처리 2개 들어오는 경우는 2개로 처리 
const curry = f => (a,...bs) => 
  bs.length ? f(a, ...bs) // 인자가 2개 있는 경우 리턴 
      : (...bs) => f(a,...bs); // 인자가 하나 인 경우 그 다음 값을 받 았을때 리턴 하게 한다. 

function *filter(f, iter )
{
  for (const a of iter  )
  {
    // 특정 조건에서 그만 둠, 멈춤 
    if (f (a) ) yield a;
  }
}

function *map(f, iter ){
  for (const a of iter  )
  {
    yield f(a);
  }
}

function take( length, iter ){
  let res = [];
  for ( const a of iter)
  {
    res.push(a);
    if( res.length == length) return res; 
  }
} 

// 축약을 하여 return
/* 
function reduce( f, acc, iter){
  for (const a of iter){
    // acc  = acc + a 
    acc = f(acc, a); //외부에서 어떻게 연산을 할 것인지 위임 하는 형식 
  }
  return acc; 
}
*/

//이런식으로 변경하면 축약해서 사용 가능해 진다. 
function reduce( f, acc, iter){
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

const add = (a, b) => a+ b;

// 리스트를 가지고 프로그래밍 진행할 수 있게 하는 것 리즈빙 
// const go = (a,...fs) =>  reduce( (a,f) => f(a) , a, fs); 

// 위의 변경된 reduce를 사용하면 축약된 형태로 작성 가능해 진다. 
const go = (...fs) =>  reduce( (a,f) => f(a) , fs); 
// 순서대로 동작 
// go(10, a => a + 10, a => a + 1, log );

// log(reduce( add, [1,2,3] ));
// log(reduce( add, 10, [1,2,3]) );


const add2 = curry( (a,b) => a+b );
/* 기본적인 프로그래밍 
function f(list, length) {
  let i = 0;
  let acc = 0; 
  for ( const a of list )
  {
    if ( a % 2){
      acc = acc + a * a;
      
      if( ++i == length ) break;
    }
  }
  log(acc);
}
*/ 

/* 기본적인 filter 함수 사용 
function f(list, length) {
  let i = 0;
  let acc = 0; 
  for ( const a of filter ( j => j%2, list) )
  {
    acc = acc + a * a;
    if( ++i == length ) break;
  }
  log(acc);
}
*/

/* map 추가 
function f(list, length) {
  let i = 0; //  명령형 코드 어떻게 그 일을 할 것인지 -> 이를 선언적으로 
  let acc = 0; 
  for ( const a of map( j => j * j, filter ( j => j%2, list) ) )
  {
    acc = acc + a; // a*a 가 map에서 걸러져서 나오기에 없어짐 
    if( ++i == length ) break;
  }
  log('map');
  log(acc);
}
*/ 

/*
function f(list, length) {
  let i = 0; //  명령형 코드 어떻게 그 일을 할 것인지 -> 이를 선언적으로 
  let acc = 0; 
  for ( const a of take( length, map( j => j * j, filter ( j => j%2, list) ) ) ) 
  {
    acc = acc + a; // a*a 가 map에서 걸러져서 나오기에 없어짐 
  }
  log('take');
  //log(acc);  // 최대한 원자와 리턴값으로 소통하는 것이 좋다. 외부 세상에 나오는 것을 막는것이 더 효율적
  return acc;
}
*/ 

/*
function f(list, length) {
  log('reduce');
  return reduce(
    add,
    0,
    take( length, map( j => j * j, filter ( j => j%2, list) ) )
  )
}
*/ 
// 위의 식을 더 짧게 축약 

const f = (list, length) => 
    reduce( add, 0,
      take( length, 
        map( j => j * j, 
          filter ( j => j%2, list) ) ) // 코드 자체가 하나의 값 메타형 
    ); 

const f2 = (list, length) => go(
        list, 
        list => filter( a => a%2, list ),
        list => map(a => a*a, list ),
        list => take(length, list),
        list => reduce(add, 0, list)
);

//curry 사용 
const f3 = (list, length) => go(
  list, 
  list => filter( a => a%2, list ),
  list => map(a => a*a, list ),
  list => take(length)(list),
  list => reduce(add)(list)
);
//함수형 프로그래밍의 강점 함수를 축약할 수 있다. 

function main() {
  // log(f([1,2,3,4,5], 1));
  // log(f([1,2,3,4,5], 2));
  // log(f([1,2,3,4,5], 3));
  log(f2([1,2,3,4,5], 3) );
}

main();
