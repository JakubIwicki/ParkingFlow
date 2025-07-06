import { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, Save, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ParkingArea } from '@/models/ParkingArea';
import { useDataContext } from '@/contexts/DataContext';
import { ParkingFee } from '@/models/ParkingFee';
import { deleteParkingArea, getParkingFeesFromArea, putParkingArea } from '@/api/api_parkingareas';
import { useAuth } from '@/contexts/AuthContext';

const EditParkingArea = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { toast } = useToast();
  const { fetchParkingArea } = useDataContext();
  const { user } = useAuth();

  const decodedId = id ? decodeURIComponent(id) : '';

  const [parkingArea, setParkingArea] = useState<ParkingArea | null>(null);
  const [associatedParkingFees, setAssociatedParkingFees] = useState<ParkingFee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigateToAreas = () => navigate('/parkingareas');

  async function handleParkingArea() {
    const result = await fetchParkingArea(decodedId);
    if (result instanceof Error) {
      toast({
        title: "Error",
        description: result.message || "Failed to fetch parking area details.",
        variant: "destructive"
      });
      navigateToAreas();
      return;
    }
    if (!result) {
      toast({
        title: "Error",
        description: "Parking area not found",
        variant: "destructive"
      });
      navigateToAreas();
      return;
    }
    setParkingArea(result);
  }

  async function handleAssociatedParkingFees() {
    const fees = await getParkingFeesFromArea(user, decodedId);
    if (fees instanceof Error) {
      toast({
        title: "Error",
        description: fees.message || "Failed to fetch associated parking fees.",
        variant: "destructive"
      });
      return;
    }
    setAssociatedParkingFees(fees);
  }

  useEffect(() => {
    setIsLoading(true);
    if (!decodedId) {
      toast({
        title: "Error",
        description: "Invalid parking area ID",
        variant: "destructive"
      });
      navigateToAreas();
      return;
    }
    handleParkingArea();
    handleAssociatedParkingFees();
    setIsLoading(false);
  }, []);

  const handleInputChange = (field: string, value: string | boolean) => {
    setParkingArea(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!parkingArea.name || !parkingArea.location || !parkingArea.weekdaysHourlyRateUsd || !parkingArea.weekendHourlyRateUsd || !parkingArea.discountPercentage) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const result = await putParkingArea(user, parkingArea);
    if (result instanceof Error) {
      toast({
        title: "Error",
        description: result.message || "Failed to update parking area",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Parking area updated successfully!",
    });

    navigateToAreas();
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this parking area?");
    if (!confirmed) {
      return;
    }

    try {
      const result = await deleteParkingArea(user, decodedId);
      if (result instanceof Error) {
        toast({
          title: "Error",
          description: result.message || "Failed to delete parking area.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success",
        description: "Parking area deleted successfully!",
      });

      navigateToAreas();
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link
          to="/parkingareas"
          className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Parking Areas
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Parking Area</h1>
        <p className="text-gray-600 mt-2">Update parking area details and view associated fees</p>
      </div>

      {isLoading || !parkingArea ? (
        <div className="min-h-screen flex items-center justify-center bg-primary-50">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Edit Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-orange-600">Parking Area Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={parkingArea.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="border-gray-300 focus:border-orange-500"
                      placeholder="Enter parking area name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={parkingArea.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="border-gray-300 focus:border-orange-500"
                      placeholder="Enter address or location"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weekdaysHourlyRateUsd">Weekdays hourly rate (USD) *</Label>
                    <Input
                      id="weekdaysHourlyRateUsd"
                      type="number"
                      step="0.01"
                      value={parkingArea.weekdaysHourlyRateUsd}
                      onChange={(e) => handleInputChange('weekdaysHourlyRateUsd', e.target.value)}
                      className="border-gray-300 focus:border-orange-500"
                      placeholder="Enter price"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weekendHourlyRateUsd">Weekend hourly rate (USD) *</Label>
                    <Input
                      id="weekendHourlyRateUsd"
                      type="number"
                      step="0.01"
                      value={parkingArea.weekendHourlyRateUsd}
                      onChange={(e) => handleInputChange('weekendHourlyRateUsd', e.target.value)}
                      className="border-gray-300 focus:border-orange-500"
                      placeholder="Enter price"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discountPercentage">Discount % *</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      value={parkingArea.discountPercentage}
                      onChange={(e) => handleInputChange('discountPercentage', e.target.value)}
                      className="border-gray-300 focus:border-orange-500"
                      placeholder="0.00"
                      max="100"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={parkingArea.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      className="border-gray-300 focus:border-orange-500"
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="isActive">Status</Label>
                    <Select
                      value={parkingArea.isActive ? 'active' : 'inactive'}
                      onValueChange={(value) => handleInputChange('isActive', value === 'active')}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-orange-500">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Update Parking Area
                  </Button>
                  <Link to="/parkingareas">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                  >
                    Delete
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Associated Fees */}
          <Card>
            <CardHeader>
              <CardTitle className="text-orange-600">Associated Parking Fees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {associatedParkingFees.map((fee) => (
                  <div key={fee.id} className="flex flex-col p-3 border border-gray-200 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-lg font-bold text-orange-600">Parking Fee Details</span>
                      <span className="text-sm text-gray-500">{fee.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Start Time:</span>
                      <span>{new Date(fee.startTime).toLocaleTimeString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">End Time:</span>
                      <span>{new Date(fee.endTime).toLocaleTimeString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">Parking Date:</span>
                      <span>{new Date(fee.parkingDate).toLocaleDateString('en-GB')}</span>
                    </div>
                    <div className="flex flex-col space-y-1 mt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold">USD:</span>
                        <span>${fee.paymentResult.amountUsd.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">EUR:</span>
                        <span>€{fee.paymentResult.amountEur.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">PLN:</span>
                        <span>{fee.paymentResult.amountPln.toFixed(2)} PLN</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )
      }
    </div >
  );
};

export default EditParkingArea;
