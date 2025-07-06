import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Edit, MapPin } from 'lucide-react';
import { useDataContext } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { ParkingArea } from '@/models/ParkingArea';

const ParkingAreas = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const { user } = useAuth();
  const { parkingAreas, fetchParkingAreas } = useDataContext();

  useEffect(() => {
    if (!user) {
      return;
    }
    fetchParkingAreas()
  }, [user])

  const areaIsActive = (area: ParkingArea) => {
    return area.isActive ? "Active" : "Not active";
  };

  const filteredAreas = parkingAreas.filter(area =>
    area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    area.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //area.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    areaIsActive(area).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Parking Areas</h1>
          <p className="text-gray-600 mt-2">Manage your parking areas and their details</p>
        </div>
        <Link to="/parkingareas/new">
          <Button className="bg-orange-600 hover:bg-orange-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add New Area
          </Button>
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search parking areas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300 focus:border-orange-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Parking Areas Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-orange-600 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Parking Areas ({filteredAreas.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Weekdays rate (h)</TableHead>
                <TableHead>Weekends rate (h)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAreas.map((area) => (
                <TableRow key={area.id}>
                  <TableCell className="font-medium">{area.name}</TableCell>
                  <TableCell>{area.location}</TableCell>
                  <TableCell>${area.weekdaysHourlyRateUsd}</TableCell>
                  <TableCell>${area.weekendHourlyRateUsd}</TableCell>
                  <TableCell>
                    {area.isActive ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-500">
                        {areaIsActive(area)}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-500">
                        {areaIsActive(area)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Link to={`/parkingareas/${encodeURIComponent(area.id)}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
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

export default ParkingAreas;
