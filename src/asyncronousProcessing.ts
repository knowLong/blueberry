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