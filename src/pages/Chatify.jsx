import React, { useState, useEffect } from 'react';
import { useStateContext } from '../contexts/ContextProvider';
import axios from 'axios';
import { FaReply, FaChevronDown, FaChevronUp, FaThumbtack, FaTag, FaBullhorn, FaUser, FaTimes } from 'react-icons/fa';

const EventChatify = () => {
  const { currentColor, currentMode } = useStateContext();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [author, setAuthor] = useState('Anonymous');
  const [isLoading, setIsLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const [messageType, setMessageType] = useState('general');
  const [expandedMessages, setExpandedMessages] = useState({});
  const [categories] = useState([
    { id: 'general', label: 'General', color: '#6B7280' },
    { id: 'question', label: 'Question', color: '#3B82F6' },
    { id: 'announcement', label: 'Announcement', color: '#EF4444' },
    { id: 'task', label: 'Task/Assignment', color: '#10B981' },
    { id: 'venue', label: 'Venue', color: '#8B5CF6' },
    { id: 'schedule', label: 'Schedule', color: '#F59E0B' }
  ]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/messages');
      const processedMessages = response.data.map(msg => ({
        ...msg,
        replies: msg.replies?.map((reply, i) => ({
          ...reply,
          _id: reply._id || `${msg._id}-reply-${i}`
        }))
      }));
      setMessages(processedMessages);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const messageData = {
        content: newMessage,
        author: author,
        category: messageType
      };
     setIsLoading(true);
      await axios.post('http://localhost:8000/api/messages', messageData);
      setNewMessage('');
      fetchMessages();
    } catch (error) {
      console.error('Error posting message:', error);
    }
  };

  const handleReplySubmit = async (e, threadId) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    try {
      const replyData = {
        content: replyContent,
        author: author,
        thread_id: threadId
      };

      await axios.post('http://localhost:8000/api/messages', replyData);
      setReplyContent('');
      setReplyingTo(null);
      fetchMessages();
    } catch (error) {
      console.error('Error posting reply:', error);
    }
  };

  const startReply = (messageId) => {
    setReplyingTo(messageId);
    setExpandedMessages(prev => ({ ...prev, [messageId]: true }));
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setReplyContent('');
  };

  const toggleReplies = (messageId) => {
    setExpandedMessages(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  };

  const getCategoryColor = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.color : currentColor;
  };

  const getCategoryIcon = (categoryId) => {
    switch(categoryId) {
      case 'announcement': return <FaBullhorn className="mr-1" />;
      case 'question': return <FaTag className="mr-1" />;
      case 'task': return <FaThumbtack className="mr-1" />;
      default: return null;
    }
  };

  const renderMessage = (message, depth = 0) => {
    const hasReplies = message.replies && message.replies.length > 0;
    const categoryColor = getCategoryColor(message.category);
    const categoryIcon = getCategoryIcon(message.category);
    const isExpanded = expandedMessages[message._id];

    return (
      <div 
        key={`${message._id}-${depth}`}
        className={`p-4 rounded-lg mb-2 ${
          message.isPinned ? 'border-l-4' : ''
        } ${
          currentMode === 'Dark' 
            ? 'bg-main-dark-bg border-gray-600' 
            : 'bg-gray-50 border-gray-200'
        } border`}
        style={{ 
          marginLeft: `${depth * 20}px`,
          borderLeftColor: message.isPinned ? categoryColor : undefined
        }}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <span className="font-semibold mr-2 flex items-center">
              <FaUser className="mr-1" style={{ color: currentColor }} /> {message.author}
            </span>
            {message.category && (
              <span 
                className="text-xs px-2 py-1 rounded-full flex items-center"
                style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}
              >
                {categoryIcon}
                {categories.find(c => c.id === message.category)?.label || message.category}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500">
          Today
          </span>
        </div>
        <p className="whitespace-pre-wrap mb-2">{message.content}</p>

        <div className="flex items-center gap-4">
          <button
            onClick={() => startReply(message._id)}
            className="text-xs flex items-center gap-1"
            style={{ color: currentColor }}
          >
            <FaReply /> Reply
          </button>

          {hasReplies && (
            <button
              onClick={() => toggleReplies(message._id)}
              className="text-xs flex items-center gap-1"
              style={{ color: currentColor }}
            >
              {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
              {isExpanded ? 'Hide Replies' : 'Show Replies'} ({message.replies.length})
            </button>
          )}
        </div>

        {/* Reply form that appears when replying */}
        {replyingTo === message._id && (
          <div className="mt-3 ml-6">
            <form onSubmit={(e) => handleReplySubmit(e, message._id)} className="flex items-center gap-2">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Reply to ${message.author}...`}
                className={`flex-1 p-2 rounded-lg border text-sm ${
                  currentMode === 'Dark' 
                    ? 'bg-main-dark-bg border-gray-600 text-white' 
                    : 'bg-white border-gray-300'
                }`}
              />
              <button
                type="submit"
                style={{ backgroundColor: currentColor }}
                className="text-white px-3 py-1 rounded-lg hover:opacity-90 text-sm"
              >
                Send
              </button>
              <button
                type="button"
                onClick={cancelReply}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </form>
          </div>
        )}

        {isExpanded && hasReplies && (
          <div className="mt-3 space-y-3">
            {message.replies.map((reply, index) => (
              <div 
                key={`${reply._id || `${message._id}-reply-${index}`}`}
                className={`p-3 rounded-lg ${
                  currentMode === 'Dark' 
                    ? 'bg-main-dark-bg border-gray-700' 
                    : 'bg-white border-gray-200'
                } border ml-6`}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <span className="font-medium text-sm mr-2 flex items-center">
                      <FaUser className="mr-1" size="0.8em" style={{ color: currentColor }} /> 
                      {reply.author}
                    </span>
                    <span className="text-xs text-gray-500">
                      replied to {message.author}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(reply.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-sm">{reply.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const sortedMessages = [...messages].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  const totalReplies = messages.reduce((sum, msg) => sum + (msg.replies ? msg.replies.length : 0), 0);

  return (
    <div className={`p-6 ${currentMode === 'Dark' ? 'dark' : ''}`}>
      <div className={`rounded-lg shadow-md p-6 ${
        currentMode === 'Dark' ? 'bg-secondary-dark-bg text-gray-200' : 'bg-white'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold" style={{ color: currentColor }}>Chillr Event Forum</h1>
          <div className="text-sm">
            <span className="mr-3">{messages.length} Messages</span>
            <span>{totalReplies} Replies</span>
          </div>
        </div>

        <div className="mb-6 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Your Name:</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className={`w-full p-2 rounded border ${
                  currentMode === 'Dark' ? 'bg-main-dark-bg border-gray-600' : 'bg-white border-gray-300'
                }`}
              />
            </div>
            <div>
              <label className="block mb-1">Category:</label>
              <select
                value={messageType}
                onChange={(e) => setMessageType(e.target.value)}
                className={`w-full p-2 rounded border ${
                  currentMode === 'Dark' ? 'bg-main-dark-bg border-gray-600' : 'bg-white border-gray-300'
                }`}
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.label}</option>
                ))}
              </select>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="What's on your mind about the event?"
              className={`flex-1 p-3 rounded-lg border ${
                currentMode === 'Dark' ? 'bg-main-dark-bg border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
            />
            <button
              type="submit"
              style={{ backgroundColor: currentColor }}
              className="text-white px-4 py-2 rounded-lg hover:opacity-90"
            >
              Post
            </button>
          </form>
        </div>

        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <div 
                key={category.id}
                className="text-xs px-3 py-1 rounded-full cursor-pointer"
                style={{ backgroundColor: `${category.color}20`, color: category.color }}
                onClick={() => console.log(`Filter by ${category.label}`)}
              >
                {category.label}
              </div>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-4">Loading messages...</div>
        ) : (
          <div className="space-y-4">
            {sortedMessages.length === 0 ? (
              <div className="text-center py-4">No messages yet. Be the first to post!</div>
            ) : (
              sortedMessages.map(message => renderMessage(message))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventChatify;