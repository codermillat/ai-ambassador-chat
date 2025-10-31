import React, { useState } from 'react';
import { User, View, Tab } from './types';
import { STUDENTS_DATA, AI_AMBASSADORS_DATA } from './constants';
import { SettingsIcon, UserCircleIcon, ChatBubbleLeftRightIcon, InboxIcon, HashtagIcon, AcademicCapIcon, ArrowLeftIcon, ChevronDownIcon, PaperAirplaneIcon } from './components/Icons';
import StudentCard from './components/StudentCard';
import RightSidebar from './components/RightSidebar';
import ChatView from './components/ChatView';
import SignInView from './components/SignInView';
import ContentView from './components/ContentView';

const Header: React.FC<{ onSignIn: () => void, onSignUp: () => void, onStartChat: () => void }> = ({ onSignIn, onSignUp, onStartChat }) => (
  <header className="flex flex-col sm:flex-row justify-between items-center py-4 px-8 border-b border-gray-200">
    <div className="flex-grow flex justify-center sm:justify-start mb-4 sm:mb-0">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🛒</span>
        <input 
          type="text" 
          defaultValue="# shop your future with unibro" 
          className="bg-white border-2 border-orange-400 rounded-lg py-2 pl-10 pr-4 text-center text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>
      <button onClick={onStartChat} className="ml-4 bg-gray-800 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-gray-700 transition-colors">
        Start chat with ambassador
      </button>
    </div>
    <div className="flex items-center space-x-3">
      <button onClick={onSignUp} className="bg-blue-600 text-white font-semibold py-1.5 px-4 rounded-md hover:bg-blue-500 transition-colors">Sign up</button>
      <button onClick={onSignIn} className="bg-gray-200 text-gray-700 font-semibold py-1.5 px-4 rounded-md hover:bg-gray-300 transition-colors">Sign in</button>
      <button className="text-gray-500 hover:text-gray-800">
        <SettingsIcon className="w-6 h-6" />
      </button>
    </div>
  </header>
);

const NavTabs: React.FC<{ activeTab: Tab, setActiveTab: (tab: Tab) => void }> = ({ activeTab, setActiveTab }) => {
  const tabs: { id: Tab, label: string, icon: React.ReactNode }[] = [
    { id: 'student', label: 'Student', icon: <UserCircleIcon className="w-5 h-5 mr-2" /> },
    { id: 'staff', label: 'Staff', icon: <UserCircleIcon className="w-5 h-5 mr-2" /> },
    { id: 'ai_ambassador', label: 'AI ambassador', icon: <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" /> },
    { id: 'inbox', label: 'Inbox', icon: <InboxIcon className="w-5 h-5 mr-2" /> },
    { id: 'content', label: '#content', icon: <HashtagIcon className="w-5 h-5 mr-2" /> },
    { id: 'scholarships', label: 'Scholarships', icon: <AcademicCapIcon className="w-5 h-5 mr-2" /> }
  ];

  return (
    <nav className="flex items-center space-x-2 px-8 mt-4 overflow-x-auto pb-2">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center whitespace-nowrap py-2 px-4 rounded-lg font-medium transition-colors text-sm sm:text-base ${
            activeTab === tab.id
              ? 'bg-gray-200 text-gray-800'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          {tab.icon} {tab.label}
        </button>
      ))}
    </nav>
  );
};

const Filters: React.FC = () => (
  <div className="px-8 mt-4 flex flex-wrap items-center gap-4">
    <div className="relative">
      <select className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300">
        <option>Country</option>
        <option>Bangladesh</option>
      </select>
      <ChevronDownIcon className="w-5 h-5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
    <div className="relative">
      <select className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300">
        <option>Language</option>
        <option>English</option>
      </select>
      <ChevronDownIcon className="w-5 h-5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
    <div className="relative">
      <select className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-4 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300">
        <option>Program</option>
        <option>None</option>
      </select>
      <ChevronDownIcon className="w-5 h-5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
    <div className="flex items-center space-x-4 ml-auto">
        <div className="flex items-center">
            <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">online</span>
        </div>
        <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Offline</span>
        </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('main');
  const [activeTab, setActiveTab] = useState<Tab>('student');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRedirectModal, setShowRedirectModal] = useState(false);
  const [showReadMoreModal, setShowReadMoreModal] = useState(false);
  const [selectedUserForReadMore, setSelectedUserForReadMore] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleStartChat = (user: User) => {
    setSelectedUser(user);
    setCurrentView('chat');
  };

  const handleBackToMain = () => {
    setCurrentView('main');
    setSelectedUser(null);
  };
  
  const handleSignIn = () => {
    setCurrentView('signin');
  };

  const handleRedirectToAI = () => {
    setShowRedirectModal(false);
    setActiveTab('ai_ambassador');
    if (AI_AMBASSADORS_DATA.length > 0) {
      handleStartChat(AI_AMBASSADORS_DATA[0]);
    }
  };

  const handleStartChatWithAmbassadorClick = () => {
    setShowRedirectModal(true);
  };
  
  const handlePaginationClick = (page: number) => {
    if (page === 1) {
        setCurrentPage(1);
    } else {
        alert('More content is coming in the future. This is a prototype.');
    }
  };

  const handleReadMore = (user: User) => {
    setSelectedUserForReadMore(user);
    setShowReadMoreModal(true);
  };

  const handleCloseReadMore = () => {
    setSelectedUserForReadMore(null);
    setShowReadMoreModal(false);
  };

  const handleChatWithAiVersion = (user: User) => {
    handleCloseReadMore();
    const aiVersion = AI_AMBASSADORS_DATA.find(ai => ai.name === `AI [${user.name}]`);
    if (aiVersion) {
        setActiveTab('ai_ambassador');
        handleStartChat(aiVersion);
    } else {
        alert(`Could not find an AI version for ${user.name}.`);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'student':
        return STUDENTS_DATA.map(student => (
          <StudentCard key={student.id} user={student} onChat={() => setShowRedirectModal(true)} onReadMore={handleReadMore} />
        ));
      case 'ai_ambassador':
        return AI_AMBASSADORS_DATA.map(ambassador => (
          <StudentCard key={ambassador.id} user={ambassador} onChat={() => handleStartChat(ambassador)} onReadMore={handleReadMore} />
        ));
      case 'content':
        return <ContentView />;
      case 'staff':
      case 'inbox':
      case 'scholarships':
        return (
          <div className="col-span-1 md:col-span-2 flex items-center justify-center bg-gray-100 rounded-lg p-12 h-64">
            <p className="text-gray-500 text-lg">This section is under maintenance.</p>
          </div>
        );
      default:
        return null;
    }
  };

  if (currentView === 'signin') {
    return <SignInView onBack={handleBackToMain} />;
  }

  if (currentView === 'chat' && selectedUser) {
    return <ChatView user={selectedUser} onBack={handleBackToMain} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onSignIn={handleSignIn} onSignUp={handleSignIn} onStartChat={handleStartChatWithAmbassadorClick} />
      <div className="flex flex-1">
        <main className="flex-1">
          <NavTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="p-8">
            <Filters />
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              {renderContent()}
            </div>
            { (activeTab === 'student' || activeTab === 'ai_ambassador') &&
              <div className="mt-8 flex justify-center items-center space-x-2">
                {[1, 2, 3, 4, 5].map(page => (
                  <button
                    key={page}
                    onClick={() => handlePaginationClick(page)}
                    className={`w-8 h-8 rounded border transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button 
                  onClick={() => handlePaginationClick(currentPage + 1)}
                  className="w-8 h-8 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                >
                  {'>'}
                </button>
              </div>
            }
          </div>
        </main>
        <aside className="hidden lg:block w-1/3 xl:w-1/4 p-4 border-l border-gray-200">
            <RightSidebar />
        </aside>
      </div>

      {showRedirectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={() => setShowRedirectModal(false)}>
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg m-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Ambassador Unavailable</h3>
            <p className="text-gray-600 mb-2">Live chat with human ambassadors is not yet available in this prototype.</p>
            <p className="text-gray-600 mb-6">We recommend connecting with our AI Ambassador for instant assistance. Would you like to start a chat now?</p>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => setShowRedirectModal(false)}
                className="bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Maybe Later
              </button>
              <button 
                onClick={handleRedirectToAI}
                className="bg-orange-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                Chat with AI
              </button>
            </div>
          </div>
        </div>
      )}

      {showReadMoreModal && selectedUserForReadMore && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={handleCloseReadMore}>
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-2xl m-4 flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start mb-6">
              <img src={selectedUserForReadMore.avatar} alt={selectedUserForReadMore.name} className="w-24 h-24 rounded-full object-cover border-4 border-gray-200" />
              <div className="ml-6">
                <h3 className="text-3xl font-bold text-gray-800">{selectedUserForReadMore.name}</h3>
                <p className="text-md text-gray-600">{selectedUserForReadMore.title}</p>
              </div>
            </div>
            <div className="flex-grow overflow-y-auto max-h-[40vh] pr-4">
              <h4 className="font-bold text-lg text-gray-800 mb-2">About Me</h4>
              <p className="text-gray-700 whitespace-pre-wrap">{selectedUserForReadMore.about}</p>
            </div>
            <div className="mt-8 flex justify-end space-x-4 border-t pt-6">
              <button 
                onClick={handleCloseReadMore}
                className="bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Close
              </button>
              {!selectedUserForReadMore.isAi && (
                <button 
                  onClick={() => handleChatWithAiVersion(selectedUserForReadMore)}
                  className="bg-orange-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  Chat with AI version of {selectedUserForReadMore.name}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;