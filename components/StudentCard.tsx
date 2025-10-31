

import React from 'react';
import { User } from '../types';

interface StudentCardProps {
  user: User;
  onChat: () => void;
  onReadMore: (user: User) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ user, onChat, onReadMore }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 flex flex-col">
      <div className="flex items-start">
        <div className="relative">
          <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover" />
          {user.isOnline && <span className="absolute bottom-0 right-1 block h-4 w-4 rounded-full bg-green-400 border-2 border-white"></span>}
        </div>
        <div className="ml-4 flex-1">
          <h3 className="font-bold text-lg text-gray-800">{user.name}</h3>
          <p className="text-sm text-gray-600">{user.title}</p>
          <p className="text-sm text-gray-400">{user.subtitle}</p>
        </div>
      </div>
      <button 
        onClick={onChat}
        className="mt-4 w-full bg-orange-500 text-white font-semibold py-2.5 rounded-lg hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75"
      >
        Chat with {user.name.split(' ')[0]}
      </button>
      <div className="mt-4 border-t border-gray-200 pt-4 text-sm text-gray-600 space-y-3">
        <p><strong className="font-medium text-gray-700">I come from</strong><br />{user.country} {user.flag}</p>
        <p><strong className="font-medium text-gray-700">Previous Qualification</strong><br />{user.qualification}</p>
        <div>
            <strong className="font-medium text-gray-700">About me</strong>
            <p className="mt-1 truncate">{user.about}</p>
        </div>
      </div>
      <button onClick={() => onReadMore(user)} className="mt-auto text-sm font-medium text-blue-600 hover:underline self-start">
        Read more about {user.name.split(' ')[0]}
      </button>
    </div>
  );
};

export default StudentCard;