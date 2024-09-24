import React, { useState, useRef } from 'react';
import './Chatbot.css';

// data of thesis to configure if new thesis are added.

// applications
const thesisDataAPP = {
  Websites: [
    "Web-Based Equipment Maintenance Monitoring System for DHVSU Facilities",
    "PALENGKIHAN",
    "CODEQUEST",
    "Monitoring System for DHVSU Facilities"
  ],
  WebApplications: [
    "Taskgrove",
    "Online Financial Assistance",
    "HTEFinder",
    "COMPAWNION"
  ]
};

// methods
const thesisDataMETHOD = {
  Iterative: [
    "MSWD Online Financial Assistance",
    "ANTABE",
    "HTEFINDER",
    "COMPAWNION"
  ],
  Agile: [
    "Taskgrove",
    "Equipment maintenance monitoring",
    "CODEQUEST",
    "PALENGKIHAN"
  ]
};


// APPROACH
const thesisDataAPPROACH = {
  Quantitative: [
    "CODEQUEST",
    "Taskgrove",
    "HTEFinder"
  ],
  MixedMethod: [
    "COMPAWNION",
    "Web-Based Equipment Maintenance Monitoring System for DHVSU Facilities"
  ]
};

// RELATED OR ABOUT
const thesisDataRELATED = {
  Animals: [
    "COMPAWNION"
  ],
  Disability: [
    "ANTABE"
  ],
  Nature: [
    "Taskgrove"
  ],
  Geography: [
    "COMPAWNION",
    "HTEFINDER"
  ]
};


// KEYWORDS for the chatbot to respond
const keywords = {
  APP: {
    website: "website",
    webApplication: "web application"
  },
  METHOD: {
    iterative: "iterative",
    agile: "agile"
  },
  APPROACH: {
    quantitative: "quantitative",
    mixedMethod: "mixed method"
  },
  RELATED: {
    animals: "animals",
    disability: "disability",
    nature: "nature",
    geography: "geography"
  }
};

// chatbot configuration
const Chatbot = () => {
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);

  const sendMessage = (message) => {
    if (message.trim() === '') {
      alert('Please type a message');
      return;
    }

    setChatHistory([...chatHistory, { sender: 'You', text: message }]);
    chatbotResponse(message);
    setUserMessage('');
  };

  // add a typing effect
  const typingEffect = (message) => {
    return new Promise((resolve) => {
      let currentIndex = 0;
      const typingInterval = setInterval(() => {
        if (currentIndex < message.length) {
          setChatHistory(prevHistory => [
            ...prevHistory.slice(0, -1),
            { sender: 'Chatbot', text: message.slice(0, currentIndex + 1) + (currentIndex === message.length - 1 ? '' : ' _') } // Adds cursor effect
          ]);
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          resolve();
        }
      }, 100); // Adjust typing speed here
    });
  };

  const chatbotResponse = (userMessage) => {
    let chatbotMessage = "I'm not sure about that. Please try asking in a different way or use one of the shortcuts below.";
    const lowerCaseMessage = userMessage.toLowerCase();

    // check if there is negation or the word not
    const isNegation = lowerCaseMessage.includes('not');
    // clear the not in the response of the chatbot
    const queryMessage = lowerCaseMessage.replace('not', '').trim();

    setLoading(true); // Start loading

    // Determine the category based on the user's message
    if (queryMessage.includes(keywords.APP.website)) {
        chatbotMessage = isNegation
            ? "Here are the Web Applications: " + thesisDataAPP.WebApplications.join(', ')
            : "Here are the Websites: " + thesisDataAPP.Websites.join(', ');
    } else if (queryMessage.includes(keywords.APP.webApplication)) {
        chatbotMessage = isNegation
            ? "Here are the Websites: " + thesisDataAPP.Websites.join(', ')
            : "Here are the Web Applications: " + thesisDataAPP.WebApplications.join(', ');
    } else if (queryMessage.includes(keywords.APPROACH.quantitative)) {
        chatbotMessage = isNegation
            ? "Here are the Mixed Methods: " + thesisDataAPPROACH.MixedMethod.join(', ')
            : "Here are the Quantitative methods: " + thesisDataAPPROACH.Quantitative.join(', ');
    } else if (queryMessage.includes(keywords.APPROACH.mixedMethod)) {
        chatbotMessage = isNegation
            ? "Here are the Quantitative methods: " + thesisDataAPPROACH.Quantitative.join(', ')
            : "Here are the Mixed Methods: " + thesisDataAPPROACH.MixedMethod.join(', ');
    } else if (queryMessage.includes(keywords.METHOD.iterative)) {
        chatbotMessage = isNegation
            ? "Here are the Agile methods: " + thesisDataMETHOD.Agile.join(', ')
            : "Here are the Iterative methods: " + thesisDataMETHOD.Iterative.join(', ');
    } else if (queryMessage.includes(keywords.METHOD.agile)) {
        chatbotMessage = isNegation
            ? "Here are the Iterative methods: " + thesisDataMETHOD.Iterative.join(', ')
            : "Here are the Agile methods: " + thesisDataMETHOD.Agile.join(', ');
    } else if (queryMessage.includes(keywords.RELATED.animals)) {
        chatbotMessage = isNegation
            ? "Here are the Disability, Nature, and Geography topics: " + [...thesisDataRELATED.Disability, ...thesisDataRELATED.Nature, ...thesisDataRELATED.Geography].join(', ')
            : "Here is the Animals topic: " + thesisDataRELATED.Animals.join(', ');
    } else if (queryMessage.includes(keywords.RELATED.disability)) {
        chatbotMessage = isNegation
            ? "Here are the Animals, Nature, and Geography topics: " + [...thesisDataRELATED.Animals, ...thesisDataRELATED.Nature, ...thesisDataRELATED.Geography].join(', ')
            : "Here is the Disability topic: " + thesisDataRELATED.Disability.join(', ');
    } else if (queryMessage.includes(keywords.RELATED.nature)) {
        chatbotMessage = isNegation
            ? "Here are the Animals, Disability, and Geography topics: " + [...thesisDataRELATED.Animals, ...thesisDataRELATED.Disability, ...thesisDataRELATED.Geography].join(', ')
            : "Here is the Nature topic: " + thesisDataRELATED.Nature.join(', ');
    } else if (queryMessage.includes(keywords.RELATED.geography)) {
        chatbotMessage = isNegation
            ? "Here are the Animals, Disability, and Nature topics: " + [...thesisDataRELATED.Animals, ...thesisDataRELATED.Disability, ...thesisDataRELATED.Nature].join(', ')
            : "Here is the Geography topic: " + thesisDataRELATED.Geography.join(', ');
    }
    

    // add a delay to make the chatbot look like a bot
    setTimeout(() => {
        setLoading(false); // End loading
        setChatHistory(prevHistory => [...prevHistory, { sender: 'Chatbot', text: chatbotMessage }]);
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }, 2000);
  };

  // clickable key words
  const handleKeywordClick = (keyword) => {
    setUserMessage(keyword);
    sendMessage(keyword);
  };

  // structure
  return (
    <div>
      <div 
        id="chatContainer" 
        style={{ 
          maxHeight: '300px', 
          overflowY: 'auto', 
          border: '1px solid #ccc',
          padding: '10px', 
          borderRadius: '5px', 
          marginBottom: '10px' 
        }} 
        ref={chatContainerRef}
      >
        {chatHistory.map((chat, index) => (
          <div key={index} style={{ textAlign: chat.sender === 'You' ? 'right' : 'left', margin: '10px' }}>
            <span>{chat.sender}: </span>
            <span>{chat.text}</span>
          </div>
        ))}
        {loading && (
          <div style={{ textAlign: 'left', margin: '10px' }}>
            <span className="dot">.</span>
            <span className="dot">.</span>
            <span className="dot">.</span>
          </div>
        )}
      </div>
      
      <div>
        {/* Render clickable keywords */}
        <div>
          <strong>Keywords:</strong>
          {Object.values(keywords).flatMap(category => 
            Object.values(category).map(keyword => (
              <button 
                key={keyword} 
                onClick={() => handleKeywordClick(keyword)} 
                style={{ margin: '5px' }}
              >
                {keyword}
              </button>
            ))
          )}
        </div>
      </div>

      <div className="chatbot-input">
        <input
          id="text-box"
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage(userMessage)}
          style={{ margin: '5px', padding: '10px', flex: '1', borderRadius: '30px' }}
        />
        <button id="sendBtn" onClick={() => sendMessage(userMessage)} style={{ margin: '5px', padding: '20px' }}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
