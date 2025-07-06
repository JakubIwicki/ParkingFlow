import { createContext, useContext, useState, ReactNode } from 'react';
import { LoaderCircle } from 'lucide-react'; // Or wherever you're importing it from

type LoadingContextType = {
    isLoading: boolean;
    setLoading: (value: boolean) => void;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(false);

    const setLoading = (value: boolean) => setIsLoading(value);

    return (
        <LoadingContext.Provider value={{ isLoading, setLoading }}>
            <div className="relative">
                {children}
                {isLoading && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="text-center py-8">
                            <LoaderCircle className="mx-auto h-8 w-8 mb-4 animate-spin text-orange-600" />
                        </div>
                    </div>
                )}
            </div>
        </LoadingContext.Provider>
    );
};


export const useLoading = (): LoadingContextType => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    return context;
};
