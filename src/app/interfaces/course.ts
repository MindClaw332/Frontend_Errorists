export interface Course {
    id: number,
    name: string,
    tests: [
        {
            test_name: string,
            maxvalue: number,
            course_name: string
        }
    ]
}
