'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react';
import { IoSend } from "react-icons/io5";
import io from 'socket.io-client';
import Title from '../images/Title-1.png'

const socket = io('https://api-1-production-d1e1.up.railway.app/', { transports: ['websocket', 'polling', 'flashsocket'] });

function ChatApp() {
  const [userName, setUserName] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleInitialName = () => {
      const name = sessionStorage.getItem('userName') || '';
      setUserName(name);
    };

    handleInitialName();

    socket.on('chat message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socket.on('chat history', (history) => {
      setMessages(history);
    });

    socket.on('disconnect', () => {
      // Handle disconnect event
    });

    socket.on('reconnect', () => {
      // Handle reconnect event
    });

    return () => {
      socket.off('chat message');
      socket.off('chat history');
      socket.off('disconnect');
      socket.off('reconnect');
    };
  }, []);

  const handleNameChange = (event) => {
    setUserName(event.target.value);
    sessionStorage.setItem('userName', event.target.value);
  };

  const handleInputChange = (event) => {
    const inputText = event.target.value;

    // Regular expression to identify URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    // Replace URLs with anchor tags
    const textWithLinks = inputText.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });

    setMessageInput(textWithLinks);
  };
  
  const renderMessage = (msg) => (
   
    <div key={msg.timestamp} className="text-white mt-3" >
      <span>{msg.user} </span>
      <div dangerouslySetInnerHTML={{ __html: msg.text }} />
    </div>
  );

  const sendMessage = () => {
    if (messageInput.trim() !== '') {
      socket.emit('chat message', { user: userName, text: messageInput });
      setMessageInput('');
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.trim().toLowerCase());
  };

  const filteredMessages = messages.filter((msg) =>
    msg.text.toLowerCase().includes(searchTerm)
  );

  const handleCapitalize = () => {
    setMessageInput((prevMessageInput) =>
      prevMessageInput
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    );
  };

  const handleToLowercase = () => {
    setMessageInput((prevMessageInput) => prevMessageInput.toLowerCase());
  };

  const handleToUppercase = () => {
    setMessageInput((prevMessageInput) => prevMessageInput.toUpperCase());
  };

  const handleClear = () => {
    setMessageInput('');
  };

  const handleCopy = () => {
    const textarea = document.getElementById('message-input');
    textarea.select();
    document.execCommand('copy');
  };

  const handleRemoveExtraSpaces = () => {
    setMessageInput((prevMessageInput) =>
      prevMessageInput.replace(/\s+/g, ' ').trim()
    );
  };

  const handleConvertToSpeech = () => {
    if ('speechSynthesis' in window) {
      const synthesis = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(messageInput);
      synthesis.speak(utterance);
    } else {
      alert('Speech synthesis is not supported in your browser.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-2 bg-gray-900 text-white">
        <div className="flex items-center justify-center">
       
        <Image
        src={Title}
        width={200}
        height={10}
        alt={Title}
        className='rounded-full mt-[-1rem]'
      />
     </div>
      <input
        id="name-input"
        className="w-3/4 p-2 mt-[-2.4rem] bg-gray-700 rounded outline-none"
        placeholder="Enter your name (Optional)"
        autoComplete="off"
        value={userName}
        onChange={handleNameChange}
      />

      <input
        id="search-input"
        className="w-3/4 p-2 mt-2 bg-gray-700 rounded outline-none"
        placeholder="Search messages"
        autoComplete="off"
        onChange={handleSearch}
      />

      <div id="messages" className="h-48 overflow-y-auto">
        {filteredMessages.map(renderMessage)}
      </div>

      <div className="flex items-center">
        <textarea
          id="message-input"
          placeholder="Type anything"
          className="w-3/4 p-2 mr-2 mt-2 bg-gray-700 rounded outline-none"
          autoComplete="off"
          value={messageInput}
          onChange={handleInputChange}
          rows="1"
        ></textarea>
        <button
          id="send"
          className="px-5 py-5 mt-1 bg-[#ff0000] text-white rounded-full text-2xl"
          onClick={sendMessage}
        >
          <IoSend />
         
        </button>
      </div>
      <div className="mt-4 flex flex-col md:flex-row items-center mb-2 ">
        <button
          className="mr-2 px-3 py-2  bg-indigo-800 text-white rounded"
          onClick={handleCapitalize}
        >
          Capitalize
        </button>
        <button
          className="mr-2 px-3 py-2  bg-indigo-800 text-white rounded"
          onClick={handleToLowercase}
        >
          Lowercase
        </button>
        <button
          className="mr-2 px-3 py-2 bg-indigo-800 text-white rounded"
          onClick={handleToUppercase}
        >
          Uppercase
        </button>

        <button
          className="mr-2 px-3 py-2  bg-indigo-800 text-white rounded"
          onClick={handleRemoveExtraSpaces}
        >
          Remove Extra Spaces
        </button>
        
        <button
          className="mr-2 px-3 py-2  bg-indigo-800 text-white rounded"
          onClick={handleClear}
        >
          Clear
        </button>
        <button
          className="mr-2 px-3 py-2  bg-indigo-800 text-white rounded"
          onClick={handleCopy}
        >
          Copy
        </button>
        
        <button
          className=" px-3 py-2 bg-indigo-800 text-white rounded"
          onClick={handleConvertToSpeech}
        >
          Convert to Speech
        </button>
      </div>
    </div>
  );
}

export default ChatApp;
