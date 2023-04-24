# Twinkle

URL: https://nrpans-twinkle.vercel.app

Nuxt と Firebase で作成した Twitterクローンサイトです。  
よろしければお試しください😄(ツイートにはGoogleアカウントによるログインが必要です)

| 主要パッケージ | バージョン(作成時) | 説明                                                           | 
| -------------- | ------------------ | -------------------------------------------------------------- | 
| nuxt           | 3.3.3              | サイトの作成(SSRモード)                                        | 
| @vueuse/core   | 9.13               | ダークモード、無限スクロール、キーストロークイベントなどの実装 | 
| firebase       | 9.20.0             | Firebase Javascript SDK                                        | 
| tailwindcss    | 3.3.1              | UI                                                             | 
| dayjs          | 1.11.7             | 日付のフォーマット                                             | 
## Nuxt
### SSR
  - `useAsyncData()`でFirestoreからデータを取得した。
  - `useHead()`や`useSeoMeta()`を使用し、サーバーサイドでSEO系タグを生成した。
  - `useState()`でユーザー情報(`/users/uid`)を持たせ、サーバーサイドでログイン状態を判定した。
### その他
  - `error.vue`でも`layouts/default.vue`を使用することで404ページのビューを共通化し、`$route.name.toString()`を参照し細かな表示を切り替えた。  
  - VueUseの`useIntersectionObserver()`を使用して無限スクロールを実装した。
  - middlewareで手順を踏まない退会処理を防止した。
## Firebase
### Authentication
- Googleアカウントによる認証。
- Authenticationの`uid`をFirestoreの`/users/uid`とした。
- Authenticationの`uid`はセキュリティルールで参照したいため、適宜Firestoreのドキュメントフィールドに持たせた。
### Firestore
<img src="https://user-images.githubusercontent.com/91203083/233821015-6dd0090c-67b9-40f5-8187-4a26a0e9d8a9.PNG" />

- ツイートは実データを`/tweets/xxx`のみに持たせ、`/users/uid/myTweetsSubCollection`には`tweetDocId`(=`xxx`)を持たせた。  
リツイート(いいね)時に更新するドキュメントを`/tweets/xxx/retweetUsersSubCollection`(`/tweets/xxx/likeUsersSubCollection`)に限定し、他人のmyTweetsSubCollectionに触れないようにする目的。

- `imageUrl`(実際の画像のURL)と`imageFullPath`(Cloud Storageでのファイルパス)の2つのフィールドを用意した。  
前者は読み込み速度改善のため。(Twinkleでは画像の読み取りに制限はないため、画像投稿時に`firebase/storage.getDownloadURL()`でURLを生成している)  
後者はツイート削除時やプロフィール画像更新時に画像を削除する際に必要となるため。

- 各ツイートに表示する(簡易)ユーザー情報を`/tweets/xxx/userInfo`に保存した。  
(都度`/users/uid`からユーザー情報を取得しクライアントサイドでjoinするのはコストが大きい)

- 「リツイート = typeフィールドが`retweet`のツイート」 は設計ミスだった。  
ツイート一覧取得時にtypeフィールドを参照し、retweetであれば`originalTweetDocId`フィールドからツイートを取得する。ツイートとリツイートがどちらも`/tweets`コレクションへのドキュメント作成・削除となりセキュリティルールが共通となってしまった。

- その他感想
  - フォロー機能は難しいと感じた。  
  フォローしている人のツイート一覧を取得することは`/tweets`コレクションから`slug`フィールドがfollowingsに含まれるtweetドキュメントを取得する、という操作になりそうだが、`firebase/firestore/where in` が最大10個までしか比較できないため、followingsの最大値が10に制限される(= 11人以上フォローできない)と思う。  
  かといって、フォローされている人が各フォロワーの`/users/uid/followingTweetsSubCollection`配下にtweetドキュメントを保存していくことも、followingAのフォロワー数が多い場合を考えると間違っている気がする。
  - 鍵アカウント機能は難しいと感じた。  
  セキュリティルールはコレクション(に所属するドキュメント一括)に対して指定するので、鍵アカウントの場合は(フィールドの値更新ではなく)ドキュメントを移動する必要がある。
### Cloud Storage
- フォルダ名にuidを含めることで、他人に自分の投稿画像が削除されることを防いだ。