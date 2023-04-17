import { collection, setDoc, doc, serverTimestamp, addDoc } from 'firebase/firestore'
import { getFirestore } from 'firebase/firestore'

export const useMigrateUser = () => {
    const db = getFirestore()
    const migrateUser = async () => {
        const userDocId = 'xxx1'
        const userSlug = 'taro'
        const userDisplayName = '太郎'
        const userPublicDocument = 'userPublicDocumentV1'
        const tweetPublicDocument = 'tweetPublicDocumentV1'

        // ユーザー作成
        // users/xxx/public/userPublicDocumentV1
        await setDoc(doc(db, 'users', userDocId, 'public', 'userPublicDocumentV1'), {
            slug: userSlug,
            displayName: userSlug,
            description: `${userDisplayName}のデスクリプションです。`,
            link: 'https://google.com',
            type: 'normal',
            iconImageFullPath: 'user-icon-images/14.PNG',
            headerImageFullPath: 'user-header-images/40.PNG',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            followingsCount: 10,
            followersCount: 20,
            tweetsCount: 100,
        })
        console.log('users/xxx/public/userPublicDocumentV1書き込み完了')

        // users/xxx/public/userPublicDocumentV1/myTweets
        await addDoc(collection(db, 'users', userDocId, 'public', userPublicDocument, 'myTweets'), {
            tweetDocRef: doc(db, 'tweets', '6dIazMAtq0gWZu5lqAcU', 'public', tweetPublicDocument),
            createdAt: serverTimestamp(),
        })
        await addDoc(collection(db, 'users', userDocId, 'public', userPublicDocument, 'myTweets'), {
            tweetDocRef: doc(db, 'tweets', 'IOwaV8JM4aoMro5GVtft', 'public', tweetPublicDocument),
            createdAt: serverTimestamp(),
        })
        await addDoc(collection(db, 'users', userDocId, 'public', userPublicDocument, 'myTweets'), {
            tweetDocRef: doc(db, 'tweets', 'Kg2eUwl2Br1XbxN3FrQz', 'public', tweetPublicDocument),
            createdAt: serverTimestamp(),
        })
        await addDoc(collection(db, 'users', userDocId, 'public', userPublicDocument, 'myTweets'), {
            tweetDocRef: doc(db, 'tweets', 'pxIJnoS1mA4WW6nAs8tm', 'public', tweetPublicDocument),
            createdAt: serverTimestamp(),
        })
        console.log('users/xxx/public/userPublicDocumentV1/myTweetsコレクションに4件ドキュメント書き込み完了')

        // users/xxx/public/userPublicDocumentV1/followingUsers
        await addDoc(collection(db, 'users', userDocId, 'public', userPublicDocument, 'followingUsers'), {
            slug: 'hanako',
            displayName: '花子',
            description: 'プロフィール説明花子です。',
            iconImageFullPath: 'user-icon-images/14.PNG',
            followingsCount: 100,
            followersCount: 200,
        })
        console.log('users/xxx/public/userPublicDocumentV1/followingUsers書き込み完了')

        // users/xxx/public/userPublicDocumentV1/followerUsers
        await addDoc(collection(db, 'users', userDocId, 'public', 'userPublicDocumentV1', 'followerUsers'), {
            slug: 'kazuki',
            displayName: '和樹',
            description: 'プロフィール説明和樹です。',
            iconImageFullPath: 'user-icon-images/14.PNG',
            followingsCount: 100,
            followersCount: 200,
        })
        console.log('users/xxx/public/userPublicDocumentV1/followerUsers書き込み完了')

        // users/xxx/private/userPrivateDocumentV1
        await setDoc(doc(db, 'users', userDocId, 'private', 'userPrivateDocumentV1'), {
            email: 'test@test.com',
            muteUsers: [doc(db, 'users', userDocId), doc(db, 'users', 'jiro'), doc(db, 'users', 'saburo')],
            muteWords: ['焼肉', '定食', '歯磨き粉'],
        })
        console.log('users/xxx/private/userPrivateDocumentV1書き込み完了')
    }

    return { migrateUser }
}
