import dayjs from 'dayjs'

export const getReadableDate = (date: Date) => {
    const now = dayjs()
    const target = dayjs(date)

    // 1分以内なら秒
    if (now.diff(target, 'minute') < 1) {
        return `${now.diff(target, 'second')}秒`
    }
    // １時間以内なら分
    if (now.diff(target, 'hour') < 1) {
        return `${now.diff(target, 'minute')}分`
    }
    // 1日以内なら時間
    if (now.diff(target, 'day') < 1) {
        return `${now.diff(target, 'hour')}時間`
    }
    // 西暦が同じなら月日
    if (now.year() === target.year()) {
        return `${target.format('M月D日')}`
    }
    // 西暦が違うなら年月日
    return `${target.format('YYYY年M月D日')}`
}

// @link https://chaika.hatenablog.com/entry/2022/01/30/083000
export const getRandomString = (): string => {
    const S = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const stringsCount = 16
    return Array.from(crypto.getRandomValues(new Uint32Array(stringsCount)))
        .map((v) => S[v % S.length])
        .join('')
}

export const arrayChunk = <T>(array: T[], size: number): T[][] => {
    if (size <= 0) return [[]]
    const result = []
    for (let i = 0, j = array.length; i < j; i += size) {
        result.push(array.slice(i, i + size))
    }
    return result
}

export const sleep = (waitMillSec: number) => new Promise((resolve) => setTimeout(resolve, waitMillSec))
