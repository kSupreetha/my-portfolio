import { useState } from "react";

function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hi 👋 I am Supreetha's AI assistant. Ask me about skills, projects, AI/ML work, or contact details.",
    },
  ]);

  const answers = {
    skills:
      "Supreetha knows HTML, CSS, JavaScript, React, Tailwind CSS, Node.js, Express, MongoDB, PostgreSQL, Spring Boot, Python, Machine Learning, Git, and GitHub.",
    projects:
      "Supreetha has built GasTrack, Sleep Disorder Prediction using ML, and a SaaS Dashboard using React and Tailwind CSS.",
    ai: "Supreetha has worked on a Sleep Disorder Prediction project using Machine Learning. It predicts sleep disorders using health and lifestyle data.",
    contact:
      "You can contact Supreetha through email: supreetha.k.2004@gmail.com or GitHub: github.com/kSupreetha.",
  };

  const getBotReply = (question) => {
    const q = question.toLowerCase();

    if (q.includes("skill")) return answers.skills;
    if (q.includes("project")) return answers.projects;
    if (q.includes("ai") || q.includes("ml") || q.includes("machine learning"))
      return answers.ai;
    if (q.includes("contact") || q.includes("email") || q.includes("github"))
      return answers.contact;

    return "I can help you with Supreetha's skills, projects, AI/ML work, and contact information.";
  };

  const sendMessage = (text = input) => {
    if (!text.trim()) return;

    const userMessage = { sender: "user", text };
    const botMessage = { sender: "bot", text: getBotReply(text) };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput("");
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-cyan-400 text-black w-16 h-16 rounded-full shadow-[0_0_25px_#22d3ee] z-50 text-xl font-bold hover:scale-110 transition"
      >
        AI
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 w-96 h-[520px] bg-gray-900 border border-cyan-400 rounded-3xl z-50 shadow-[0_0_30px_#22d3ee] flex flex-col overflow-hidden">
          <div className="p-5 border-b border-gray-700">
            <h2 className="text-cyan-400 text-2xl font-bold">
              Supreetha AI Assistant
            </h2>
          </div>

          <div className="p-4 flex gap-2 flex-wrap">
            <button onClick={() => sendMessage("skills")} className="bg-gray-800 px-3 py-2 rounded-xl text-sm hover:bg-cyan-400 hover:text-black">
              Skills
            </button>
            <button onClick={() => sendMessage("projects")} className="bg-gray-800 px-3 py-2 rounded-xl text-sm hover:bg-cyan-400 hover:text-black">
              Projects
            </button>
            <button onClick={() => sendMessage("AI ML work")} className="bg-gray-800 px-3 py-2 rounded-xl text-sm hover:bg-cyan-400 hover:text-black">
              AI/ML Work
            </button>
            <button onClick={() => sendMessage("contact")} className="bg-gray-800 px-3 py-2 rounded-xl text-sm hover:bg-cyan-400 hover:text-black">
              Contact
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-3 rounded-2xl max-w-[85%] ${
                  msg.sender === "user"
                    ? "bg-cyan-400 text-black ml-auto"
                    : "bg-gray-800 text-white"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-700 flex gap-3">
            <input
              type="text"
              placeholder="Ask something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-xl outline-none"
            />

            <button
              onClick={() => sendMessage()}
              className="bg-cyan-400 text-black px-4 rounded-xl font-bold"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatBot;