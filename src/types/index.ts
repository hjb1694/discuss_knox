export enum CoreRole {
    SUPER_ADMINISTRATOR = 'SUPER_ADMINISTRATOR', 
    ADMINISTRATOR = 'ADMINISTRATOR', 
    STAFF = 'STAFF', 
    REGULAR_USER = 'REGULAR_USER'
}

export enum ModeratorRole {
    NONE = 'NONE',
    BRONZE_MODERATOR = 'BRONZE', 
    SILVER_MODERATOR = 'SILVER', 
    PLATIMUM_MODERATOR = 'PLATINUM'
}

export enum ThreadStatus {
    DRAFT = 'DRAFT', 
    PUBLISHED = 'PUBLISHED', 
    HIDDEN = 'HIDDEN', 
    REMOVED = 'REMOVED', 
    CLOSED = 'CLOSED'
}

export enum AccountStatus {
    NOT_VERIFIED = 'NOT_VERIFIED', 
    ACTIVE = 'ACTIVE',
    FROZEN = 'FROZEN',
    VIOLATION_DEACTIVATION = 'VIOLATION_DEACTIVATION', 
    USER_SELF_DEACTIVATION = 'USER_SELF_DEACTIVATION'
}

export interface ThreadData {
    id: number | undefined;
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
    id: number;
    author_user_id: number;
    author_username: string;
    content: string;
    author_core_role: CoreRole;
    author_moderator_role: ModeratorRole;
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
    author_core_role: CoreRole | null, 
    author_moderator_role: ModeratorRole | null
    is_reply_box_shown: boolean;
}

export interface AuthUserOpinion extends Opinion {
    exists: boolean;
}

export interface ProfileData {
    isPrivate: boolean | null, 
    accountStatus: string | null, 
    coreRole: CoreRole | null, 
    moderatorRole: ModeratorRole | null, 
    gender: string | null, 
    isBlocked: boolean | null, 
    isBlocker: boolean | null,
    bio: string | null, 
    location: string | null, 
    occupation: string | null, 
    profileImage: string | null, 
    userId: number | null, 
    followStatus: string | null
}

export interface Channel{
    id: number | undefined;
    channel_name: string | null;
    channel_slug: string | null;
}

export interface Message{
    message_id: number;
    message_content: string;
    sender_user_id: number;
    receiver_user_id: number;
    sender_username: string;
    receiver_username: string;
    added_ts: string;
    is_read: boolean;
}