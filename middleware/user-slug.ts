import { defineNuxtRouteMiddleware, createError } from '#imports'
import { useUserSelect } from '@/composables/userSelect'

// ユーザーが存在するか確認
export default defineNuxtRouteMiddleware( async(to, from) => {
    console.log('■■ミドルウェアのuserSlug開始！')
    const { resolveUidFromUserSlug } = useUserSelect()
    const userSlug = to.params.userSlug
    if (typeof userSlug !== 'string') {
        return
    }
    const uid = await resolveUidFromUserSlug(userSlug)
    if (uid) {
        console.log('ミドルウェアのuserSlugでuserが存在する分岐')
        return
    }
    // ページ読み込み時はerror.vueを表示するけど、ページ内リンクだとerror.vueを表示しない
    throw createError({
        statusCode: 404,
        statusMessage: "ユーザーが存在しません",
        fatal: true,
    })
})
