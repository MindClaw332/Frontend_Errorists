export interface User {
    id:number,
    firstname: string,
    lastname: string,
    eligible: number,
    role: string,
    class_id:number,
    class: string,
    schoolyear: number,
    average: number,
    tests: [
        {
            test_name: string,
            test_value: number,
            test_maxvalue: number
        }
    ],
    groups: [
        {
            id: number,
            group_name: string,
            course_name: string
        }
    ]
}
