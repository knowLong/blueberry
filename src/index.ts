type Animal = {
    species: string;
    age: string;
};

type Human = {
    name: string;
    age: number;
}

type User = Animal | Human;

const tama: User = {
    species: "哺乳類",
    age: "永遠20歳"
}

const chiku: User = {
    name: "知久",
    age: 24,
};

function getAge(user: User): string | number {
    return user.age;
}
