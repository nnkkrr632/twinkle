import { onMounted } from '#imports'
import { doc, DocumentData, getDoc, collection, getDocs, where, query } from 'firebase/firestore'
import { getFirestore } from 'firebase/firestore'
import { useAuthByGoogleAccount } from '@/composables/auth'
import type { User, Tweet } from '@/composables/types'

export const useLikes = () => {
  console.log('■■useLikes()開始。')

  const db = getFirestore()
  const likeTweetDocIds = useState<string[]>('likeTweetDocIds', () => ['aaa', 'bbb', 'ccc'])

  onMounted( () => {
    const { me } = useAuthByGoogleAccount()
    console.log('likes.tsのonMounted()開始。likeTweetDocIds.value↓')
    console.log(likeTweetDocIds.value)
    likeTweetDocIds.value = [ 'ddd', 'eee']
    console.log(likeTweetDocIds.value)
    console.log('★me.value↓')
    console.log(me.value)
    console.log(me)
  })

  const isTweetLikedByMe = (tweetDocId: string) => {
    console.log('isTweetLikedByMe開始')
  }

  return { likeTweetDocIds, isTweetLikedByMe }
}