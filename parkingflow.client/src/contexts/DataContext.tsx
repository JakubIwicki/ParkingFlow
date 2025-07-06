import React, { createContext, useState, ReactNode, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";
import { ParkingArea } from "@/models/ParkingArea";
import { ParkingFee } from "@/models/ParkingFee";
import { DashboardData } from "@/models/DashboardData";
import { getParkingArea, getParkingAreas } from "@/api/api_parkingareas";
import { getParkingFee, getParkingFees } from "@/api/api_parkingfees";
import { getDashboardData } from "@/api/api_dashboard";

interface DataContextType {
    parkingAreas: ParkingArea[];
    setParkingAreas: React.Dispatch<React.SetStateAction<ParkingArea[]>>;

    parkingFees: ParkingFee[];
    setParkingFees: React.Dispatch<React.SetStateAction<ParkingFee[]>>;

    dashboardData: DashboardData | null;

    fetchParkingAreas: () => Promise<void>;
    fetchParkingFees: () => Promise<void>;

    fetchParkingArea: (id: string) => Promise<ParkingArea | null>;
    fetchParkingFee: (id: string) => Promise<ParkingFee | null>;

    fetchDashboardData: () => Promise<void>;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataContextProvider = ({ children }: { children: ReactNode }) => {
    const [parkingAreas, setParkingAreas] = useState<ParkingArea[]>([]);
    const [parkingFees, setParkingFees] = useState<ParkingFee[]>([]);
    const [dashboardData, setDashboardData] = useState<DashboardData>(null);

    const { user } = useAuth();
    const { toast } = useToast();

    useEffect(() => {
        if (!user) {
            reset();
            return;
        }

        fetchDashboardData();
    }, [user]);

    const reset = () => {
        setParkingAreas([]);
        setParkingFees([]);
        setDashboardData(null);
    };

    const fetchParkingAreas = async () => {
        const result = await getParkingAreas(user);
        if (result instanceof Error) {
            toast({
                title: 'Error',
                description: result.message || 'Failed to fetch clients.',
                variant: 'destructive',
            });
            setParkingAreas([]);
            return;
        }
        setParkingAreas(result as ParkingArea[]);
    };

    const fetchParkingFees = async () => {
        const result = await getParkingFees(user);
        if (result instanceof Error) {
            toast({
                title: 'Error',
                description: result.message || 'Failed to fetch orders.',
                variant: 'destructive',
            });
            setParkingFees([]);
            return;
        }
        setParkingFees(result as ParkingFee[]);
    };

    const fetchParkingArea = async (id: string) => {
        const result = await getParkingArea(user, id);
        if (result instanceof Error) {
            toast({
                title: 'Error',
                description: result.message || 'Failed to fetch services.',
                variant: 'destructive',
            });
            return null;
        }
        return result as ParkingArea;
    };

    const fetchParkingFee = async (id: string) => {
        const result = await getParkingFee(user, id);
        if (result instanceof Error) {
            toast({
                title: 'Error',
                description: result.message || 'Failed to fetch products.',
                variant: 'destructive',
            });
            return null;
        }
        return result as ParkingFee;
    };

    const fetchDashboardData = async () => {
        const response = await getDashboardData(user);
        if (response instanceof Error) {
            toast({
                title: 'Error',
                description: response.message || 'Failed to fetch dashboard data.',
                variant: 'destructive',
            });
            setDashboardData(null);
            return;
        }
        setDashboardData(response as DashboardData);
    };

    return (
        <DataContext.Provider value={{
            parkingAreas,
            setParkingAreas,
            parkingFees,
            setParkingFees,
            dashboardData,
            fetchParkingAreas,
            fetchParkingFees,
            fetchParkingArea,
            fetchParkingFee,
            fetchDashboardData,
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useDataContext = () => {
    const context = React.useContext(DataContext);
    if (!context) {
        throw new Error("useDataContext must be used within a DataContextProvider");
    }
    return context;
}