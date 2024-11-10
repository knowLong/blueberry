// 8.3 Promiseを使う
// 「非同期処理を行う関数はPromiseオブジェクトを返す」return new Promise<T>();
// 「返されたPromiseオブジェクトにthenでコールバック関数を渡す」
// コールバック関数とは、非同期処理が完了した後に実行される関数。つまり、then句内の関数。
// Promiseオブジェクトに複数のthenメソッドを登録した場合、非同期処理の完了後、登録したthenメソッドが順番に実行される。
// 失敗した場合は、登録したcatchメソッドが実行される。
// then句内の引数には、成功の場合の結果が渡される。

import {readFile} from "fs/promises"
import { resolve } from "path";
const p = readFile("foo.txt", "utf8");
// resultの型がstringになっているのは、非同期処理(この場合はreadFile())の成功時の戻り値がstring型であるから。
p.then((result: string) => {
    console.log("1");
});
p.then((result) => {
    console.log("2");
});
p.catch((e) => {
    console.log("失敗");
});

// 8.3.3 コールバック関数の登録とエラー処理(2)
// Promiseオブジェクトが持つ第3のメソッド「finally」
// finallyメソッドには非同期処理が成否に関わらず実行される処理を記述する。
// 成功しても失敗しても呼び出されるので、引数を受け取らない。
p.finally(()=>{
    console.log("終わりました");
})

// 8.3.4 自分でPromiseオブジェクトを作る
// Promiseコンストラクタは1つの型引数<結果の型>と1つの引数を持つ
// ジェネリクス<>には後続のメソッドに渡すデータの型を、引数()には1つのアロー関数を渡す。
// 引数に渡されるアロー関数をexecutor関数と呼ぶ。
// その関数の引数にはresolveを渡す。(resolveは内部で用意されている関数)
// resolveの引数の中にはPromiseの結果が格納される
// Promiseオブジェクトは最初は未解決の状態だが、このresolve関数が呼び出されるとPromiseが実行完了を意味することになる。

const p1 = new Promise<number>((resolve) => {
    setTimeout(()=>{
        resolve(100);
    }, 3000);
});

p1.then((num) => {
    console.log(`結果は${num}`);
});

// durationミリ秒後にresolveを呼び出す非同期処理
// つまり、durationミリ秒後に、Promiseが実行完了となる。
const sleep = (duration: number) => {
    return new Promise<void>((resolve) => {
        // 関数を引数として渡す際は「()」が不要。単体で実行させるには「()」が必要。
        setTimeout(resolve, duration);
    })
};

sleep(3000).then(() => {
    console.log("3秒経ちました");
});

// executor関数に渡されるresolve以外の引数関数「reject」
// Promiseコンストラクタ内でrejectを呼び出した場合はPromiseが失敗する。
// そして、catch文が実行される。
// 下記のsleepRejectOrResolveメソッドは引数で渡された値が1000未満の場合は失敗し、それ以外の場合は成功する非同期処理。
const sleepRejectOrResolve = (duration: number) => {
    return new Promise<void>((resolve, reject) => {
        if(duration < 1000){
            setTimeout(reject, duration);
        } else {
            setTimeout(resolve, duration);
        }
    })
};

sleepRejectOrResolve(2000).then(() => {
    console.log("成功です")
}).catch(() => {
    console.log("失敗です");
});

// 8.3.5 Promiseの静的メソッド(1)
// Promise.resolveとPromise.reject
// これらは与えられた引数をPromiseの結果として即座に成功/失敗するPromiseオブジェクトを作るためのメソッド。
const p2 = Promise.resolve(100);
p2.then((result) => {
    console.log(`結果は${result}です。`);
});

// new PromiseでPromise.resolve()を作成する方法
new Promise<number>((resolve) => {
    return resolve(100);
}).then((result) => {
    console.log(`結果は${result}です。`)
});

const p3 = Promise.reject(200);
p3.catch((result) => {
    console.log(`失敗！結果は${result}です。`);
});
// new PromiseでPromise.reject()を作成する方法
new Promise<number>((reject) => {
    return reject(200);
}).catch((result) => {
    console.log(`失敗！結果は${result}です。`);
});
// ※Promiseは非同期処理だから実行結果は必ず同期処理が完了した後に呼び出される。

// 8.3.6 Promiseの静的メソッド(2)
// Promise.all()→複数のPromiseオブジェクトを合成するメソッド
/*Promiseオブジェクトの配列を引数として受け取り、すべての非同期処理が成功したら、
成功となるPromiseオブジェクトを返す  */
// 複数の非同期処理を並行に・同時に行いたい場合に適している。
// 例えば、3つのファイルの読み込みを同時並行で行い、すべての読み込みが終わったら次に進むという処理
// 非同期処理開始
const pApple = readFile("apple.txt", "utf-8");
const pGorilla = readFile("gorilla.txt", "utf-8");
const pOtter = readFile("otter.txt", "utf-8");
/* 3つ全ての非同期処理が完了した場合、以下のPromise.allも成功となり、新しいPromiseオブジェクトを返す。
このPromiseの結果は配列となる。(resultsは配列)この配列には、各Promiseの結果が格納されている。
*/
const p4 = Promise.all([pApple, pGorilla, pOtter]); // こいつは結果待ちの状態(then句みたい)既に非同期処理は始まっている。
p4.then((results) => {
    console.log("apple.txt:", results[0]);
    console.log("gorilla.txt:", results[1]);
    console.log("otter.txt:", results[2]);
});
p4.catch((e) => {
    console.log("3つの非同期処理の内どれかが失敗したため、Promise.allのオブジェクトの結果も失敗となった。");
});
/* Promise.allが返すPromiseオブジェクトの特徴は、「Promise.allに与えられたPromiseがすべて成功となったら成功する。
与えられたPromiseの内どれかが失敗となったら失敗する。」*/

// もっとシンプルな書き方
const p5 = Promise.all([
    readFile("apple.txt", "utf-8"), 
    readFile("gorilla.txt", "utf-8"),
    readFile("otter.txt", "utf-8")
]);
// Promiseの結果をthen句に渡す際に直接分割代入できる
// 分割代入して見た目を綺麗にしよう
p5.then(([apple, gorilla, otter]) => {
    console.log("apple.txt", apple);
    console.log("gorilla.txt", gorilla);
    console.log("otter.txt", otter);
}).catch((e) => {
    console.log("3つの非同期処理の内どれかが失敗した。");
});

// Promise.race→受け取った複数のPromiseオブジェクトの内、成否に関わらず最も早く返した結果を受け取るPromiseオブジェクト
const p6 = Promise.race([
    readFile("apple.txt", "utf-8"),
    readFile("gorilla.txt", "utf-8"),
    readFile("otter.txt", "utf-8")
]);
// resultには最も早く非同期処理が完了したPromiseの結果が入る。
p6.then((result) => {
    console.log(result);
}).catch((e) => {
    console.log("失敗");
});
/*Promise.raceの使い道
→タイムアウト(ファイルの読み込みに5秒以上かかったらタイムアウトさせるなど)*/
const sleepReject = (duration: number) => {
    return new Promise<never>((resolve, reject) => {
        setTimeout(reject, duration);
    });
};

Promise.race([
    readFile("apple.txt", "utf-8"),
    sleepReject(2000)
]).then((result) => {
    console.log("2秒以内にファイルを読み取ることができました。",result);
}).catch((e) => {
    console.log("ファイルの読み込みに長時間かかったため、タイムアウトしました。");
});
// 時間で区切って次の処理に移らせたい場合に役立つ(ファイルの読み込みの処理自体は中断するわけではないが...)

// 8.3.7 Promiseの静的メソッド(3)
// Promise.allSettled()は、必ず成功のPromiseオブジェクトを返す。
// 与えられたPromiseオブジェクトが成功しても失敗しても挙動は変わらず、必ず成功のPromiseオブジェクトを返す。
// 成功でも失敗でもいいから、全てのPromiseオブジェクトの処理を最後まで見届けたいときにPromise.allSettledを返す。
// 失敗する非同期処理
const sleepReject1 = (duration: number) => {
    return new Promise<never>((reject) => {
        setTimeout(reject, duration);
    });
};
// 成功する非同期処理
const success = (num: number) => {
    new Promise<number>((resolve) => {
        return resolve(num);
    });
}

Promise.allSettled([
    sleepReject1(1000),
    success(1000)
    // Promise.allSettledがthen句に渡す結果は、オブジェクト型の配列となる。
    // この配列には成功と失敗の情報が入り混じって格納される。これがPromise.allSettled特徴
]).then(([failed, succeeded]) => {
    console.log(failed);
    console.log(succeeded);
});

// 8.3.8 Promiseチェーン(1) チェーンを作る
// catch()の戻り値もPromiseオブジェクト
// catch()の後にthenを使用することが可能。
readFile("apple.txt", "utf-8")
.catch(() => "ファイルの読み込みに失敗しました。"
).then((result) => {
    console.log(result);
});

const p9 = readFile("apple.txt", "utf-8");
// p9が成功したときにcatchはスキップされるが、新しいp9の結果を持つ新しいPromiseオブジェクトを返す。
// だから、p9が成功したときにp9.catchがスキップされたとしても、p10に新しいPromiseオブジェクトが渡されることになる。(大切)
const p10 = p9.catch(() => "");
p10.then((result) => {
    console.log(result);
})
// then句がスキップされる場合も同じ。失敗の結果を持つ新しいPromiseオブジェクトが次に渡される。(大切)

// 8.3.9 Promiseチェーン(2) 非同期処理の連鎖
const p7 = readFile("otter.txt", "utf-8");
const p8 = p7.then((result) => result + result);
p8.then((result) => {
    console.log(result);
});

const repeat10 = (str : string) => {
    const p11 = new Promise<string>((resolve) => {
        setTimeout(
            () => resolve(str.repeat(10)), 1000);
        
    });
};

readFile("otter.txt", "utf-8")
.then((result) => {repeat10(result)})
.then((result) => {
    console.log(result);
});

// ↓メソッドチェーンではない書き方
const p12 = readFile("apple.txt", "utf-8");
const p13 = p12.then((result) => {
    const p14 = repeat10(result);
    return p14;
});
p13.then((result) => {
    console.log(result);
})
// 複数の非同期処理を並行して実行するか、直行で実行させるかを決める際に、非同期処理間の依存関係の有無を確認して判断するべき。
// ②の非同期処理が①の非同期処理の結果を利用しているのなら、➀→➁の直行で(then)でつなぐ処理にするべき。

// 8.3.10 Promiseチェーン(3) エラーの扱い
// コールバック関数内で例外をthrowさせることで、成功したPromiseの結果を失敗に変更することができる。
const p15 = readFile("otter.txt", "utf-8");
const p16 = p15.then((result) => {
    // Promiseの失敗を引き起こす。
    throw new Error("Error!!!!");
});
// 失敗が引き起こされたのでこの処理は実行されない
p16.then((result) => {
    console.log(result);
});

// 失敗したPromiseに何もコールバック関数が登録されていなかったときにUnhandledPromiseRejectionエラーが出る。
const q = readFile("otter.txt", "utf-8")
    .then(() => sleepReject(1000))
    .then((result) => {
        console.log(result);
    })
    // catchによって失敗を成功に変換する
    .catch((err) => {
        console.log("エラーが発生しました!!!", err);
    });

    q.then(() => {
        console.log("終了")
    });
// thenやcatchは新しいPromiseオブジェクトを作成するが、末端のPromiseは必ず成功するようにする。

// 以下のコードは、ファイルの読み取りに失敗するとUnhandledPromiseRejectionエラーが出る。
// つまり、失敗したのにコールバッグ関数が登録されていないことを意味する。
const q1 = readFile("apple.txt", "utf-8");
q1.then((result) => {
    console.log("成功",result);
}); 
//こいつが失敗したときのコールバック関数が登録されていない。
// q1.thenが出力する失敗オブジェクトのエラーハンドリングがされていない。
// 下のq1.catchはq1に対するエラーハンドリング。q1.thenが出力する新しいPromiseオブジェクトに対してではない。
// 処理をスキップするが、結果を伴う新しいPromiseオブジェクトは生成してます。
q1.catch((error) => {
    console.log("失敗", error);
});
// これの理由により、1つのPromiseに対してthenとcatchを別々に呼び出すべきではない。
// 以下が修正したコード。req1が成功した場合OK。失敗した場合、req2に失敗したオブが格納されるが、それに対してcatchが用意されているのでOK。
const req1 = readFile("apple.txt", "utf-8")
// 失敗が伝播するreq1.thenで吐き出す失敗Promiseオブジェクトがreq2に伝播する。
const req2 = req1.then((result) => {
        console.log("成功", result);
    })
const req3 = req2.catch((error) => {
        console.log("失敗", error);;
    })
// このように失敗の可能性があるPromiseオブジェクトにコール関数がしっかりと登録されるようにすべき。