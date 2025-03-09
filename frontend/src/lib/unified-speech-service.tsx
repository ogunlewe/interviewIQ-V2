import { SpeechService } from "./speech-service"
import { ElevenLabsService } from "./eleven-labs-service"

// An enhanced speech service that can use both browser Speech Synthesis and ElevenLabs
export class UnifiedSpeechService {
    private static instance: UnifiedSpeechService
    private browserSpeech: SpeechService
    private elevenLabs: ElevenLabsService
    private useElevenLabs = false
    private _isSpeaking = false

    private constructor() {
        this.browserSpeech = SpeechService.getInstance()
        this.elevenLabs = ElevenLabsService.getInstance()
    }

    public static getInstance(): UnifiedSpeechService {
        if (!UnifiedSpeechService.instance) {
            UnifiedSpeechService.instance = new UnifiedSpeechService()
        }
        return UnifiedSpeechService.instance
    }

    public setUseElevenLabs(use: boolean): void {
        this.useElevenLabs = use && this.elevenLabs.isAvailable()
    }

    public isUsingElevenLabs(): boolean {
        return this.useElevenLabs && this.elevenLabs.isAvailable()
    }

    public setElevenLabsApiKey(apiKey: string): void {
        this.elevenLabs.setApiKey(apiKey)
    }

    public getElevenLabsApiKey(): string | null {
        return this.elevenLabs.getApiKey()
    }

    public getElevenLabsVoices(): Array<{ id: string; name: string }> {
        return this.elevenLabs.getVoices()
    }

    public setElevenLabsVoice(voiceId: string): void {
        this.elevenLabs.setVoice(voiceId)
    }

    public getSelectedElevenLabsVoice(): string {
        return this.elevenLabs.getSelectedVoice()
    }

    public getBrowserVoices(): SpeechSynthesisVoice[] {
        return this.browserSpeech.getVoices()
    }

    public getPreferredBrowserVoice(): SpeechSynthesisVoice | null {
        return this.browserSpeech.getPreferredVoice()
    }

    public setPreferredBrowserVoice(voice: SpeechSynthesisVoice): void {
        this.browserSpeech.setPreferredVoice(voice)
    }

    public async speak(
        text: string,
        options: {
            rate?: number
            pitch?: number
            volume?: number
            voice?: SpeechSynthesisVoice
            onStart?: () => void
            onEnd?: () => void
            onError?: (error?: any) => void
        } = {},
    ): Promise<void> {
        if (this._isSpeaking) {
            this.stop()
        }

        this._isSpeaking = true
        const handleStart = () => {
            if (options.onStart) options.onStart()
        }

        const handleEnd = () => {
            this._isSpeaking = false
            if (options.onEnd) options.onEnd()
        }

        const handleError = (error?: any) => {
            this._isSpeaking = false
            if (options.onError) options.onError(error)
        }

        if (this.useElevenLabs && this.elevenLabs.isAvailable()) {
            try {
                await this.elevenLabs.generateSpeech(text, {
                    onStart: handleStart,
                    onEnd: handleEnd,
                    onError: (error) => {
                        console.error("ElevenLabs error, falling back to browser speech:", error)
                        // Fallback to browser speech if ElevenLabs fails
                        this.browserSpeech.speak(text, {
                            ...options,
                            onStart: handleStart,
                            onEnd: handleEnd,
                            onError: handleError,
                        })
                    },
                })
            } catch (error) {
                console.error("Error with ElevenLabs, falling back to browser speech:", error)
                // Fallback to browser speech
                this.browserSpeech.speak(text, {
                    ...options,
                    onStart: handleStart,
                    onEnd: handleEnd,
                    onError: handleError,
                })
            }
        } else {
            this.browserSpeech.speak(text, {
                ...options,
                onStart: handleStart,
                onEnd: handleEnd,
                onError: handleError,
            })
        }
    }

    public stop(): void {
        if (this.useElevenLabs && this.elevenLabs.isAvailable() && this.elevenLabs.isCurrentlyPlaying()) {
            this.elevenLabs.stop()
        } else if (this.browserSpeech.isSpeaking()) {
            this.browserSpeech.stop()
        }
        this._isSpeaking = false
    }

    public isSpeaking(): boolean {
        return this._isSpeaking
    }
}

