import React, { useState, useRef } from 'react';


const Chatbot = () => {
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const chatContainerRef = useRef(null);

  const shortcuts = {
    "Website": "which study is a website?",
    "Web App": "which study is a web application?",
    "Quantitative": "which study used quantitative methodology?",
    "Iterative": "Which study used an iterative Software Development Methodology?",
    "Animals": "Which studies are related to animals?",
    "Nature": "Which study is related about nature?",
    "Geography": "Which studies are related to geography?",
  };

  const arrayOfPossibleMessages = [
    { message: "hi", response: "hello" },
    { message: "which study is a website?", response: "Web-Based Equipment Maintenance Monitoring System for DHVSU Facilities, PALENGKIHAN, CODEQUEST, Monitoring System for DHVSU Facilities." },
    { message: "which study is a web application?", response: "Taskgrove, Online Financial Assistance, HTEFinder, COMPAWNION." },
    { message: "which study used quantitative methodology?", response: "CODEQUEST, Taskgrove, HTEFinder" },
    { message: "which study used mix method?", response: "COMPAWNION, Web-Based Equipment Maintenance Monitoring System for DHVSU Facilities." },
    { message: "Which study used an iterative Software Development Methodology?", response: "MSWD Online Financial Assistance, ANTABE, HTEFINDER, COMPAWNION." },
    { message: "Which study uses an agile Software Development Methodology?", response: "Taskgrove, Equipment maintenance monitoring, CODEQUEST, PALENGKIHAN." },
    { message: "agile method", response: "Taskgrove, Equipment maintenance monitoring, CODEQUEST, PALENGKIHAN." },
    { message: "Which studies are related to animals?", response: "COMPAWNION." },
    { message: "Which studies are about people with disability?", response: "ANTABE." },
    { message: "Which study is related about nature?", response: "Taskgrove." },
    { message: "Which studies are related to geography?", response: "COMPAWNION, HTEFINDER." },
  ];

  const sendMessage = (message) => {
    if (message.trim() === '') {
      alert('Please type a message');
      return;
    }

    setChatHistory([...chatHistory, { sender: 'User', text: message }]);
    chatbotResponse(message);
    setUserMessage('');
  };

  const chatbotResponse = (userMessage) => {
    let chatbotMessage = "please send different message";

    if (userMessage.length > 5 || userMessage.toLowerCase() === "hi") {
      const result = arrayOfPossibleMessages.find(val => val.message.includes(userMessage.toLowerCase()));
      if (result) {
        chatbotMessage = result.response;
      } else {
        chatbotMessage = "please send another message";
      }
    }

    setTimeout(() => {
      setChatHistory(prevHistory => [...prevHistory, { sender: 'Chatbot', text: chatbotMessage }]);
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }, 1000);
  };

  const handleShortcutClick = (shortcut) => {
    sendMessage(shortcut);
  };

  return (
    <div>
      <div 
        id="chatContainer" 
        style={{ 
          maxHeight: '300px', 
          overflowY: 'auto', 
          border: 'none', 
          border: '1px solid #ccc',  // Add border
          padding: '10px',          // Add padding
          borderRadius: '5px',      // Optional: round corners
          marginBottom: '10px'      // Optional: space below chat
        }} 
        ref={chatContainerRef}
      >
        {chatHistory.map((chat, index) => (
          <div key={index} style={{ textAlign: chat.sender === 'User' ? 'right' : 'left', margin: '10px' }}>
            <span>{chat.sender}: </span>
            <span>{chat.text}</span>
          </div>
        ))}
      </div>
      
      <div>
        {/* Render shortcut buttons */}
        {Object.keys(shortcuts).map((key) => (
          <button key={key} onClick={() => handleShortcutClick(key)} style={{ margin: '5px' }}>
            {key}
          </button>
        ))}
      </div>

        <div className="chatbot-input">
      <input
        id="text-box"
        type="text"
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage(userMessage)}
        style={{ margin: '5px', padding: '10px',  flex: '1',
          padding: '10px',
          borderRadius: '30px',
         }}
     />
      <button id="sendBtn" onClick={() => sendMessage(userMessage)} style={{ margin: '5px', padding: '20px' }}>Send</button>
    </div>
    </div>
  );
};

export default Chatbot;
