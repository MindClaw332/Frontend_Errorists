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
            group_id: number,
            group_name: string,
            user1_id: number,
            user2_id: number,
            tutor: number,
            course_name: string,
            status: string,
            date: string,
            accepted_at: string,
            declined_at: string
        }
    ]
}
