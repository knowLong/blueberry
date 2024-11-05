"use strict";
class User1 {
    constructor(name, age) {
        if (name === null) {
            throw new Error("名前を空にできません");
        }
        this.name = name;
        this.age = age;
    }
    getMessage1(str) {
        return this.name + `(${this.age})さん「${str}」`;
    }
}
const uhyo1 = new User1("uhyo", 26);
console.log(uhyo1.getMessage1("こんにちは"));
