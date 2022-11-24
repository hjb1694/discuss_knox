export enum CoreRole {
    SUPER_ADMINISTRATOR = 'SUPER_ADMINISTRATOR', 
    ADMINISTRATOR = 'ADMINISTRATOR', 
    STAFF = 'STAFF', 
    REGULAR_USER = 'REGULAR_USER'
}

export enum ModeratorRole {
    NONE = 'NONE',
    BRONZE_MODERATOR = 'BRONZE_MODERATOR', 
    SILVER_MODERATOR = 'SILVER_MODERATOR', 
    PLATIMUM_MODERATOR = 'PLATINUM_MODERATOR'
}

export enum ThreadStatus {
    DRAFT = 'DRAFT', 
    PUBLISHED = 'PUBLISHED', 
    HIDDEN = 'HIDDEN', 
    REMOVED = 'REMOVED', 
    CLOSED = 'CLOSED'
}

export interface ThreadData {
    id: number | null;
    author_user_id: number | null;
    author_username: string | null;
    slug: string | null;
    headline: string | null;
    channel_id: number | null;
    content: string | null;
    main_image: string | null;
    status: ThreadStatus | null;
    added_ts: string | null;
    author_core_role: CoreRole | null
    author_moderator_role: ModeratorRole | null
}

export enum OpinionStatus {
    VISIBLE = 'VISIBLE', 
    HIDDEN = 'HIDDEN', 
    REMOVED = 'REMOVED'
}

export interface Reply {
    author_username: string;
    content: string;
}

export interface Opinion {
    id: number | null;
    thread_id: number | null;
    author_user_id: number | null;
    author_username: string | null;
    content: string | null;
    status: OpinionStatus | null;
    added_ts: string | null;
    replies : Reply[];
    is_reply_box_shown: boolean;
}

export interface AuthUserOpinion extends Opinion {
    exists: boolean;
}