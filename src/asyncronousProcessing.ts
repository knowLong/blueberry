// 8.3 Promiseを使う
// 「非同期処理を行う関数はPromiseオブジェクトを返す」return new Promise<T>();
// 「返されたPromiseオブジェクトにthenでコールバック関数を渡す」
// コールバック関数とは、非同期処理が完了した後に実行される関数。つまり、then句内の関数。
// Promiseオブジェクトに複数のthenメソッドを登録した場合、非同期処理の完了後、登録したthenメソッドが順番に実行される。
// 失敗した場合は、登録したcatchメソッドが実行される。
// then句内の引数には、成功の場合の結果が渡される。

import {readFile} from "fs/promises"
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


