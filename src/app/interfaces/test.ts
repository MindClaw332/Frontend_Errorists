export interface Test {
    id: number,
    name: string,
    maxvalue: number,
    course_id:number,
    users: [
        {
            id: number,
            firstname: string,
            lastname: string,
            value: number
        }
    ]
}
