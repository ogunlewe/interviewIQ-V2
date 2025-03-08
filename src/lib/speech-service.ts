// Speech synthesis service for text-to-speech functionality
export class SpeechService {
  private static instance: SpeechService
  private synth: SpeechSynthesis
  private voices: SpeechSynthesisVoice[] = []
  private preferredVoice: SpeechSynthesisVoice | null = null
  private speaking = false
  private paused = false
  private utterance: SpeechSynthesisUtterance | null = null

  private constructor() {
    this.synth = window.speechSynthesis
    this.loadVoices()

    // Handle dynamic voice loading in some browsers
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = this.loadVoices.bind(this)
    }
  }

  public static getInstance(): SpeechService {
    if (!SpeechService.instance) {
      SpeechService.instance = new SpeechService()
    }
    return SpeechService.instance
  }

  private loadVoices(): void {
    this.voices = this.synth.getVoices()

    // Try to find a good British English voice
    const britishVoices = this.voices.filter((voice) => voice.lang.includes("en-GB"))

    // Try male British voice first
    const maleBritishVoices = britishVoices.filter((voice) => voice.name.toLowerCase().includes("male"))

    if (maleBritishVoices.length > 0) {
      this.preferredVoice = maleBritishVoices[0]
    } else if (britishVoices.length > 0) {
      // Any British voice is good
      this.preferredVoice = britishVoices[0]
    } else {
      // Fallback to any English voice
      const englishVoices = this.voices.filter((voice) => voice.lang.includes("en"))
      this.preferredVoice = englishVoices.length > 0 ? englishVoices[0] : this.voices[0]
    }
  }

  // Add a method to get the current preferred voice
  public getPreferredVoice(): SpeechSynthesisVoice | null {
    return this.preferredVoice
  }

  // Improve the speech naturalness by handling punctuation better
  public speakNaturally(
    text: string,
    options: {
      rate?: number
      pitch?: number
      volume?: number
      voice?: SpeechSynthesisVoice
      onStart?: () => void
      onEnd?: () => void
      onError?: () => void
    } = {},
  ): void {
    // Cancel any ongoing speech
    this.stop()

    // Clean up the text - remove code blocks, markdown, etc.
    const cleanText = text
      .replace(/```[\s\S]*?```/g, "code block omitted")
      .replace(/`([^`]+)`/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/\[([^\]]+)\]$$[^)]+$$/g, "$1")

    // Create a single utterance
    const utterance = new SpeechSynthesisUtterance(cleanText)

    // Set voice and other properties
    utterance.voice = options.voice || this.preferredVoice
    utterance.rate = options.rate || 0.9 // Slightly slower for more natural speech
    utterance.pitch = options.pitch || 1.1 // Slightly higher pitch for British accent
    utterance.volume = options.volume || 1

    // Set event handlers
    if (options.onStart) {
      utterance.onstart = options.onStart
    }

    if (options.onEnd) {
      utterance.onend = options.onEnd
    }

    if (options.onError) {
      utterance.onerror = options.onError
    }

    // Start speaking
    this.synth.speak(utterance)
    this.speaking = true
    this.utterance = utterance
  }

  // Replace the speak method with speakNaturally in the main interface
  public speak(
    text: string,
    options: {
      rate?: number
      pitch?: number
      volume?: number
      voice?: SpeechSynthesisVoice
      onStart?: () => void
      onEnd?: () => void
      onError?: () => void
    } = {},
  ): void {
    this.speakNaturally(text, options)
  }

  public stop(): void {
    if (this.speaking) {
      this.synth.cancel()
      this.speaking = false
      this.paused = false
    }
  }

  public pause(): void {
    if (this.speaking && !this.paused) {
      this.synth.pause()
      this.paused = true
    }
  }

  public resume(): void {
    if (this.speaking && this.paused) {
      this.synth.resume()
      this.paused = false
    }
  }

  public isSpeaking(): boolean {
    return this.speaking
  }

  public isPaused(): boolean {
    return this.paused
  }

  public getVoices(): SpeechSynthesisVoice[] {
    return this.voices
  }

  public setPreferredVoice(voice: SpeechSynthesisVoice): void {
    this.preferredVoice = voice
  }

  public getVoicesByLang(langCode: string): SpeechSynthesisVoice[] {
    return this.voices.filter((voice) => voice.lang.includes(langCode))
  }
}

// Speech recognition service for speech-to-text functionality
export class SpeechRecognitionService {
  private static instance: SpeechRecognitionService
  private recognition: any // SpeechRecognition is not in the standard TypeScript types
  private isListening = false
  private transcript = ""
  private onResultCallback: ((transcript: string) => void) | null = null
  private onEndCallback: (() => void) | null = null

  private constructor() {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      console.error("Speech recognition not supported in this browser")
      return
    }

    this.recognition = new SpeechRecognition()
    this.recognition.continuous = true
    this.recognition.interimResults = true
    this.recognition.lang = "en-US"

    this.recognition.onresult = (event: any) => {
      let interimTranscript = ""
      let finalTranscript = ""

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript
        } else {
          interimTranscript += event.results[i][0].transcript
        }
      }

      this.transcript = finalTranscript || interimTranscript

      if (this.onResultCallback) {
        this.onResultCallback(this.transcript)
      }
    }

    this.recognition.onend = () => {
      this.isListening = false
      if (this.onEndCallback) {
        this.onEndCallback()
      }
    }
  }

  public static getInstance(): SpeechRecognitionService {
    if (!SpeechRecognitionService.instance) {
      SpeechRecognitionService.instance = new SpeechRecognitionService()
    }
    return SpeechRecognitionService.instance
  }

  public start(onResult?: (transcript: string) => void, onEnd?: () => void): boolean {
    if (!this.recognition) {
      return false
    }

    this.onResultCallback = onResult || null
    this.onEndCallback = onEnd || null
    this.transcript = ""

    try {
      this.recognition.start()
      this.isListening = true
      return true
    } catch (error) {
      console.error("Error starting speech recognition:", error)
      return false
    }
  }

  public stop(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
    }
  }

  public isRecognizing(): boolean {
    return this.isListening
  }

  public getTranscript(): string {
    return this.transcript
  }
}

