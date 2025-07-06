
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Edit, CreditCard } from 'lucide-react';
import { useDataContext } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';

const ParkingFees = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { parkingFees, fetchParkingFees } = useDataContext();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      return;
    }
    fetchParkingFees();
  }, [user]);

  // en-GB -> dd/mm/yyyy format
  const filteredFees = parkingFees.filter(fee =>
    fee.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    new Date(fee.startTime).toDateString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    new Date(fee.endTime).toDateString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    new Date(fee.parkingDate).toLocaleDateString('en-GB').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Parking Fees</h1>
          <p className="text-gray-600 mt-2">Manage pricing and fee structures for your parking areas</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search parking fees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300 focus:border-orange-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Parking Fees Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-orange-600 flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Parking Fees ({filteredFees.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fee</TableHead>
                {/* <TableHead>Parking Area</TableHead> */}
                <TableHead>Start time</TableHead>
                <TableHead>End time</TableHead>
                <TableHead>Parking date</TableHead>
                <TableHead>Payment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFees.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell className="font-medium">{fee.id}</TableCell>
                  {/* <TableCell>{fee.parkingArea}</TableCell> */}
                  <TableCell>{new Date(fee.startTime).toDateString()}</TableCell>
                  <TableCell>{new Date(fee.endTime).toDateString()}</TableCell>
                  <TableCell>{new Date(fee.parkingDate).toLocaleDateString('en-GB')}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">USD:</span>
                        <span>${fee.paymentResult.amountUsd}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">EUR:</span>
                        <span>€{fee.paymentResult.amountEur}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">PLN:</span>
                        <span>{fee.paymentResult.amountPln}</span>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParkingFees;
