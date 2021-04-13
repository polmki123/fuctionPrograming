const log = console.log;

const curry = f => (a, ...bs) =>
    bs.length // bs 길이가 1 이상인지 확인
        ? f(a, ...bs) // 1 이상이라면 이상이 없다 판별
        : (
              ...bs // 1보다 작다면 bs를 반환하고 다음에 함수 진행
          ) => f(a, ...bs);
const filter = curry(function* (f, iter) {
    for (const a of iter) {
        if (f(a)) yield a;
    }
});

const map = curry(function* (f, iter) {
    for (const a of iter) {
        if (f(a)) yield a;
    }
});

const take = curry(function (length, iter) {
    let res = [];
    for (const a of iter) {
        res.push(a);
        if (res.length == length) return res;
    }
    return res;
});

const reduce = curry(function (f, acc, iter) {
    if (arguments.length == 2) {
        iter = acc[Symbol.iterator]();
        acc = iter.next().value;
    }
    for (const a of iter) {
        acc = f(acc, a);
    }
    return acc;
});

const go = (...as) => reduce((a, f) => f(a), as);

function l_f(iter, length) {
    // log(acc) 최대한 인자와 return 값으로 영향을 끼치도록 진행
    return reduce(
        (acc, a) => acc + a,
        0,
        take(
            length,
            map(
                x => x * x,
                filter(x => x % 2, iter),
            ),
        ),
    );
}
const add = (a, b) => a + b;
const f2 = (list, length) =>
    go(
        list,
        filter(x => x % 2), // 사실상 yield 이기에 지연적으로 동작
        map(x => x * x),
        take(length),
        reduce(add),
        log,
    );

f2([1, 2, 3, 4], 3);
