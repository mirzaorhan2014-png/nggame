import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import './Social.css';

const Social = () => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock friends data
  const mockFriends = [
    { _id: '1', username: 'ProGamer123', online: true, rank: { tier: 'Diamond' } },
    { _id: '2', username: 'NeonKnight', online: true, rank: { tier: 'Platinum' } },
    { _id: '3', username: 'ShadowPlayer', online: false, rank: { tier: 'Gold' } }
  ];

  useEffect(() => {
    if (!user?.isGuest) {
      fetchFriends();
    }
  }, [user]);

  useEffect(() => {
    if (socket && selectedFriend) {
      socket.on('message:receive', (message) => {
        if (message.senderId === selectedFriend._id) {
          setMessages(prev => [...prev, message]);
        }
      });

      return () => {
        socket.off('message:receive');
      };
    }
  }, [socket, selectedFriend]);

  const fetchFriends = async () => {
    try {
      // const response = await axios.get('/api/social/friends');
      // setFriends(response.data);
      setFriends(mockFriends); // Use mock data for now
    } catch (error) {
      console.error('Failed to fetch friends:', error);
    }
  };

  const fetchMessages = async (friendId) => {
    try {
      const response = await axios.get(`/api/social/messages/${friendId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      setMessages([]); // Use empty array if error
    }
  };

  const handleSelectFriend = (friend) => {
    setSelectedFriend(friend);
    fetchMessages(friend._id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedFriend) return;

    try {
      await axios.post('/api/social/messages', {
        receiverId: selectedFriend._id,
        content: messageText
      });

      if (socket) {
        socket.emit('message:send', {
          receiverId: selectedFriend._id,
          message: {
            senderId: user._id,
            receiverId: selectedFriend._id,
            content: messageText,
            createdAt: new Date()
          }
        });
      }

      setMessages(prev => [...prev, {
        senderId: user._id,
        content: messageText,
        createdAt: new Date()
      }]);
      setMessageText('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleAddFriend = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      // Search for user and send friend request
      alert(`Friend request sent to ${searchQuery}`);
      setSearchQuery('');
    } catch (error) {
      alert('User not found or request failed');
    }
  };

  if (user?.isGuest) {
    return (
      <div className="social-page">
        <nav className="navbar glass">
          <div className="navbar-brand">
            <Link to="/dashboard">
              <h1 className="neon-text">NGGames</h1>
            </Link>
          </div>
        </nav>

        <div className="container">
          <div className="guest-block glass-intense">
            <h1>🤝 Social Features</h1>
            <p>You must have an account to use social features.</p>
            <p>Register now to add friends and chat!</p>
            <Link to="/auth" className="btn btn-primary">Create Account</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="social-page">
      <nav className="navbar glass">
        <div className="navbar-brand">
          <Link to="/dashboard">
            <h1 className="neon-text">NGGames</h1>
          </Link>
        </div>
      </nav>

      <div className="container">
        <div className="social-header">
          <h1>🤝 Social</h1>
          <p>Connect with friends and chat</p>
        </div>

        <div className="social-tabs glass">
          <button 
            className={activeTab === 'friends' ? 'active' : ''}
            onClick={() => setActiveTab('friends')}
          >
            Friends ({friends.length})
          </button>
          <button 
            className={activeTab === 'messages' ? 'active' : ''}
            onClick={() => setActiveTab('messages')}
          >
            Messages
          </button>
          <button 
            className={activeTab === 'add' ? 'active' : ''}
            onClick={() => setActiveTab('add')}
          >
            Add Friend
          </button>
        </div>

        {activeTab === 'friends' && (
          <div className="friends-list glass">
            {friends.length > 0 ? (
              friends.map((friend) => (
                <div key={friend._id} className="friend-item">
                  <div className="friend-avatar">
                    {friend.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="friend-info">
                    <h4>{friend.username}</h4>
                    <p className={`rank-${friend.rank.tier.toLowerCase()}`}>
                      {friend.rank.tier}
                    </p>
                  </div>
                  <div className={`online-status ${friend.online ? 'online' : 'offline'}`}>
                    {friend.online ? '🟢 Online' : '⚪ Offline'}
                  </div>
                  <div className="friend-actions">
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setActiveTab('messages');
                        handleSelectFriend(friend);
                      }}
                    >
                      Message
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-friends">
                <p>You don't have any friends yet</p>
                <button className="btn btn-primary" onClick={() => setActiveTab('add')}>
                  Add Friends
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="messages-container glass">
            {selectedFriend ? (
              <div className="chat-view">
                <div className="chat-header">
                  <h3>{selectedFriend.username}</h3>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => setSelectedFriend(null)}
                  >
                    Close
                  </button>
                </div>
                <div className="messages-list">
                  {messages.map((msg, index) => (
                    <div 
                      key={index}
                      className={`message ${msg.senderId === user._id ? 'sent' : 'received'}`}
                    >
                      <p>{msg.content}</p>
                      <span className="timestamp">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
                <form className="message-input" onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                  />
                  <button type="submit" className="btn btn-primary">
                    Send
                  </button>
                </form>
              </div>
            ) : (
              <div className="no-chat-selected">
                <p>Select a friend to start chatting</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'add' && (
          <div className="add-friend-container glass">
            <h2>Add Friend</h2>
            <p>Search for players by username</p>
            <div className="search-form">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter username..."
              />
              <button className="btn btn-primary" onClick={handleAddFriend}>
                Search & Add
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Social;
