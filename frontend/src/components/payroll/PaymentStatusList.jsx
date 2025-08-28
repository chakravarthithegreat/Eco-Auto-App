import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';

const PaymentStatusList = ({ payments = [] }) => {
  const getStatusClass = (status) => {
    switch(status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'done': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <Card className="rounded-3xl overflow-hidden">
      <CardHeader className="px-6 pt-6 pb-3">
        <CardTitle>Payment Status</CardTitle>
      </CardHeader>
      <CardContent className="px-6">
        <div className="space-y-4">
          {payments.map((payment, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <img 
                  src={payment.avatar || "https://via.placeholder.com/40"}
                  className="w-10 h-10 rounded-full object-cover"
                  alt={payment.name}
                />
                <div>
                  <div className="font-medium">{payment.name}</div>
                  <div className="text-sm text-gray-500">${payment.amount} · {payment.date}</div>
                </div>
              </div>
              <Badge className={getStatusClass(payment.status)}>
                {payment.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentStatusList;