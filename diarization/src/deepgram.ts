export async function getDeepgramTranscript(
    botId: string,
): Promise<DeepgramTranscript> {
    // Deepgram transcript logic placeholder
    // ...
    return {} as DeepgramTranscript
}

interface DeepgramWord {
    text: string
    start: number
    end: number
    confidence: number
    punctuated: boolean
    speaker: number
    language: string
}

interface DeepgramTranscript {
    id: string
    status: string
    language_code: string
    audio_url: string
    text: string
    words: DeepgramWord[]
    confidence: number
    audio_duration: number
    punctuate: boolean
    format_text: boolean
    dual_channel: boolean
    webhook_url: string
    webhook_status_code: number
    webhook_auth: boolean
    webhook_auth_header_name: string
    auto_highlights: boolean
    audio_start_from: number
    audio_end_at: number
    word_boost: string[]
    boost_param: string
    filter_profanity: boolean
    redact_pii: boolean
    redact_pii_audio: boolean
    redact_pii_audio_quality: string
    redact_pii_policies: string[]
    redact_pii_sub: string
    speaker_labels: boolean
    speakers_expected: number
    content_safety: boolean
    iab_categories: boolean
    custom_spelling: string[]
    auto_chapters: boolean
    summarization: boolean
    summary_type: string
    summary_model: string
    custom_topics: boolean
    topics: string[]
    speech_threshold: number
    disfluencies: boolean
    sentiment_analysis: boolean
    entity_detection: boolean
    summary: string
    throttled: boolean
}
