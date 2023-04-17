<script setup lang="ts">
import { useEditProfile } from '@/composables/userEditProfile'
import { useEditProfileModal } from '@/composables/modal'
import { onKeyStroke } from '@vueuse/core'

const { visible, closeModal } = useEditProfileModal()
// useスコープでガード節リターンしてるので赤線が引かれてしまう
const { profileDraft, selectHeaderImage, deselectHeaderImage, selectIconImage, isValidLink, isValidEdit, edit } =
    useEditProfile()
console.log('わたしはEditProfileModal.vue')

onKeyStroke('Escape', (e) => {
    closeModal()
})
</script>

<template>
    <div
        v-if="visible"
        class="fixed w-full h-full z-20 top-0 left-0 bg-black dark:bg-white dark:bg-opacity-20 bg-opacity-40 flex justify-center overscroll-contain overflow-y-scroll hidden-scrollbar"
        @click="closeModal"
    >
        <!-- モーダルコンテンツ -->
        <div
            class="bg-white dark:bg-black w-[37rem] h-max opacity-100 mt-20 rounded-2xl py-3 z-30"
            @click="
                (event) => {
                    event.stopPropagation()
                }
            "
        >
            <!-- xボタン行 -->
            <div class="flex items-center justify-between px-4 pb-2">
                <div class="flex items-center gap-6">
                    <!-- ×ボタン正円 -->
                    <div
                        class="w-10 h-10 flex justify-center items-center rounded-full cursor-pointer hover:bg-black/5 dark:hover:bg-white/10"
                        @click="closeModal"
                    >
                        <span class="material-symbols-outlined text-2xl">close</span>
                    </div>
                    <span class="font-bold text-xl">プロフィールを編集</span>
                </div>
                <!-- 保存 -->
                <div class="flex items-center">
                    <button
                        class="bg-black dark:bg-white px-3 py-1 rounded-full text-gray-200 dark:text-gray-700 font-semibold"
                        :class="!isValidEdit ? 'opacity-30' : 'hover:bg-black/80 dark:hover:bg-white/80'"
                        :disabled="!isValidEdit"
                        @click="edit"
                    >
                        保存
                    </button>
                </div>
            </div>

            <!-- 画像行 ヘッダー画像とプロフィール画像重ねる用のrelative-->
            <div class="relative">
                <!-- ヘッダー画像 -->
                <div class="relative w-full h-48 px-1">
                    <img
                        v-if="profileDraft.headerImagePreviewUrl"
                        :src="profileDraft.headerImagePreviewUrl"
                        class="opacity-50 w-full h-full object-cover"
                        alt="現在設定中のヘッダー画像"
                    />
                    <div
                        v-else
                        class="w-full h-full bg-gray-200 dark:bg-gray-800"
                    />
                    <!-- 画像の上のボタン -->
                    <div
                        class="absolute top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%] flex items-center gap-6"
                    >
                        <!-- カメラinput -->
                        <label>
                            <!-- +カメラ正円 -->
                            <div
                                class="w-10 h-10 flex justify-center items-center rounded-full bg-black opacity-60 hover:opacity-40 cursor-pointer"
                                title="ヘッダー画像"
                            >
                                <span class="material-symbols-outlined text-xl text-white/90">add_a_photo</span>
                            </div>
                            <input
                                type="file"
                                accept="image/jpg, image/jpeg, image/png, image/gif, image/webp"
                                name="headerImage"
                                class="hidden"
                                @change="selectHeaderImage"
                            />
                        </label>
                        <!-- ×ボタン正円 -->
                        <button
                            v-if="profileDraft.headerImagePreviewUrl"
                            class="w-10 h-10 flex justify-center items-center rounded-full bg-black opacity-60 hover:opacity-40"
                            @click="deselectHeaderImage"
                        >
                            <span class="material-symbols-outlined text-xl text-white/90">close</span>
                        </button>
                    </div>
                </div>
                <!-- アイコン画像 -->
                <div
                    class="absolute bg-gray-100 dark:bg-gray-900 w-1/5 aspect-square min-w-[3rem] top-[75%] left-4 rounded-full"
                >
                    <!-- プロフィール画像と+カメラの重ねるようのrelative -->
                    <div
                        class="w-full h-full relative border-2 xs:border-4 border-white dark:border-black overflow-hidden"
                        :class="profileDraft.type === 'official' ? 'rounded-lg' : 'rounded-full'"
                    >
                        <img
                            v-if="profileDraft.iconImagePreviewUrl"
                            :src="profileDraft.iconImagePreviewUrl"
                            class="w-full h-full object-cover opacity-50"
                            alt="現在設定中のプロフィール画像"
                        />
                        <!-- カメラinput -->
                        <label class="absolute top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%]">
                            <!-- +カメラ正円 -->
                            <div
                                class="w-10 h-10 flex justify-center items-center rounded-full bg-black opacity-60 hover:opacity-40 cursor-pointer"
                                title="プロフィール画像"
                            >
                                <span class="material-symbols-outlined text-xl text-white/90">add_a_photo</span>
                            </div>
                            <input
                                type="file"
                                accept="image/jpg, image/jpeg, image/png, image/gif, image/webp"
                                name="headerImage"
                                class="hidden"
                                @change="selectIconImage"
                            />
                        </label>
                    </div>
                </div>
            </div>

            <div class="flex flex-col mt-20 mx-4 gap-6">
                <!-- 名前 -->
                <div>
                    <div
                        class="flex flex-col p-2 border dark:border-gray-800 rounded-md"
                        :class="profileDraft.displayName.length === 0 ? 'border-red-500' : ''"
                    >
                        <div class="flex items-center justify-between text-gray-500 text-sm">
                            <label for="profile-draft-displayName">名前</label>
                            <span>{{ profileDraft.displayName.length }} / 30</span>
                        </div>
                        <input
                            v-model="profileDraft.displayName"
                            type="text"
                            maxlength="30"
                            class="text-lg outline-none dark:bg-black"
                        />
                    </div>
                    <div
                        v-if="profileDraft.displayName.length === 0"
                        class="text-red-500 text-sm pl-1"
                    >
                        名前を入力してください
                    </div>
                </div>
                <!-- 自己紹介 -->
                <div class="flex flex-col p-2 border dark:border-gray-800 rounded-md">
                    <div class="flex items-center justify-between text-gray-500 text-sm">
                        <label
                            for="profile-draft-description"
                            class="text-sm text-gray-500"
                        >自己紹介</label>
                        <span>{{ profileDraft.description.length }} / 120</span>
                    </div>
                    <textarea
                        v-model="profileDraft.description"
                        maxlength="120"
                        class="h-20 text-lg resize-none outline-none dark:bg-black"
                    />
                </div>
                <!-- 場所 -->
                <div class="flex flex-col p-2 border dark:border-gray-800 rounded-md">
                    <div class="flex items-center justify-between text-gray-500 text-sm">
                        <label for="profile-draft-place">場所</label>
                        <span>{{ profileDraft.place.length }} / 20</span>
                    </div>
                    <input
                        v-model="profileDraft.place"
                        type="text"
                        maxlength="20"
                        class="text-lg outline-none dark:bg-black"
                    />
                </div>
                <!-- リンク -->
                <div>
                    <div
                        class="flex flex-col p-2 border dark:border-gray-800 rounded-md"
                        :class="!isValidLink ? 'border-red-500' : ''"
                    >
                        <div class="flex items-center justify-between text-gray-500 text-sm">
                            <label for="profile-draft-link">ウェブサイト</label>
                            <span>{{ profileDraft.link.length }} / 80</span>
                        </div>
                        <input
                            v-model="profileDraft.link"
                            type="text"
                            maxlength="80"
                            class="text-lg outline-none dark:bg-black"
                        />
                    </div>
                    <div
                        v-if="!isValidLink"
                        class="text-red-500 text-sm pl-1"
                    >
                        URL形式で入力してください
                    </div>
                </div>
            </div>
        </div>
        <!-- スクロール防止 https://qiita.com/yowatsuyoengineer/items/b43b64e1419fa285b758 -->
        <div class="absolute w-20 h-[calc(100vh+0.5px)]" />
    </div>
</template>
