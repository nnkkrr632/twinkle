import {
    Timestamp,
    DocumentReference,
    DocumentData,
} from 'firebase/firestore'

export type TweetDraft = {
    body: string
    images: File[]
    imageUrls: string[]
    imagePreviewUrls: string[]
    imageFullPaths: string[]
}

export type UserProfileDraft = {
    displayName: string
    description: string
    place: string
    link: string
    headerImage: File|null
    iconImage: File|null
    headerImagePreviewUrl: string
    iconImagePreviewUrl: string
    headerImageFullPath: string
    iconImageFullPath: string
    headerImageUrl: string
    iconImageUrl: string
}

// 各ツイートに表示されるような簡易ユーザー情報
export type UserInfo = {
    slug: string
    displayName: string
    description: string
    iconImageUrl: string
    userType: 'normal' | 'official'
}

export type FirestoreUser = DocumentData & {
    createdAt: Timestamp
    updatedAt: Timestamp
    uid: string
    slug: string
    displayName: string
    description: string
    place: string
    link: string
    userType: 'normal' | 'official'
    iconImageFullPath: string
    headerImageFullPath: string
    iconImageUrl: string
    headerImageUrl: string
    // 以下サブコレクション
    // myTweetsSubCollection
    // myLikeTweetsSubCollection
}

export type User = FirestoreUser & {
    formattedCreatedAt: string
    formattedUpdatedAt: string
}

export type FirestoreTweet = DocumentData & {
    createdAt: Timestamp
    updatedAt: Timestamp
    tweetDocId: string
    body: string
    imageFullPaths: string[]
    imageUrls: string[]
    type: 'normal' | 'retweet'
    originalTweetDocId?: string
    userInfo: UserInfo
    // 以下サブコレクション
    // likeUsersSubCollection
    // retweetUsersSubCollection
}

export type Tweet = FirestoreTweet & {
    formattedCreatedAt: string
    formattedUpdatedAt: string
    likeUserSlugs: string[]
    retweetUserSlugs: string[]
}

export type Retweet = Tweet & {
    originalTweet: Tweet
}
