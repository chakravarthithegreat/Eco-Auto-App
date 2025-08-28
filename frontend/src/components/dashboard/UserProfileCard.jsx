import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { Phone, Mail } from 'lucide-react';
import { Button } from '../ui/Button';

const UserProfileCard = ({ data = {} }) => {
  const name = data.name || 'Chris Jonathan';
  const position = data.position || 'General manager';
  const experience = data.experience || '4+ years experience';
  const avatar = data.avatar || 'https://randomuser.me/api/portraits/men/32.jpg';
  
  return (
    <Card className="h-full" variant="glass">
      <div className="relative">
        <img 
          src={avatar} 
          alt={name} 
          className="w-full h-64 object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50"></div>
        <div className="absolute bottom-0 left-0 p-5 text-white">
          <div className="mb-3">
            <span className="px-3 py-1 bg-black/70 text-white text-xs font-medium rounded-full">
              {experience}
            </span>
          </div>
          <h2 className="text-xl font-semibold">{name}</h2>
          <p className="text-sm text-white/80">{position}</p>
        </div>
      </div>
      <CardContent className="p-3 bg-white flex justify-end items-center gap-2">
        <Button variant="icon" size="icon" className="bg-white border border-gray-200">
          <Phone className="w-4 h-4 text-slate-700" />
        </Button>
        <Button variant="icon" size="icon" className="bg-black text-white">
          <Mail className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default UserProfileCard;