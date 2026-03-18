export const standardsDB = [
    {
        id: "std-001",
        name: "test_standard",
        createDate: "2026-03-17",
        standardData: [
            {
                key: "mygrain1",
                name: "ข้าวขาวอวบ",
                maxLength: 10,
                minLength: 6,
                conditionMax: "LE",
                conditionMin: "GE",
                shape: ["wholegrain"]
            },
            {
                key: "mygrain2",
                name: "ข้าวหักทั่วไป",
                maxLength: 6,
                minLength: 0,
                conditionMax: "LT",
                conditionMin: "GE",
                shape: ["broken"]
            }
        ]
    }
];