import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Phone, Mail, Users } from 'lucide-react';
import { useAuthStore } from '../../state/authStore';

const EmployeeProfileCard = ({ employee }) => {
  const { user } = useAuthStore();
  const displayEmployee = employee || user;
  
  return (
    <Card className="rounded-3xl overflow-hidden">
      <div className="relative bg-gradient-to-r from-blue-500/20 to-blue-600/20 p-6">
        <div className="absolute top-4 right-4">
          <Badge className="bg-black/70 text-white text-xs px-3 py-1 rounded-full">
            {displayEmployee?.experience || "4+"} years experience
          </Badge>
        </div>
        
        <div className="mt-8 bg-white rounded-3xl overflow-hidden">
          <img 
            src={displayEmployee?.image || "https://randomuser.me/api/portraits/men/32.jpg"}
            alt={displayEmployee?.name}
            className="w-full aspect-square object-cover"
          />
        </div>
        
        <div className="bg-white/90 backdrop-blur-sm p-4 -mx-6 mt-6 -mb-6 border-t border-gray-100">
          <h3 className="text-xl font-semibold">{displayEmployee?.name}</h3>
          <p className="text-gray-500 text-sm">{displayEmployee?.subRole || "General manager"}</p>
          
          <div className="flex mt-3 gap-2">
            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <Phone className="w-5 h-5 text-gray-700" />
            </button>
            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <Mail className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6 pt-8">
        <h4 className="text-gray-500 mb-2">Average work time</h4>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">46 hours</div>
          <div className="text-green-500 font-medium">+0.5% ↑</div>
        </div>
        
        <div className="mt-4">
          <div className="relative h-16">
            <div className="absolute inset-0">
              <svg className="w-full h-full" viewBox="0 0 300 80">
                <path
                  d="M0,40 C60,10 120,70 180,40 C240,10 300,40 300,40"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="2"
                />
                <path
                  d="M0,40 C60,10 120,70 180,40 C240,10 300,40 300,40"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />
                <circle cx="220" cy="25" r="6" fill="white" stroke="#3b82f6" strokeWidth="2" />
              </svg>
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded">
              8 Hours
            </div>
          </div>
          
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <div>0 H</div>
            <div>4 H</div>
            <div>8 H</div>
            <div>10 H</div>
          </div>
        </div>
      </div>
      <div className="p-6 pt-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Team Size</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">3</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EmployeeProfileCard;