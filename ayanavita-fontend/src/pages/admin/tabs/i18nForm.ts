export type LocaleMode = 'en-US' | 'vi' | 'de'

export async function autoTranslateFromEnglish(text: string, target: 'vi' | 'de'): Promise<string> {
  const source = text.trim()
  if (!source) return ''
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${target}&dt=t&q=${encodeURIComponent(source)}`
    const response = await fetch(url)
    if (!response.ok) throw new Error('translate-failed')
    const data = await response.json()
    const translated = Array.isArray(data?.[0]) ? data[0].map((part: any) => part?.[0] || '').join('') : ''
    return translated || source
  } catch {
    return source
  }
}
