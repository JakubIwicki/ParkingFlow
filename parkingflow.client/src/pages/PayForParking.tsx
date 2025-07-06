
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Calculator, LoaderCircle, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useDataContext } from '@/contexts/DataContext';
import { get_payment_calculation } from '@/api/api_payforparking';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ParkingFee } from '@/models/ParkingFee';
import { postParkingFee } from '@/api/api_parkingfees';
import { useNavigate } from 'react-router-dom';

const PayForParking = () => {
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [parkingDate, setParkingDate] = useState<Date>();
  const [calculatedCost, setCalculatedCost] = useState<{ usd: number, eur: number, pln: number } | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isParkingAreasLoading, setIsParkingAreasLoading] = useState(false);

  const { parkingAreas, fetchParkingAreas } = useDataContext();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadParkingAreas = async () => {
      setIsParkingAreasLoading(true);
      await fetchParkingAreas();
      setIsParkingAreasLoading(false);
    };
    loadParkingAreas();
  }, []);

  const calculateParkingCost = async () => {
    if (!selectedArea || !startTime || !endTime || !parkingDate) {
      setCalculatedCost(null);
      return;
    }

    if (parkingDate > new Date()) {
      toast({
        title: 'Invalid Date',
        description: 'Parking date cannot be in the past',
        variant: 'destructive'
      });
      setCalculatedCost(null);
      return;
    }

    if (startTime >= endTime) {
      toast({
        title: 'Invalid Time Range',
        description: 'Start time must be before end time',
        variant: 'destructive'
      });
      setCalculatedCost(null);
      return;
    }

    setIsCalculating(true);

    const calcs_response = await get_payment_calculation(
      user, selectedArea, startTime, endTime, parkingDate
    );

    if (calcs_response instanceof Error) {
      toast({
        title: 'Error',
        description: calcs_response.message || 'Failed to calculate parking cost',
        variant: 'destructive'
      });
      setCalculatedCost(null);
      setIsCalculating(false);
      return;
    }

    const calcs = calcs_response as {
      USD: number;
      EUR: number;
      PLN: number;
    }

    setCalculatedCost({
      usd: parseFloat(calcs.USD.toFixed(2)),
      eur: parseFloat(calcs.EUR.toFixed(2)),
      pln: parseFloat(calcs.PLN.toFixed(2))
    });

    setIsCalculating(false);
  };

  // Auto-calculate when any input changes
  useEffect(() => {
    calculateParkingCost();
  }, [selectedArea, startTime, endTime, parkingDate]);

  const handlePayment = async () => {
    if (!calculatedCost) {
      toast({
        title: 'No Cost Calculated',
        description: 'Please fill in all details to calculate the parking cost',
        variant: 'destructive'
      });
      return;
    }

    const parkingFee: ParkingFee = {
      parkingAreaId: selectedArea,
      startTime: new Date(`${parkingDate?.toISOString().split('T')[0]}T${startTime}`),
      endTime: new Date(`${parkingDate?.toISOString().split('T')[0]}T${endTime}`),
      parkingDate: new Date(`${parkingDate?.toISOString().split('T')[0]}`),
      paymentResult: {
        amountUsd: calculatedCost.usd,
        amountEur: calculatedCost.eur,
        amountPln: calculatedCost.pln
      }
    }

    console.log('Submitting parking fee:', parkingFee);

    const response = await postParkingFee(user, parkingFee);
    if (response instanceof Error) {
      toast({
        title: 'Payment Error',
        description: response.message || 'Failed to process parking payment',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Payment Successful',
      description: `You have successfully paid $${calculatedCost.usd} for parking.`,
    });

    navigate(`/parkingfees`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Pay for Parking</h1>
        <p className="text-gray-600 mt-2">Calculate parking costs for your selected area and time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Parking Selection Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-orange-600">Parking Details</CardTitle>
            <CardDescription>Select your parking area, date, and time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Parking Area Selection */}
            <div className="space-y-2">
              <Label htmlFor="parking-area">Parking Area</Label>
              {isParkingAreasLoading ? (
                <div className="text-center py-8">
                  <LoaderCircle className="mx-auto h-8 w-8 mb-4 animate
                  spin text-orange-600" />
                  <p className="text-gray-500">Loading parking areas...</p>
                </div>
              ) : (parkingAreas.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calculator className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No parking areas available. Please add some first.</p>
                </div>
              ) : (
                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a parking area" />
                  </SelectTrigger>
                  <SelectContent>
                    {parkingAreas.map((area) => (
                      <SelectItem key={area.id} value={area.id}>
                        <div className="flex flex-row items-center space-x-2">
                          <span className="font-semibold">{area.name}</span>
                          <span className="text-demibold text-gray-900">{area.location}</span>
                          <span className="text-xs text-gray-600">
                            <span className="font-medium">Weekday:</span> ${area.weekdaysHourlyRateUsd}/h
                            {",\t"}
                            <span className="font-medium">Weekend:</span> ${area.weekendHourlyRateUsd}/h
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>))}
            </div>

            {/* Date Selection */}
            <div className="space-y-2">
              <Label>Parking Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !parkingDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {parkingDate ? format(parkingDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={parkingDate}
                    onSelect={setParkingDate}
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-time">Start Time</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="border-gray-300 focus:border-orange-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-time">End Time</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="border-gray-300 focus:border-orange-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cost Display */}
        <Card>
          <CardHeader>
            <CardTitle className="text-orange-600">Parking Cost</CardTitle>
            <CardDescription>Calculated cost in multiple currencies</CardDescription>
          </CardHeader>
          <CardContent>
            {isCalculating ? (
              <div className="text-center py-8">
                <LoaderCircle className="mx-auto h-8 w-8 mb-4 animate-spin text-orange-600" />
                <p className="text-gray-500">Calculating parking cost...</p>
              </div>
            ) : calculatedCost ? (
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="text-center space-y-3">
                    <div className="text-2xl font-bold text-orange-600">
                      ${calculatedCost.usd} USD
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-lg">
                      <div className="text-center p-3 bg-white rounded border">
                        <div className="font-semibold text-gray-700">EUR</div>
                        <div className="text-orange-600">€{calculatedCost.eur}</div>
                      </div>
                      <div className="text-center p-3 bg-white rounded border">
                        <div className="font-semibold text-gray-700">PLN</div>
                        <div className="text-orange-600">{calculatedCost.pln} zł</div>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedArea && parkingDate && startTime && endTime && (
                  <div className="text-sm text-gray-600 space-y-1 mb-4">
                    <p><strong>Area:</strong> {parkingAreas.find(a => a.id === selectedArea)?.name}</p>
                    <p><strong>Date:</strong> {format(parkingDate, "PPP")}</p>
                    <p><strong>Time:</strong> {startTime} - {endTime}</p>
                  </div>
                )}

                <Button
                  onClick={handlePayment}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay ${calculatedCost.usd}
                </Button>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calculator className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Fill in all details to see the parking cost</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PayForParking;
