import { SpeechService } from "./speech-service"
import { ElevenLabsService } from "./eleven-labs-service"

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

    public getBrowserVoices(): SpeechSynthesisVoice[] {
        return this.browserSpeech.getVoices()
    }

    public getPreferredBrowserVoice(): SpeechSynthesisVoice | null {
        return this.browserSpeech.getPreferredVoice()
    }

    public setPreferredVoice(voice: SpeechSynthesisVoice): void {
        this.browserSpeech.setPreferredVoice(voice)
    }

    public getElevenLabsVoices(): Array<{ id: string; name: string }> {
        return this.elevenLabs.getVoices()
    }

    public setElevenLabsApiKey(apiKey: string): void {
        this.elevenLabs.setApiKey(apiKey)
    }

    public setElevenLabsVoiceId(voiceId: string): void {
        this.elevenLabs.setVoice(voiceId)
    }

    public speak(text: string, options: any = {}): Promise<void> {
        if (this._isSpeaking) {
            this.stop()
        }
        this._isSpeaking = true
        return this.browserSpeech.speak(text, options)
    }

    public stop(): void {
        this.browserSpeech.stop()
        this.elevenLabs.stop()
        this._isSpeaking = false
    }

    public isSpeaking(): boolean {
        return this._isSpeaking
    }
} 