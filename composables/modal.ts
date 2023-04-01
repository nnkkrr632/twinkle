import { useState, readonly, computed } from '#imports'
export const useCreateTweetModal = () => {
    // const visible = inject('modal', () => {
    //   console.log('modal.tsでファクトリーの分岐入った')
    //   const visible = ref(false)
    //   provide('modal', visible)
    //   return visible
    // }, true)
    const visible = useState<boolean>('createTweet', () => false)
    const openModal = () => {
        console.log('openModal呼ばれたa')
        visible.value = true
    }

    const closeModal = () => {
        console.log('closeModal呼ばれたa')
        visible.value = false
    }

    return { visible: readonly(visible), openModal, closeModal }
}

export const useImagesModal = () => {
    const images = useState<{ urls: string[]; currentIndex: number }>('images', () => {
        return { urls: [], currentIndex: 0 }
    })
    const currentImageUrl = computed(() => {
        return images.value.urls[images.value.currentIndex]
    })
    const hasLeft = computed(() => {
        return images.value.currentIndex !== 0
    })
    const hasRight = computed(() => {
        return images.value.currentIndex !== images.value.urls.length - 1
    })

    const setImages = (imageUrls: string[], currentIndex: number) => {
        console.log('setImages発火')
        images.value.urls = imageUrls
        images.value.currentIndex = currentIndex
        console.log('現在のインデックス↓')
        console.log(images.value.currentIndex)
        openModal()
    }

    const showLeft = () => {
        if (!hasLeft.value) {
            console.log('レフトない分岐は行ったのでリターン')
            return
        }
        console.log('showLeft発火')
        images.value.currentIndex--
        console.log('現在のインデックス↓')
        console.log(images.value.currentIndex)
    }

    const showRight = () => {
        if (!hasRight.value) {
            console.log('レフトない分岐は行ったのでリターン')
            return
        }
        images.value.currentIndex++
        console.log('現在のインデックス↓')
        console.log(images.value.currentIndex)
    }

    const visible = useState<boolean>('displayingImages', () => false)

    const openModal = () => {
        visible.value = true
    }

    const closeModal = () => {
        console.log('closeModal呼ばれたb')
        visible.value = false
    }

    return {
        currentImageUrl: readonly(currentImageUrl),
        visible: readonly(visible),
        hasLeft: readonly(hasLeft),
        hasRight: readonly(hasRight),
        openModal,
        closeModal,
        setImages,
        showLeft,
        showRight,
    }
}

export const useEditProfileModal = () => {
    const visible = useState<boolean>('editProfile', () => false)
    const openModal = () => {
        console.log('editProfileModal openModal呼ばれた')
        visible.value = true
        console.log('visible.value↓')
        if(visible.value) {
            console.log('visible.valueはtrue')
        }
    }

    const closeModal = () => {
        console.log('editProfileModal closeModal呼ばれた')
        visible.value = false
    }

    return { visible: readonly(visible), openModal, closeModal }
}

export const useConfirmTweetDelete = () => {
    const visible = useState<boolean>('ConfirmTweetDelete', () => false)
    const tweetDocId = useState<string>('deletingTweetDocId', () => '')
    const openModal = (deletingTweetDocId: string) => {
        console.log('ConfirmTweetDelete openModal呼ばれた')
        tweetDocId.value = deletingTweetDocId
        visible.value = true
        console.log('visible.value↓')
        if(visible.value) {
            console.log('visible.valueはtrue')
        }
    }

    const closeModal = () => {
        console.log('ConfirmTweetDelete closeModal呼ばれた')
        visible.value = false
    }

    return { visible: readonly(visible), tweetDocId: readonly(tweetDocId), openModal, closeModal }
}