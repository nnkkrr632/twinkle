import {
    Firestore,
    collection,
    query,
    getDocs,
    setDoc,
    doc,
    getDoc,
    Timestamp,
    serverTimestamp,
    addDoc,
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
    uid: string
    slug: string
    displayName: string
    description: string
    link: string
    place: string
    userType: 'normal' | 'official'
    iconImageFullPath: string
    headerImageFullPath: string
    iconImageUrl: string
    headerImageUrl: string
    tweetsCount: number
    followingsCount: number
    followersCount: number
    likeTweetsCount: number
    createdAt: Timestamp
    updatedAt: Timestamp
    myTweets: DocumentReference[]
    likeTweets: DocumentReference[]
    followings: UserInfo[]
    followers: UserInfo[]
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
    likesCount: number
    retweetsCount: number
    likesUsers: DocumentReference[]
    retweetsUsers: DocumentReference[]
    userInfo: UserInfo
}

export type Tweet = FirestoreTweet & {
    formattedCreatedAt: string
    formattedUpdatedAt: string
}
