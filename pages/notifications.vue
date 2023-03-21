<script setup lang="ts">
import { ref, onMounted, useNuxtApp } from '#imports'
import {
    getFirestore,
    collection,
    query,
    getDocs,
    setDoc,
    doc,
    getDoc,
    Timestamp,
    serverTimestamp,
    addDoc,
} from 'firebase/firestore'
import { useMigrateUser } from '~/composables/migrations'
const { migrateUser } = useMigrateUser()

// コレクション：users取得
const dataD = useAsyncData(async () => {
    const db = getFirestore()
    console.log('useAsyncDataの中に入ってるa')
    const docSnapshot = await getDoc(doc(db, 'users', 'MaWoTy0LqXjIbEG0t3XH', 'public', 'userPublicDocumentV1'))
    const dataData = docSnapshot.data()
    console.log('dataDataの確認cc')
    console.log(dataData)
    return dataData
})
console.log('aaa↓')
console.log(dataD)
console.log('bbb↑')

const taroPublicDocSnapshot = await getDoc(doc(db, 'users', 'taro', 'public', 'userPublicDocumentV1'))
console.log('taroPublicDocSnapshot')
console.log(taroPublicDocSnapshot.data())

// publicのdata取得
const taroPublicFollowersQuerySnapShot = await getDocs(
    collection(db, 'users', 'taro', 'public', 'userPublicDocumentV1', 'followers')
)
taroPublicFollowersQuerySnapShot.forEach((queryDocSnapShot) => {
    console.log('フォロワーサブコレクションの各フィールド↓')
    console.log(queryDocSnapShot.data())
})
const taroPublicFollowingsQuerySnapShot = await getDocs(
    collection(db, 'users', 'taro', 'public', 'userPublicDocumentV1', 'followings')
)
taroPublicFollowingsQuerySnapShot.forEach((queryDocSnapShot) => {
    console.log('フォローイングサブコレクションの各フィールド↓')
    console.log(queryDocSnapShot.data())
})

// const users = taroPublicQuerySnapshot.docs.map(snapshot => {
//   // ここで参照できるsnapshotがqueryDocumentSnapshot
//   console.log(snapshot.id)
//   console.log('data()↓')
//   console.log(snapshot.data())
//   return snapshot.data()
// })
// console.log('■■users', users)
// const userList = ref(users);

const something = () => {
    window.alert('aaaa')
}
// コレクション：usersのサブコレクション取得
const user1TweetsQuerySnapshot = await getDocs(collection(db, 'users', '1', 'tweets'))
const user1Tweets = user1TweetsQuerySnapshot.docs.map((snapshot) => {
    console.log(snapshot.id)
    console.log('userTweets data()↓')
    console.log(snapshot.data())
    return snapshot.data()
})
console.log('user1Tweets', user1Tweets)
const user1TweetList = ref(user1Tweets)

// 本当にリファレンス？
const user1TweetsDocRefs = user1Tweets.map((user1Tweet) => user1Tweet.tweetDocRef)
console.log('user1TweetsDocRefs', user1TweetsDocRefs)
user1TweetsDocRefs.forEach(async (user1TweetDocRef) => {
    const user1TweetDocSnapshot = await getDoc(user1TweetDocRef)
    console.log(user1TweetDocSnapshot.data())
})
const user1Tweet1DocumentSnapshot = await getDoc(user1TweetsDocRefs[0])
console.log('user1Tweet1DocumentSnapshot', user1Tweet1DocumentSnapshot)
console.log(user1Tweet1DocumentSnapshot.data())

// Add a new document in collection "cities"
const setCity = async () => {
    console.log('せっとcity入った')
    await setDoc(
        doc(db, 'cities', 'LA'),
        {
            name: 'Los Angelesaaabbb',
        },
        { merge: false }
    )
}
const addCity = async () => {
    console.log('addCityはいった')
    const docRef = await addDoc(collection(db, 'cities'), {
        name: 'Tokyo',
        state: 'Tokyo',
        country: 'JP',
    })
    console.log(docRef)
    console.log(docRef.id)
    console.log(docRef.parent)
    console.log(docRef.parent.id)
    console.log(docRef.parent.type)
    console.log(docRef.parent.path)
    console.log(docRef.type)
    console.log(docRef.path)
    console.log(docRef.firestore)
}

const createUserDocument = async () => {
    console.log('createUserDocumentはいった')
    // 第一階層のドキュメントの作成
    const userDocRef = await addDoc(collection(db, 'users'), {})
    console.log(userDocRef.id)
    // ドキュメントの中にpublicコレクションとprivateコレクションを作成
    await setDoc(doc(db, 'users', userDocRef.id, 'public', 'userPublicDocumentV1'), {
        description: 'プロフィール説明です。',
    })
    await setDoc(doc(db, 'users', userDocRef.id, 'private', 'userPublicDocumentV1'), {
        email: 'test@test.com',
    })
}
</script>

<template>
    {{ dataD }}
    <ContentsHeader :title="'Google Mapaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa😄'" :sub-title="'12.3万件のツイート'">
        <div class="flex items-center">
            <span
                class="bg-black dark:bg-white px-5 py-1 rounded-full text-gray-200 dark:text-gray-700 font-semibold hover:opacity-80 dark:hover:opacity-90 cursor-pointer"
                >フォロー</span
            >
        </div>
    </ContentsHeader>

    <!-- Userコレクション作成ボタン -->
    <div class="p-4">
        <span class="bg-green-300 p-4 border border-green-600 cursor-pointer hover:opacity-75" @click="migrateUser"
            >Userコレクションにデータ追加ボタン</span
        >
    </div>
    <div class="bg-red-200" @click="setCity">setCityボタン</div>
    <div class="bg-red-200" @click="addCity">addCityボタン</div>
    <div v-for="user in userList" :key="user.slug">
        <div>{{ user.slug }}</div>
        <div>{{ user.name }}</div>
    </div>
    <!-- -----------------------------------------
<div
    v-for="tweet in userTweetList"
    :key="tweet.tweetId"
  >
    <div>{{ tweet.tweetId }}</div>
    <div>{{ tweet.body }}</div>
    <div>{{ tweet.imageFileNames }}</div>
  </div> -->

    <div class="bg-blue-300">
        <div @click="something">ボタン</div>
        <div>
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        </div>
        <div>
            bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
        </div>
        <div>
            あああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ
        </div>
        <div>
            aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaあああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ
        </div>
    </div>
</template>
