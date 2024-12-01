// 8.3 Promiseを使う
// 「非同期処理を行う関数はPromiseオブジェクトを返す」return new Promise<T>();
// 「返されたPromiseオブジェクトにthenでコールバック関数を渡す」
// コールバック関数とは、非同期処理が完了した後に実行される関数。つまり、then句内の関数。
// Promiseオブジェクトに複数のthenメソッドを登録した場合、非同期処理の完了後、登録したthenメソッドが順番に実行される。
// 失敗した場合は、登録したcatchメソッドが実行される。
// then句内の引数には、成功の場合の結果が渡される。

import { writeFile } from "fs";
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

// 8.4 async/await構文
// async関数とその中で使用されるawait式

// 8.4.1 async関数を作ってみる
// async関数の返り値の型は必ずPromiseになる。<Promiseの結果>
// ↓3を結果とするPromiseを返す関数
async function get3(): Promise<number>{
    return 3;
}

const q2 = get3();
// Promiseを経由しているので、thenのコールバック関数は非同期的に実行される。→(処理が完了次第実行される)
q2.then(num => {
    console.log(`num is ${num}`);
});

async function get5(): Promise<number>{
    console.log("get5が呼び出されました");
    return 5;
}

console.log("get5を呼び出します");
const q3 = get5();
q3.then((result) => {
    console.log(`result is ${result} `);
});
console.log("get5が呼び出しました");
// 以下実行結果
/*
get5を呼び出します
get5が呼びだされました
get5を呼び出しました
result is 5
 */

// async関数の中身が同期的に実行される。(ただ上から順に実行されるだけね)
// Promiseの解決に伴うコールバック関数の呼び出しは非同期的に行われる。つまり、いま同期的に行われている実行には割り込めない。
// async関数自体は通常の関数と同じく同期的に行われる。それに対するコールバック関数が「非同期的」に行われる。
// async関数内で例外が起きた場合は、戻り値のPromiseの結果が失敗となる。
// 以上のことから、async関数の結果を使って、非同期的に処理をしたい場合にasunc関数が使用される。

// 8.4.2 await式も使ってみる
// await式はasync関数の中で使う
// 「意味は与えられたPromiseの結果が出るまで待つ」
const slept = (duration: number) => {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, duration);
    })
}

async function get6(): Promise<number>{
    await slept(1000);
    return 6;
}

const q4 = get6();
q4.then(result => {
    console.log(`result is ${result}`);
});
// 1秒後にresult is 6 が表示される。

const sleeping = (duration: number) => {
    return new Promise<number>((resolve) => {
        setTimeout(resolve, duration);
    });
};

async function get7(){
    console.log("get7が呼び出されました");
    await sleeping(1000);
    console.log("awaitの次に進みました")
    return 7;
}

console.log("get7を呼び出します");
const q5 = get7();
q5.then((result) => {
    console.log(`result is ${result}`);
});
console.log("get7を呼び出しました");
/*
 * get7を呼び出します
 * get7が呼び出されました
 * get7を呼び出しました
 * ★表示されてから1s後
 * awaitの次に進みました
 * result is 7
 */

// async関数中でawaitを使うことで、async関数が返したPromiseの結果の決定を遅らせることができる。
// なぜなら、await関数で処理が中断されるため、async関数のreturn文までたどり着かないから

// 8.4.3 awaitの返り値(await関数に返値がある場合は、Promiseオブジェクトではなく、その結果が返値となる。thenの代わり)
const sl = (duration: number) => {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, duration);
    })
};

async function get8(){
    await sl(1000);
    return 8;
}

async function main(){
    // 各await毎に処理が中断する
    const num1 = await get8();//1秒後にawaitが完了してPromiseの結果が確定する。その結果がawaitの「返値」となる。
    const num2 = await get8();//1秒後にawaitが完了してPromiseの結果が確定する。その結果がawaitの「返値」となる。
    const num3 = await get8();//1秒後にawaitが完了してPromiseの結果が確定する。その結果がawaitの「返値」となる。
    return num1 + num2 + num3;
}

main().then((result => {
    console.log(`result is ${result}`);
}));
// 3秒後にresult is 9と表示する。(main()が返したPromiseが完了するまでに3秒かかるということ)

// 別の例 apple.txtに書いてあるデータを二倍にしてotter.txtに書き込む
async function main2(){
    const {readFile, writeFile} = await import("fs/promises");

    const appleContent = await readFile("apple.txt", "utf-8");
    // 2倍にしてotter.txtに書き込む
    await writeFile("otter.txt", appleContent + appleContent);
    console.log("書き込み完了しました");
}

main2().then(() => {
    console.log("main()が完了しました");
});
// 実行すると一瞬で「書き込み完了しました」、「main()が完了しました」と表示される
// async関数の結果が確定するタイミングは、関数内の処理の一番下にたどり着いたとき。

// 以上のように、await式を使うと「ある非同期処理が終わってから次の非同期処理をする」というプログラムをまるで同期プログラムのように
// 上から下に進むという流れに則った形で書くことができる。これがasync/awaitの魅力
// いちいちreadFile().then()のようにすることよりも記述がシンプルになる。


// 8.4.4 awaitとエラー処理
// await p は、pが失敗した場合はpが成功した場合はpの結果を返り値とする一方で、pが失敗した場合はその結果を例外として発生させる。
// awaitで発生した例外はtry-catch文でキャッチすることができる。
async function main3(){
    const {readFile, writeFile} = await import("fs/promises");

    try {
        const appleContent = await readFile("apple.txt", "utf-8");
        await writeFile("otter.txt", appleContent + appleContent);
        console.log("書き込み完了しました");
    } catch {
        console.log("失敗しました");
    }
}

// awaitが失敗しようが成功しようが「main3()が成功しました。」は表示される。
// catch節を通ったとしても、main3()のPromiseは成功という結果になる。だから、then句の処理が走る。
main3().then(() => {
    console.log("main3()が成功しました。");
});

// 8.4.5 async関数のいろいろな宣言方法
// async function式
const main4 = async function(){
    const {readFile, writeFile} = await import("fs/promises");
    const appleContent = await readFile("apple.txt", "utf-8");
    await writeFile("otter.txt", appleContent + appleContent);
    console.log("書き込み完了しました");
};

// asyncアロー関数式の例
const main5 = async () => {
    const {readFile, writeFile} = await import("fs/promises");
    const appleContent = await readFile("apple.txt", "utf-8");
    await writeFile("otter.txt", appleContent + appleContent);
    console.log("書き込み完了しました");
}

// 第6章 高度な型
// 6.1 ユニオン型とインターセクション型
// 6.1.1 ユニオン型の基本
type Animal = {
    speacies: string;
};
type Human = {
    name: string;
}

type User = Animal | Human;

const tama: User = {
    speacies: "こんにちは"
};

const uhyo: User = {
    name: "uhyo",
};

// 存在しない場合があるプロパティにはアクセスすることができない
console.log(tama.speacies);

// 6.1.2 伝播するユニオン型
type Animal2 = {
    speacies: string;
    age: string;
};
type Human2 = {
    name: string;
    age: number;
};
type User2 = Animal2 | Human2;
const tama2: User2 = {
    speacies: "犬",
    age: "10歳",
};
 const uhyo2: User2 = {
    name: "聡",
    age: 40,
 };
 // ageはAnimal2とHuman2のどちらにも必ず存在するからプロパティアクセスすることができる
 // ユニオン型で、プロパティのアクセスの型が異なれば、プロパティの戻り値もユニオン型になる
 function showAge(user: User2) {
    const age = user.age;
    console.log(age);
 }

 // 関数のユニオン型
 type MysteryFunc = 
    | ((str: string) => string)
    | ((str: string) => number);

// 高級関数。関数を受け取って、その関数を呼び出す関数。
function useFunc(func: MysteryFunc){
    const result = func("chiku");
    console.log(result);
}

/*
 ユニオン型を用いると「string | () => number」のように、関数かもしれないしそうでないかもしれない型を作ることができますが、
 そのような変数で関数を呼び出すとコンパイルエラーとなる。
*/
type MaybeFunc = 
    | ((str: string) => string)
    | string;

function useFunc2(func: MaybeFunc){
    //呼び出すことはできない
    //const result = func("chiku");
}

// 6.1.3 インターセクション型とは
// オブジェクト型を拡張した新しい型を作る
type Animal3 = {
    speacies: string;
    age: number;
}

type Human3 = Animal3 & {
    name: string
}

const tama3: Animal3 = {
    speacies: "猫",
    age: 21,
};

const uhyo3: Human3 = {
    speacies: "人",
    age: 25,
    name: "chiku",
};

// Human3は以下の型定義と同じである
type Human33 = {
    speacies: string;
    age: number;
    name: string;
};

// このようにオブジェクト型同士のインターセクション型を取った場合、両者が合成されたオブジェクト型となる。
// &で作られた型は、構成要素の部分型となる。

// 異なるプリミティブ型同士のインターセクション型を作った場合はnever型（属する型がない型）が出現します。
type StringAndNumber = string & number;
// stringかつnumberを満たす値は存在しないからねーーーー

// しかし、、Animal3 & string はnever型にならない
// →理由はTypeScriptではオブジェクト型にプリミティブ値が当てはまることがあるため、「オブジェクト&プリミティブ」がneverにならない。
// 3.7.5 プリミティブなのにプロパティがある？
const str = "こんにちは、世界";
console.log(str.length);
// プリミティブに対して、プロパティアクセスを行う度に一時的にオブジェクトが作られる。
// 疑似的にプロパティを持つという性質により、TypeScriptの型システム上では、プリミティブがオブジェクト型になることある。
type HasLength = {length: number};
const obj: HasLength = "こんにちは";
type StringAndObject = HasLength | string;
const strAndobj: StringAndObject = "こんにちは";

// 6.1.4 ユニオン型とインターセクション型の表裏一体
type Human4 = {name: string};
type Animal4 = {speacies: string};
function getName(human: Human4){
    return human.name;
}
function getSpeacies(animal: Animal4){
    return animal.speacies;
}

const mysteryFunc = Math.random() < 0.5 ? getName : getSpeacies;
//mysteryFuncのユニオン型は、「Human型の値を受け取ってstring型の値を返す関数かもしれないし」「Animal型の値を受け取ってstring型の値を返す関数」
//かもしれない。mysteryFuncには関数が代入される。
// mysteryFuncはHumanを受け取るとは限らないので、引数にHuman4型に値を渡すことはできないし、その一方で、Animal4を受け取るとは限らないので、
// Animal4を渡すこともできない。
// ユニオン型である関数はどの関数型であるか不明であり、よってどんな引数を受け取るのか不明になるから、難しい。
// ではユニオン型の関数を呼び出す方法は？
// 答えは、、、どちらの関数の引数にもなれるような型(インターセクション型)の値を引数に渡す
const uhyo4: Human4 & Animal4 = {
    name: "uhyo",
    speacies: "人"
};
const result = mysteryFunc(uhyo4);

// 6.1.5 オプショナルプロパティ再訪
type Human5 = {
    name: string;
    // オプショナルプロパティを持つプロパティは必然的にユニオン型を持つ。
    // number|undefined ageプロパティを取得すると、それはnumber型の値かもしれないし、undefined型の値つまりundefinedかもしれないということ。
    age?: number;
};

const est: Human5 = {
    name: "take",
    age: 35
};

const naiko: Human5 = {
    name: "sato",
};

// オプショナルなプロパティに対して明示的にundefinedを設定することが可能
const optest: Human5 = {
    name: "テスト",
    age: undefined,
};

// age?: numberとage: number|undefinedは意味が異なることに注意が必要
// age?: numberはプロパティを設定しなくてもよい一方、age: number|undefinedは必ずプロパティ値(数字かundefined)を設定しなければならない
type Human6 = {
    name: string;
    age: number|undefined;
};

const test6: Human6 = {
    name: "test6",
    age: undefined,
};

const nice6: Human6 = {
    name: "ないす",
    age: 23,
};

// オプショナルではないのにageを設定していないから下記はエラーになる。
// const nice8: Human6 = {
//     name: "エラー",
// }

// 一般的に、age?: numberを使う場合は、いちいちundefinedを設定しなくてもよい利便性があるが、故意に設定していないのか、それとも設定ミスなのかが
// コンパイルエラーとかで表現されないからわからない。
// age: number|undefinedでは、書き忘れとかない。なぜなら、コンパイルエラーで検知できるから。
// このようにプロパティがあるかもしれないし、ないかもしれないことは2パターンで表すことができる。
// オプショナルプロパティを使う方法と、ユニオン型でundefinedを型として定義する方法。

/**
 * 6.1.6 オプショナルチェイニングによるプロパティアクセス
 */
// オプショナルアクセスとは、obj.propと書くのではなく、obj?.propと書いてオブジェクトのプロパティにアクセスする。
// オプショナルチェイニングとはアクセスされるオブジェクトがnullやundefinedでも利用できること。
// 通常のobj.propではobjがnullやundefinedである場合は使用できない。
// obj?.propでobjがnullやundefinedの場合、ランタイムエラーは発生せず結果はundefinedになる。
// プログラムによってはHuman | undefinedのように「nullやundefinedかもしれないオブジェクト」を扱う機会が多くあり、「Humanだったらプロパティアクセスするが、undefinedだったら」
//アクセスしないという取り扱いは頻出
type Human7 = {
    name: string;
    age: number;
};

function useMaybeHuman(human: Human7 | undefined) {
    // 変数ageの方はnumber | undefinedになっている。
    const age = human?.age;
    console.log(age);
}
// 関数呼び出しのオプショナルチェイニングとメソッド呼び出しのオプショナルチェイニングがある。
// 引数に何も入れないで、戻り値の型がDate型の関数の型
type GetTimeFunc = () => Date;
function useTime(getTimeFunc: GetTimeFunc | undefined){
    // 関数呼び出しに対してオプショナルチェイニングを使用する際には関数名と()の間に?.を付ける。
    // 関数が与えられているときのみ呼び出したいときはこれを使いましょう。
    const timeOrUndefined = getTimeFunc?.();
}
// メソッドのオプショナルチェイニング呼び出し方法
// obj?.method()とする
// objがnullまたはundefinedの時obj?.method()はundefinedを返す
type User3 = {
    isAdult(): boolean;
}

// userはisAdult()メソッドを持つオブジェクト
function checkForAdultUser(user: User3 | null) {
    //ログインユーザの時、userはnullではない
    //成人済みの時はisAdult()がtrueを返すようにしている
    //undefinedを真偽値判定をするとfalseとなる
    if (user?.isAdult()){
        console.log("ログインユーザかつ成人済みですね");
    }
}
// 未成年ユーザのみとしたい場合は、user?.isAdult() === falseとすればよい

type GetTimeFunc1 = () => Date;

function useTime1(getTimeFunc1: GetTimeFunc1){
    // timeStringOrUndefinedはundefined | string型
    const timeStringOrUndefined = getTimeFunc1?.().toString();
}
// オプショナルチェイニング「.?」では、undefined判定が起きたらその後のチェーンは実行されないでundefinedを返す
// 上記のgetTimeFunc1?.()がundefinedであった場合、toString()は実行されない。だからコンパイルエラーにならない。

// 6.2 リテラル型
// 6.2.1 4種類のリテラル型
// リテラル型はプリミティブ型をさらに細分化したもの。

// これは"foo"という文字列のみが属するリテラル型
// 右辺の"foo"はリテラル型を表す
type FooString = "foo";

// これはOK
// 右辺の"foo"は式(文字列)を表す
const foo: FooString = "foo";

// エラー: Type '"bar"' is not assignable to type '"foo"'
//const bar: FooString = "bar";

// 文字リテラルは、式として使えば文字列を表す式になる一方で、型として使えばそのリテラル型になるとうに、使われる位置によって2つの意味を持つ。

// リテラル型には4種類がある。
/**
 * 文字列のリテラル型
 * 数値のリテラル型
 * 真偽値のリテラル型
 * BigIntのリテラル型
 */
// 文字列のリテラル型
const foo1: "foo1" = "foo1";
// 数値のリテラル型
const num: 1 = 1;
// 真偽値のリテラル型
const bl: true = true;
// BigIntのリテラル型
const bi: 3n = 3n;

// 6.2.2 テンプレートリテラル型
function getHellStr(): `Hello, ${string}!`{
    const rand = Math.random();
    if(rand < 0.3){
        return "Hello, world!";
    } else {
        return "Hello, tateto!";
    }
    // } else if (rand < 0.6){
    //     return "Hello, world";
    // } else {
    //     return "Hello, word";
    // }
}
// 返値の文字列のテンプレートを指定する。合致しない場合はコンパイルエラーとなる。

// テンプレート文字列リテラルからテンプレートリテラル型を型推論してもらうこともできる。
function makeKey<T extends string>(userName: T){
    return `user:${userName}` as const;
}

function fromKey<T extends string>(key: `user:${T}`): T{
    return key.slice(5) as T;
}

const user11 = fromKey("user:こんにちは");

// 6.2.3 ユニオン型とリテラル型を組み合わて使うケース
// リテラル型は、可能な値をある特定のプリミティブ値のみに限定する機能を持っている。
function onlytenta(tenta: "tenta"){
    return tenta;
}
// 上記の関数は"tenta"文字リテラル型の引数を受け取り、"tenta"文字リテラル型文字列"tenta"を返す。
// "tenta"以外の値を受け取ることができない。

// 文字リテラル型を有効活用する方法
/**
 * TypeScriptでは「リテラル型のユニオン型」を作成することが頻出
 * 例えば、「"new"という文字列を受け取るだけの関数」はあまり意味がないが、「"new"または"edit"の文字列を受け取る関数」は使い勝手が良い
 */
// 与えられた引数によって処理を変えている
function newOredit(moji: "new"|"edit"){
    return moji === "new" ? "新規" : "編集中";
}
newOredit("new");
newOredit("edit");
// ↓コンパイルエラー。引数で指定された文字列リテラル型の文字列を渡していないから。
//newOredit("hello");

// booleanではなく文字列とすることで視覚的にコードの意味がわかりやすい
// また、文字列全種類が必要ではなくいくつかの特定の値のみを受け付けたいという場合にユニオン型とリテラル型の組み合わせが非常に適している

// 6.2.4 リテラル型のwidening
// リテラル型が自動的に対応するプリミティブ型に変化するという挙動。2つある。
// 1 letで宣言された変数に代入された場合
const tes = "tes";
let tes1 = "tes";
//tes1 = 3;
// letの場合は、リテラル型ではなくプリミティブ型と型推論される。letは再代入を許容する変数だからです。
// 初期値に対応するプリミティブ型に変化するため、初めに文字列を代入していたらletといえども、数値型の値を代入することはできない。
// 型推論ではなく、ユニオン型で型をしてあげれば代入可能
let numOrstr: number|string = "test";
numOrstr = 1;

// 特定の文字列のみを再代入できるようにするにはリテラル型のユニオン型とする。
let select: "new"|"edit" = "new";
select = "edit";

// 2 オブジェクトリテラルの中
const tet = {
    name: "uh",
    age: 26,
};
// オブジェクトのプロパティ値はリテラル型ではなくプリミティブ型となる
// なぜなら、オブジェクトの中身はletと同様に、後から書き換え可能だから。(readonlyがなければね)
type cno = {
    name: "sty",
    age: number,
}

const fa: cno = {
    name: "sty",
    age: 67,
};

function useNumber(type: number){
    return type > 0 ? "plus" : type < 0 ? "minus" : "zero";
}
function signNumber(type: "plus"|"minus"){
    return type === "plus" ? 1 : -1;
}

// 6.2.5 wideningされるリテラル型・wideningされないリテラル型
// リテラル型の中にもwideningされるリテラル型とwideningされないリテラル型がある。
// wideningされるリテラル型は式としてのリテラル型に足して型推論されたもののみ。
// 一方で、プログラマが明示的に書いたリテラル型はwideningされないリテラル型となる。
// wideningされる"uhyo"型
const uhyo5 = "uhyo5";
// wideningされないリテラル型
const uhyo6: "uhyo6" = "uhyo6";

//string型(型を明示的に指定していないからstring型)
let uhyo7 = uhyo5;
// uhyo6型(明示的にリテラル型を指定しているからuhyo6型)
let uhyo8 = uhyo6;

// 6.3 型の絞り込み
// 型の絞り込みとは、ユニオン型を持つ値が実際にはどちらの値なのかをランタイムに特定するコードを書くことで型情報がそれに応じて変化すること。
// 型の絞り込みにより与えられた値が特定の型の場合のみ処理を行うということが可能になる。
// 型の絞り込みは、コントロールフロー解析(control flow analysis)という。
// 6.3.1 等価演算しを用いる絞り込み

type which = "cat" | "dog";
function dogOrcat(type: "cat"|"dog"): string{
    return type === "cat" ? "猫です" : "犬です"
}
function dogOrcatOrothers(test: which | "others"): string{
    if(test === "others"){
        return "猫でも犬でもありません";
    } else {
        // ここにはwhich型の場合しか来ない。だからdogOrcatがコンパイルエラーにならない。
        // elseの中のtestはwhichしかありない。型の絞り込みが効いている証。TypeScriptはこの文脈を理解している。
        return dogOrcat(test);
    }
}