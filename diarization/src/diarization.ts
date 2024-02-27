import fetch from 'node-fetch'
import { getDeepgramTranscript } from './deepgram'

// Example:
// Diarize a Deepgram transcript using the Recall speaker timeline.
async function example() {
    const botId = 'some-bot-id'
    const deepgramTranscript = await getDeepgramTranscript(botId)
    const speakerTimeline = await getRecallSpeakerTimeline(botId)

    const words = deepgramTranscript.words
        .map((word) => ({
            text: word.text,
            startTimestamp: word.start,
            endTimestamp: word.end,
        }))
        .sort((a, b) => a.startTimestamp - b.startTimestamp)

    const diarizedParagraphs = buildDiarizedParagraphs(words, speakerTimeline)
    console.log('diarizedParagraphs', diarizedParagraphs)
}

function getSpeakerForWord(
    word: Word,
    speakerTimeline: SpeakerTimeline,
): string {
    // Filter speaker events based on the timestamp range of the word
    const speakerEvents = speakerTimeline.filter(
        (event) =>
            event.timestamp >= word.startTimestamp &&
            event.timestamp <= word.endTimestamp,
    )

    if (speakerEvents.length === 0) {
        console.warn(
            `No speaker events found for word: ${word.text} (start: ${word.startTimestamp}, end: ${word.endTimestamp})`,
        )
        return ''
    }

    // Use the first speaker event found in the range if there are more than one.
    // You may want to fine tune your strategy here.
    const speaker = speakerEvents[0]
    return speaker.name
}

function buildDiarizedParagraphs(
    words: Word[],
    speakerTimeline: SpeakerTimeline,
): Paragraph[] {
    const paragraphs: Paragraph[] = []

    if (words.length === 0) {
        console.error('Error: Empty input array (words).')
        return paragraphs
    }

    let currentSpeaker = getSpeakerForWord(words[0], speakerTimeline)
    let currentParagraph: Paragraph = {
        words: [],
        speaker: currentSpeaker,
    }

    for (const word of words) {
        const speaker = getSpeakerForWord(word, speakerTimeline)

        if (speaker !== currentSpeaker) {
            paragraphs.push(currentParagraph)
            currentParagraph = {
                words: [],
                speaker,
            }
            currentSpeaker = speaker
        }
        currentParagraph.words.push(word)
    }

    return paragraphs
}

/**
 * Get the speaker timeline for a bot from the Recall API
 * @param botId ID of the bot to get the speaker timeline for
 * @returns Speaker timeline for the bot
 */
async function getRecallSpeakerTimeline(
    botId: string,
): Promise<SpeakerTimeline> {
    try {
        const response = await fetch(
            `https://api.recall.ai/api/v1/bot/${botId}/speaker_timeline/`,
        )
        return (await response.json()) as SpeakerTimeline
    } catch (error) {
        console.error(
            `Error fetching speaker timeline for bot ${botId}: ${error}`,
        )
        return []
    }
}

interface Word {
    text: string
    startTimestamp: number
    endTimestamp: number
    language?: string
}

type Paragraph = {
    words: Word[]
    speaker?: string
    language?: string
}

type SpeakerTimeline = SpeakerTimelineEvent[]
type SpeakerTimelineEvent = {
    name: string
    user_id: number
    timestamp: number
}
