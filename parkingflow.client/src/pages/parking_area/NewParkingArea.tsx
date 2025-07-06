
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { postParkingArea } from '@/api/api_parkingareas';
import { ParkingArea } from '@/models/ParkingArea';
import { useAuth } from '@/contexts/AuthContext';

const NewParkingArea = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    weekdaysHourlyRate: '',
    weekendsHourlyRate: '',
    discountPercentage: '',
    description: '',
    isActive: true
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.location || !formData.weekdaysHourlyRate || !formData.weekendsHourlyRate || !formData.discountPercentage) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const formattedData: ParkingArea = {
      name: formData.name,
      location: formData.location,
      weekdaysHourlyRateUsd: parseFloat(formData.weekdaysHourlyRate.toString()),
      weekendHourlyRateUsd: parseFloat(formData.weekendsHourlyRate.toString()),
      discountPercentage: parseFloat(formData.discountPercentage.toString()),
      description: formData.description,
      isActive: formData.isActive
    };

    const response = await postParkingArea(user, formattedData);

    if (response instanceof Error) {
      toast({
        title: "Error",
        description: response.message || "Failed to create parking area",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Parking area created successfully!",
    });

    navigate('/parkingareas');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link
          to="/parkingareas"
          className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Parking Areas
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">New Parking Area</h1>
        <p className="text-gray-600 mt-2">Create a new parking area in your system</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-orange-600">Parking Area Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="border-gray-300 focus:border-orange-500"
                  placeholder="Enter parking area name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="border-gray-300 focus:border-orange-500"
                  placeholder="Enter address or location"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weekdaysHourlyRate">Weekdays hourly rate (USD) *</Label>
                <Input
                  id="weekdaysHourlyRate"
                  type="number"
                  step="0.01"
                  value={formData.weekdaysHourlyRate}
                  onChange={(e) => handleInputChange('weekdaysHourlyRate', e.target.value)}
                  className="border-gray-300 focus:border-orange-500"
                  placeholder="Enter price"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weekendsHourlyRate">Weekend hourly rate (USD) *</Label>
                <Input
                  id="weekendsHourlyRate"
                  type="number"
                  step="0.01"
                  value={formData.weekendsHourlyRate}
                  onChange={(e) => handleInputChange('weekendsHourlyRate', e.target.value)}
                  className="border-gray-300 focus:border-orange-500"
                  placeholder="Enter price"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountPercentage">Discount % *</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  value={formData.discountPercentage}
                  onChange={(e) => handleInputChange('discountPercentage', e.target.value)}
                  className="border-gray-300 focus:border-orange-500"
                  placeholder="0.00"
                  max="100"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="border-gray-300 focus:border-orange-500"
                placeholder="Additional details about the parking area"
                rows={3}
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Create Parking Area
              </Button>
              <Link to="/parkingareas">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewParkingArea;
