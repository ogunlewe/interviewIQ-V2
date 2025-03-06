# interviewIQ 🚀

Ace your next software engineering interview with interviewIQ, your AI-powered practice partner. Get realistic interview experience, instant feedback, and personalized insights to level up your skills.

## Description 🌟

interviewIQ is a React/Typescript application designed to simulate technical interviews. Using the Gemini AI model, it provides a dynamic and interactive interview experience. Practice answering questions on various topics, receive constructive feedback, and track your progress to become interview-ready!

## Key Features ✨

*   **AI-Powered Interviews:** Experience realistic technical interviews powered by the Gemini AI model.
*   **Customizable Topics:** Select specific topics to focus your practice, ranging from JavaScript to Data Structures.
*   **Difficulty Levels:** Choose your preferred difficulty level (Beginner, Intermediate, Advanced, Expert) to match your skill set.
*   **Instant Feedback:** Get immediate feedback on your answers, including a rating and suggestions for improvement.
*   **Performance Tracking:** Monitor your overall performance and identify areas for improvement.
*   **Theme Support:** Enjoy a personalized experience with light and dark theme options.

## Technologies Used 🔧

| Category         | Technology                                      | Description                                                                 |
| ---------------- | ----------------------------------------------- | --------------------------------------------------------------------------- |
| Frontend         | React                                           | JavaScript library for building user interfaces                             |
| Language         | TypeScript                                      | Superset of JavaScript that adds static typing                               |
| Build Tool       | Vite                                            | Fast build tool for modern web development                                  |
| AI               | Google Gemini                                   | Generative AI model used for interview questions and feedback               |
| UI Library       | Radix UI, lucide-react                          | Set of accessible UI primitives and icons                                      |
| Styling          | Tailwind CSS, tailwindcss-animate, clsx        | Utility-first CSS framework                                                |
| Routing          | react-router-dom                                | Standard library for routing in React applications                          |
| State Management | React Hooks                                     | For managing component state and side effects                               |
| Other            | cors, dotenv, express                           | Middleware for enabling CORS, loading environment variables, and setting up server |

## Installation 📦

Follow these steps to get interviewIQ up and running on your local machine:

1.  **Clone the repository:**

    ```bash
    git clone <repository_url>
    cd interviewIQ
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    *   Create a `.env.local` file in the root directory.
    *   Add your Gemini API key:

    ```
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    FRONTEND_URL=http://localhost:5173 # or the URL where your frontend is running
    PORT=3001 # Optional: Change the backend port if needed
    ```

4.  **Start the backend server:**

    ```bash
    node server.js
    ```

5.  **Start the development server:**

    ```bash
    npm run dev
    ```

    This will start the React application, usually on `http://localhost:5173`.

## Usage 🧑‍💻

1.  **Open the application** in your web browser.
2.  **Configure your interview settings** in the "Settings" tab:
    *   Select the desired difficulty level (Beginner, Intermediate, Advanced, Expert).
    *   Choose the topics you want to be quizzed on.
3.  **Start the interview** in the "Interview" tab.
4.  **Answer the questions** posed by the AI interviewer.
5.  **Receive instant feedback** on your answers.
6.  **Track your performance** and identify areas for improvement in the feedback panel.

## Contributing 🤝

We welcome contributions to interviewIQ! Here's how you can help:

1.  **Fork the repository.**
2.  **Create a new branch** for your feature or bug fix:

    ```bash
    git checkout -b feature/your-feature-name
    ```

3.  **Make your changes** and commit them with descriptive messages.
4.  **Push your branch** to your forked repository.
5.  **Submit a pull request** to the main repository.

Please ensure your code follows the project's coding standards and includes appropriate tests.

## License

This project is open source and available under the [MIT License](LICENSE).

[![Built with Dokugen](https://img.shields.io/badge/Built%20with-Dokugen-brightgreen)](https://github.com/samueltuoyo15/Dokugen)
