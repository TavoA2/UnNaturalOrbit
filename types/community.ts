export type Session = { configured: boolean; user: { id: string } | null; admin: boolean };
export type Comment = { id: string; body: string; author_id: string; author_name: string; created_at: string };
export type Review = Comment & { title: string; subject: string };

