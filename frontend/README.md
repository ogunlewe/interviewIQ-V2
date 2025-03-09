# DevInterviewPro: Ace Your Software Engineering Interview! 🚀

DevInterviewPro is your AI-powered interview simulator designed to help you nail your next software engineering interview. Practice with realistic questions, get instant feedback, and level up your skills. Whether you're a beginner or an expert, DevInterviewPro is here to help you succeed.

## Key Features ✨

- **Realistic Interview Simulation:** Experience interviews that mimic real-world technical discussions.
- **Instant Feedback:** Get immediate feedback on your answers and overall performance.
- **Customizable Settings:** Tailor the interview to your specific needs with adjustable difficulty levels, company profiles, and interviewer styles.
- **Interactive Tools:** Use the built-in code editor, whiteboard, and note-taking tool to enhance your preparation.
- **Comprehensive Reports:** Track your progress and identify areas for improvement with detailed performance reports.
- **Voice Activated Mode:** Use the built-in speech to text engine to answer questions and get answers read to you using the text-to-speech capabilities.
- **Video Call Interface:** Simulate a real interview experience with audio and video support.

## Technologies Used 💻

| Category         | Technology                               | Description                                                                                                |
| ---------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Frontend         | React                                    | A JavaScript library for building user interfaces.                                                         |
|                  | TypeScript                               | A typed superset of JavaScript that compiles to plain JavaScript.                                         |
|                  | Tailwind CSS                             | A utility-first CSS framework for rapidly designing custom designs.                                         |
|                  | Radix UI                                 | A set of unstyled, accessible UI primitives.                                                              |
|                  | Lucide React                             | Beautifully simple, pixel-perfect icons.                                                                    |
| Backend          | Node.js                                  | A JavaScript runtime built on Chrome's V8 JavaScript engine.                                                |
|                  | Express                                  | A fast, unopinionated, minimalist web framework for Node.js.                                             |
| AI               | Google Gemini                             | Google's next generation AI model                                                                          |
| Build Tool       | Vite                                     | A fast, lightweight build tool for modern web development.                                                   |

## Installation 🔧

Follow these steps to get DevInterviewPro up and running on your local machine:

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd interviewIQ
   ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Create a `.env.local` file** in the root directory and add your Gemini API key:

    ```
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    FRONTEND_URL=http://localhost:5173
    PORT=3001
    ```

    Make sure to replace `YOUR_GEMINI_API_KEY` with your actual Gemini API key.  Also, ensure `FRONTEND_URL` matches the port your Vite development server runs on.

4. **Run the backend server:**

   ```bash
   node server.js
   ```

    Or use nodemon

   ```bash
   nodemon server.js
   ```

5. **Start the development server:**

   ```bash
   npm run dev
   ```

   This will start the React application in development mode. Open your browser and navigate to `http://localhost:5173` (or the port your Vite server is running on).

## Usage 💡

1. **Home Page:** When you first open the application, you'll be greeted with an introduction to DevInterviewPro and its features.
2. **Configuration:** Tailor the interview to your needs using the settings tab.
    - Choose a difficulty level (Beginner, Intermediate, Advanced, Expert).
    - Select a company profile (Tech Startup, Enterprise, FAANG-level).
    - Pick an interviewer style (Friendly, Neutral, Challenging).
    - Select the topics you want to be interviewed on.
3. **Interview Session:** Click "Start Your Interview" to begin. The interview session will guide you through various stages, including:
    - Introduction and background questions
    - Technical knowledge assessment
    - Coding challenge
    - System design discussion
    - Behavioral questions
    - Candidate questions and wrap-up

4. **Answering Questions:** Type your answers in the provided textarea and submit. You can also use the thinking time button to simulate taking time to think about your answer.
5. **Interactive Tools:**
    - Use the code editor for coding challenges.
    - Open the whiteboard for system design discussions.
    - Take notes during the interview using the note-taking tool.
6.  **Speech to text:** If speech to text is enabled in settings, press the "Speak Answer" button, and begin speaking.  The text box will automatically populate as you speak.
7. **Text to speech:** If enabled in settings, the interviewer's questions and feedback will be read to you using your chosen voice.
8. **Feedback:**  After answering questions, you'll get feedback on your answer and overall performance in the right side bar.
9. **Report:** Track your progress in settings.
10. **Customization**:  Customize available voices, toggle continuous speech mode, and more.

## Contributing 🤝

We welcome contributions to DevInterviewPro! Here's how you can help:

1.  **Fork the repository.**
2.  **Create a new branch** for your feature or bug fix:

    ```bash
    git checkout -b feature/your-feature-name
    ```

3.  **Make your changes** and commit them with descriptive messages.
4.  **Push your branch** to your forked repository.
5.  **Submit a pull request** to the main repository.

We appreciate your contributions!

## License 📄

This project is under the [MIT License](LICENSE).

[![Built with Dokugen](https://img.shields.io/badge/Built%20with-Dokugen-brightgreen)](https://github.com/samueltuoyo15/Dokugen)
