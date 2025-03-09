// ElevenLabs API service for high-quality text-to-speech
export class ElevenLabsService {
    private static instance: ElevenLabsService
    private apiKey: string | null = null
    private selectedVoiceId = "EXAVITQu4vr4xnSDxMaL" // Default voice (Adam)
    private audioElement: HTMLAudioElement | null = null
    private isPlaying = false
  
    // Available premium voice IDs and names
    private voices = [
      { id: "EXAVITQu4vr4xnSDxMaL", name: "Adam (British)" },
      { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel (American)" },
      { id: "D38z5RcWu1voky8WS1ja", name: "Domi (British)" },
      { id: "MF3mGyEYCl7XYWbV9V6O", name: "Elli (British)" },
      { id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh (American)" },
      { id: "yoZ06aMxZJJ28mfd3POQ", name: "Sam (American)" },
    ]
  
    private constructor() {
      // Create an audio element for playback
      if (typeof window !== "undefined") {
        this.audioElement = new Audio()
        this.audioElement.onended = () => {
          this.isPlaying = false
        }
      }
    }
  
    public static getInstance(): ElevenLabsService {
      if (!ElevenLabsService.instance) {
        ElevenLabsService.instance = new ElevenLabsService()
      }
      return ElevenLabsService.instance
    }
  
    public setApiKey(apiKey: string): void {
      this.apiKey = apiKey
    }
  
    public getApiKey(): string | null {
      return this.apiKey
    }
  
    public getVoices(): Array<{ id: string; name: string }> {
      return this.voices
    }
  
    public setVoice(voiceId: string): void {
      this.selectedVoiceId = voiceId
    }
  
    public getSelectedVoice(): string {
      return this.selectedVoiceId
    }
  
    public isAvailable(): boolean {
      return !!this.apiKey
    }
  
    public async generateSpeech(
      text: string,
      options: {
        onStart?: () => void
        onEnd?: () => void
        onError?: (error: any) => void
      } = {},
    ): Promise<void> {
      if (!this.apiKey) {
        if (options.onError) {
          options.onError(new Error("ElevenLabs API key not set"))
        }
        return
      }
  
      if (this.isPlaying && this.audioElement) {
        this.audioElement.pause()
        this.isPlaying = false
      }
  
      try {
        // Clean up the text before sending to the API
        const cleanText = text
          .replace(/```[\s\S]*?```/g, "code block omitted")
          .replace(/`([^`]+)`/g, "$1")
          .replace(/\*\*([^*]+)\*\*/g, "$1")
          .replace(/\*([^*]+)\*/g, "$1")
          .replace(/\[([^\]]+)\]$$[^)]+$$/g, "$1")
  
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${this.selectedVoiceId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": this.apiKey,
          },
          body: JSON.stringify({
            text: cleanText,
            model_id: "eleven_monolingual_v1",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
            },
          }),
        })
  
        if (!response.ok) {
          throw new Error(`ElevenLabs API error: ${response.statusText}`)
        }
  
        const audioBlob = await response.blob()
        const audioUrl = URL.createObjectURL(audioBlob)
  
        if (this.audioElement) {
          this.audioElement.src = audioUrl
          this.audioElement.onplay = () => {
            this.isPlaying = true
            if (options.onStart) options.onStart()
          }
          this.audioElement.onended = () => {
            this.isPlaying = false
            URL.revokeObjectURL(audioUrl)
            if (options.onEnd) options.onEnd()
          }
          this.audioElement.onerror = (error) => {
            this.isPlaying = false
            if (options.onError) options.onError(error)
          }
          this.audioElement.play()
        }
      } catch (error) {
        if (options.onError) options.onError(error)
      }
    }
  
    public stop(): void {
      if (this.audioElement && this.isPlaying) {
        this.audioElement.pause()
        this.isPlaying = false
      }
    }
  
    public isCurrentlyPlaying(): boolean {
      return this.isPlaying
    }
  }
  
  