// Speech synthesis service for text-to-speech functionality
export class SpeechService {
  private static instance: SpeechService;
  private synth: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private preferredVoice: SpeechSynthesisVoice | null = null;
  private speaking = false;
  private paused = false;
  private utterance: SpeechSynthesisUtterance | null = null;

  private constructor() {
    this.synth = window.speechSynthesis;
    this.loadVoices();

    // Handle dynamic voice loading in some browsers
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = this.loadVoices.bind(this);
    }
  }

  public static getInstance(): SpeechService {
    if (!SpeechService.instance) {
      SpeechService.instance = new SpeechService();
    }
    return SpeechService.instance;
  }

  private loadVoices(): void {
    this.voices = this.synth.getVoices();

    // Try to find a good default voice - prefer a male English voice
    const preferredVoices = this.voices.filter(
      (voice) => voice.lang.includes("en") && voice.name.includes("Male")
    );

    if (preferredVoices.length > 0) {
      this.preferredVoice = preferredVoices[0];
    } else {
      // Fallback to any English voice
      const englishVoices = this.voices.filter((voice) =>
        voice.lang.includes("en")
      );
      this.preferredVoice =
        englishVoices.length > 0 ? englishVoices[0] : this.voices[0];
    }
  }

  public speak(
    text: string,
    options: {
      rate?: number;
      pitch?: number;
      volume?: number;
      voice?: SpeechSynthesisVoice;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: () => void;
    } = {}
  ): void {
    // Cancel any ongoing speech
    this.stop();

    // Create a new utterance
    this.utterance = new SpeechSynthesisUtterance(text);

    // Set voice and other properties
    this.utterance.voice = options.voice || this.preferredVoice;
    this.utterance.rate = options.rate || 1;
    this.utterance.pitch = options.pitch || 1;
    this.utterance.volume = options.volume || 1;

    // Set event handlers
    if (options.onStart) {
      this.utterance.onstart = options.onStart;
    }

    if (options.onEnd) {
      this.utterance.onend = options.onEnd;
    }

    if (options.onError) {
      this.utterance.onerror = options.onError;
    }

    // Start speaking
    this.synth.speak(this.utterance);
    this.speaking = true;
  }

  public stop(): void {
    if (this.speaking) {
      this.synth.cancel();
      this.speaking = false;
      this.paused = false;
    }
  }

  public pause(): void {
    if (this.speaking && !this.paused) {
      this.synth.pause();
      this.paused = true;
    }
  }

  public resume(): void {
    if (this.speaking && this.paused) {
      this.synth.resume();
      this.paused = false;
    }
  }

  public isSpeaking(): boolean {
    return this.speaking;
  }

  public isPaused(): boolean {
    return this.paused;
  }

  public getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  public setPreferredVoice(voice: SpeechSynthesisVoice): void {
    this.preferredVoice = voice;
  }
}

// Speech recognition service for speech-to-text functionality
export class SpeechRecognitionService {
  private static instance: SpeechRecognitionService;
  private recognition: any; // SpeechRecognition is not in the standard TypeScript types
  private isListening = false;
  private transcript = "";
  private onResultCallback: ((transcript: string) => void) | null = null;
  private onEndCallback: (() => void) | null = null;

  private constructor() {
    // Check for browser support
    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Speech recognition not supported in this browser");
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = "en-US";

    this.recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      this.transcript = finalTranscript || interimTranscript;

      if (this.onResultCallback) {
        this.onResultCallback(this.transcript);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onEndCallback) {
        this.onEndCallback();
      }
    };
  }

  public static getInstance(): SpeechRecognitionService {
    if (!SpeechRecognitionService.instance) {
      SpeechRecognitionService.instance = new SpeechRecognitionService();
    }
    return SpeechRecognitionService.instance;
  }

  public start(
    onResult?: (transcript: string) => void,
    onEnd?: () => void
  ): boolean {
    if (!this.recognition) {
      return false;
    }

    this.onResultCallback = onResult || null;
    this.onEndCallback = onEnd || null;
    this.transcript = "";

    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (error) {
      console.error("Error starting speech recognition:", error);
      return false;
    }
  }

  public stop(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  public isRecognizing(): boolean {
    return this.isListening;
  }

  public getTranscript(): string {
    return this.transcript;
  }
}
