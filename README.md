# interviewIQ: Ace Your Software Engineering Interview 🚀

Level up your software engineering interview skills with interviewIQ, an AI-powered interview simulator designed to provide realistic practice and instant feedback. Whether you're targeting a tech startup, an enterprise company, or a FAANG giant, interviewIQ helps you sharpen your technical knowledge, coding abilities, and behavioral responses.

## ✨ Key Features

- **Realistic Interview Simulation:** Experience interviews that mimic real-world technical discussions. 🗣️
- **Instant Feedback:** Receive immediate, actionable feedback on your answers and overall performance. 📝
- **Customizable Scenarios:** Tailor interviews by selecting specific topics, difficulty levels, and company profiles. ⚙️
- **AI-Powered Interviewer:** Interact with an AI interviewer that adapts to your responses and provides relevant follow-up questions. 🤖
- **Video Call Interface:** Practice your communication skills with a simulated video call environment. 
- **Interactive Tools:** Utilize a built-in code editor, whiteboard, and note-taking tool to enhance your interview experience. 🔧
- **Speech-to-Text and Text-to-Speech:** Use voice input for answers and listen to the interviewer's responses for a more immersive practice. 🎤
- **Detailed Reports:** Track your progress with comprehensive feedback reports, highlighting strengths and areas for improvement. 📈

## 💻 Technologies Used

| Category        | Technology/Framework | Description                                                                  |
| --------------- | -------------------- | ---------------------------------------------------------------------------- |
| Frontend        | React                | JavaScript library for building user interfaces.                               |
| Frontend        | TypeScript           | Superset of JavaScript which adds static typing.                              |
| Frontend        | Tailwind CSS         | Utility-first CSS framework for rapid UI development.                         |
| Backend         | Node.js              | JavaScript runtime environment for server-side development.                   |
| Backend         | Express.js           | Minimalist web application framework for Node.js.                              |
| AI              | Google Gemini        | powers the AI interview simulation.        |
| UI Components   | Radix UI             | Unstyled, accessible UI primitives.                                          |
| Code Editor     | Monaco Editor        | Provides code editing capabilities.                                          |
| Speech Services | Web Speech API       | Enables speech-to-text and text-to-speech functionalities.                    |
| Speech Services | ElevenLabs API       | Premium text-to-speech service for more natural-sounding voice (optional). |

## 🛠️ Installation

Follow these steps to set up interviewIQ locally:

1.  **Clone the repository:**

```bash
git clone <repository_url>
cd interviewIQ
```

2.  **Install backend dependencies:**

```bash
cd backend
npm install
cd ..
```

3.  **Install frontend dependencies:**

```bash
cd frontend
npm install
cd ..
```

4.  **Configure environment variables:**
    - Create a `.env` file in the `backend` directory.
    - Add your Google Gemini API key:

    ```
    GEMINI_API_KEY=<your_gemini_api_key>
    ```
     -  Create a `.env.development` file in the `frontend` directory
    - Add your frontend url:

    ```
    VITE_FRONTEND_URL=http://localhost:5173/
    ```

5.  **(Optional) ElevenLabs API Key:**
    - To use premium voice, set up an account at [ElevenLabs](https://elevenlabs.io/) and obtain an API key.
    - Add your ElevenLabs API key to the frontend settings during the interview session.

## 🚀 Usage

1.  **Start the backend server:**

```bash
cd backend
npm run dev
```

2.  **Start the frontend development server:**

```bash
cd frontend
npm run dev
```

3.  **Open the application in your browser:**
    - Navigate to `http://localhost:5173`.

4.  **Configure Interview Settings:**
    - Select your desired interview topics, difficulty level, and company profile in the settings tab.
    - Set your preferred interviewer voice and style.

5.  **Start the Interview:**
    - Click the "Start Interview" button to begin your practice session.

6.  **Engage with the AI Interviewer:**
    - Respond to the interviewer's questions using text or voice input.
    - Utilize the code editor, whiteboard, and note-taking tools as needed.

7.  **Review Feedback:**
    - After the interview, review the detailed feedback report to identify areas for improvement.

## 📦 Contributing

We welcome contributions to interviewIQ! To contribute:

1.  **Fork the repository.**
2.  **Create a new branch** for your feature or bug fix.
3.  **Make your changes** and commit them with clear, descriptive messages.
4.  **Submit a pull request** to the main branch.

### Development Setup

1.  Install Node.js and npm.
2.  Install project dependencies as described in the Installation section.
3.  Follow the Usage instructions to start the development servers.

## 📄 License

This project is open-source and available under the MIT License.

[![Built with Dokugen](https://img.shields.io/badge/Built%20with-Dokugen-brightgreen)](https://github.com/samueltuoyo15/Dokugen)
