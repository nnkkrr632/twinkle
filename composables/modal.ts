import { useState, readonly, computed } from '#imports'
export const useCreateTweetModal = () => {
    const visible = useState<boolean>('createTweet', () => false)
    const openModal = () => {
        visible.value = true
    }

    const closeModal = () => {
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
        images.value.urls = imageUrls
        images.value.currentIndex = currentIndex
        openModal()
    }

    const showLeft = () => {
        if (!hasLeft.value) {
            return
        }
        images.value.currentIndex--
    }

    const showRight = () => {
        if (!hasRight.value) {
            return
        }
        images.value.currentIndex++
    }

    const visible = useState<boolean>('displayingImages', () => false)

    const openModal = () => {
        visible.value = true
    }

    const closeModal = () => {
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
        visible.value = true
    }

    const closeModal = () => {
        visible.value = false
    }

    return { visible: readonly(visible), openModal, closeModal }
}

export const useConfirmTweetDelete = () => {
    const visible = useState<boolean>('ConfirmTweetDelete', () => false)
    const tweetDocId = useState<string>('deletingTweetDocId', () => '')
    const openModal = (deletingTweetDocId: string) => {
        tweetDocId.value = deletingTweetDocId
        visible.value = true
    }

    const closeModal = () => {
        visible.value = false
    }

    return { visible: readonly(visible), tweetDocId: readonly(tweetDocId), openModal, closeModal }
}
