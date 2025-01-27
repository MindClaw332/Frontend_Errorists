export interface Pairinggroup {
    group_id: number;
    user1_id: number;
    user2_id: number;
    course_id: number;
    status: "PENDING" | "ACCEPTED" | "DECLINED" | "FINISHED"; // Add more statuses if applicable
    date: string; // ISO format date
    accepted_at: string | null; // Nullable
    declined_at: string | null; // Nullable
}
