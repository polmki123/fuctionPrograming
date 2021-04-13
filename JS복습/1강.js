const log = console.log;

function p_f(iter, length) {
    let i = 0;
    let acc = 0;
    for (const a of iter) {
        if (a % 2) {
            log(a);
            aca = acc + a * a;
        }
        if (++i == length) break;
    }
}

function* filter(f, iter) {
    for (const a of iter) {
        if (f(a)) yield a;
    }
}

function* map(f, iter) {
    for (const a of iter) {
        yield f(a);
    }
}

function take(length, iter) {
    let res = [];
    for (const a of iter) {
        res.push(a);
        if (res.length == length) return res;
    }
    return res;
}

function f_1(iter, length) {
    let i = 0; // 선언적으로 기술 하는 것을
    let acc = 0;
    for (const a of take(
        length,
        map(
            x => x * x,
            filter(x => x % 2, iter),
        ),
    )) {
        acc = acc + a;
    }
    // log(acc) 최대한 인자와 return 값으로 영향을 끼치도록 진행
    return acc;
}

// function reduce(f, acc, iter) {
//     for (const a of iter) {
//         acc = f(acc, a);
//     }
//     return acc;
// }

function reduce(f, acc, iter) {
    if (arguments.length == 2) {
        iter = acc[Symbol.iterator]();
        acc = iter.next().value;
    }
    for (const a of iter) {
        acc = f(acc, a);
    }
    return acc;
}

const go = (...as) => reduce((a, f) => f(a), as);

go(
    10,
    a => a + 10,
    a => a + 5,
    log,
);

const curry = f => (a, ...bs) 
        => (bs.length ? // bs 길이가 1 이상인지 확인 
            f(a, ...bs) // 1 이상이라면 이상이 없다 판별 
            : (...bs) => // 1보다 작다면 bs를 반환하고 다음에 함수 진행  
                f(a, ...bs));
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
        list => filter(x => x % 2, list),
        list => map(x => x * x, list),
        list => take(length, list),
        list => reduce(add, 0, list),
        log,
    );

f2([1, 2, 3, 4], 3);

const f = (iter, length) =>
    reduce(
        add,
        0,
        take(
            length,
            map(
                x => x * x,
                filter(x => x % 2, iter),
            ),
        ),
    );

log(f([1, 2, 4, 5], 5));
