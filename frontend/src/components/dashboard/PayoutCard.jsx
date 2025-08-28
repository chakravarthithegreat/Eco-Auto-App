import React from 'react';
import { Card, CardContent } from '../ui/Card';
import { FileText, MessageSquare } from 'lucide-react';
import { Badge } from '../ui/Badge';

const PayoutCard = ({ data = {} }) => {
  const basicSalary = data.basicSalary || 2040;
  const performance = data.performance || 300;
  const gift = data.gift || 200;
  const takeHomePay = data.takeHomePay || 2540.00;
  const percentage = data.percentage || 100;
  const payments = data.payments || [
    { 
      id: 1, 
      name: 'Syafanah san', 
      amount: '2,540.00', 
      status: 'waiting', 
      date: 'Today' 
    },
    { 
      id: 2, 
      name: 'Devon Lane', 
      amount: '2,540.00', 
      status: 'done', 
      date: 'Today' 
    },
    { 
      id: 3, 
      name: 'Marvin McKinney', 
      amount: '2,540.00', 
      status: 'done', 
      date: 'Yesterday' 
    },
    { 
      id: 4, 
      name: 'Devon Lane', 
      amount: '2,540.00', 
      status: 'done', 
      date: 'Yesterday' 
    },
    { 
      id: 5, 
      name: 'Eleanor Pena', 
      amount: '2,540.00', 
      status: 'failed', 
      date: 'Yesterday' 
    }
  ];
  
  return (
    <div className="space-y-4">
      <div className="px-1">
        <h3 className="text-lg font-medium text-slate-700">Payout monthly</h3>
        <p className="text-sm text-slate-500">Salaries and incentive</p>
      </div>
      
      <Card variant="blue" className="h-full">
        <CardContent className="p-5">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center bg-green-400/20 px-4 py-3 rounded-xl">
              <span className="text-sm">Basic salary</span>
              <span className="font-medium">₹{basicSalary}</span>
            </div>
            <div className="flex justify-between items-center bg-white/10 px-4 py-3 rounded-xl">
              <span className="text-sm">Perform</span>
              <span className="font-medium">₹{performance}</span>
            </div>
            <div className="flex justify-between items-center bg-green-400/20 px-4 py-3 rounded-xl">
              <span className="text-sm">Gift</span>
              <span className="font-medium">₹{gift}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-500/20 mb-4">
            <div className="flex justify-between items-baseline">
              <div>
                <p className="text-sm text-slate-300 mb-1">Take home pay</p>
                <p className="text-2xl font-bold">₹{takeHomePay.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-300 mb-1">Payment</p>
                <p className="text-2xl font-bold">{percentage}%</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex -space-x-1">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <FileText className="w-4 h-4 text-slate-600" />
              </div>
              <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center relative">
                <MessageSquare className="w-4 h-4 text-white" />
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">2</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-2 mt-3">
        {payments.map(payment => (
          <div key={payment.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors">
            <img 
              src={`https://randomuser.me/api/portraits/${payment.id % 2 === 0 ? 'women' : 'men'}/${payment.id + 30}.jpg`}
              alt={payment.name} 
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-slate-900 truncate">{payment.name}</div>
              <div className="text-xs text-slate-500">$ {payment.amount} <span className="text-slate-400 ml-1">{payment.date}</span></div>
            </div>
            <div>
              <Badge variant={payment.status} className="rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-current mr-1"></span>
                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PayoutCard;