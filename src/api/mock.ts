//mock.ts
import { flights } from './flights';

export type Flight = {
    from: string;
    to: string;
    departureAirportCode: string,
    arrivalAirportCode: string,
    airline: string;
    departureTime: string;
    arrivalTime: string;
    duration: string;
    price: number;
    departureDate: string, 
    arrivalDate: string,
    type?: 'departure' | 'return'
};

export type FlightSearchCriteria = {
    departureCity?: string;
    arrivalCity?: string;
    departureDate?: string;
    returnDate?: string;
};

export type Airport = {
    name: string;
    code: string;
    city: string;
    country: string;
    countrycode: string;
};
  
export function getCities(query: string): Promise<Airport[]> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (query == '') return resolve(cities); // Don't search until at least 2 characters are entered

            if (Math.random() < 0.001) { //lowered for testing
                reject('API Error: Something went wrong!');
            } else {
                const matchedCities = cities.filter(airport => 
                    airport.code.toLowerCase().includes(query.toLowerCase()) ||
                    airport.city.toLowerCase().includes(query.toLowerCase()) 
                );
                resolve(matchedCities);
            }
        }, 100);
    });
}


export function getFlights(): Promise<Flight[]> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < 0.15) { // 10% chance to simulate an error
                reject('API Error: Something went wrong!');
            } else {
                resolve(flights);
            }
        }, 1000);
    });
}


export function searchFlights(criteria: FlightSearchCriteria = {}): Promise<Flight[]> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < 0.15) {  // 15% chance to simulate an error
                reject('API Error: Something went wrong!');
            } else {
                // Departure flights search
                const departureFlights = flights.filter(flight => {
                    return (
                        (!criteria.departureCity || flight.from === criteria.departureCity) &&
                        (!criteria.arrivalCity || flight.to === criteria.arrivalCity) &&
                        (!criteria.departureDate || flight.departureDate === criteria.departureDate)
                    );
                }).map(flight => ({ ...flight, type: 'departure' as const }));

                // Return flights search
                let returnFlights: Flight[] = [];

                if (criteria.returnDate && criteria.returnDate !== "") {
                    // Return flights search
                    returnFlights = flights.filter(flight => {
                        return (
                            (!criteria.arrivalCity || flight.from === criteria.arrivalCity) &&
                            (!criteria.departureCity || flight.to === criteria.departureCity) &&
                            flight.departureDate === criteria.returnDate
                        );
                    }).map(flight => ({ ...flight, type: 'return' as const }));
                }
                resolve([...departureFlights, ...returnFlights]);
            }
        }, 1250);  // Simulate network latency
    });
}


  const cities: Airport[] = [
    { name: "Istanbul Airport", code: "IST", city: "Istanbul", country: "Turkey", countrycode: "TR" },
    { name: "John F. Kennedy International Airport", code: "JFK", city: "New York", country: "United States", countrycode: "US" },
    { name: "Heathrow Airport", code: "LHR", city: "London", country: "United Kingdom", countrycode: "GB" },
    { name: "Charles de Gaulle Airport", code: "CDG", city: "Paris", country: "France", countrycode: "FR" },
    { name: "Narita International Airport", code: "NRT", city: "Tokyo", country: "Japan", countrycode: "JP" },
    { name: "Dubai International Airport", code: "DXB", city: "Dubai", country: "United Arab Emirates", countrycode: "AE" },
    { name: "Sydney Airport", code: "SYD", city: "Sydney", country: "Australia", countrycode: "AU" },
    { name: "Toronto Pearson International Airport", code: "YYZ", city: "Toronto", country: "Canada", countrycode: "CA" },
    { name: "Berlin Tegel Airport", code: "TXL", city: "Berlin", country: "Germany", countrycode: "DE" },
    { name: "Chhatrapati Shivaji Maharaj International Airport", code: "BOM", city: "Mumbai", country: "India", countrycode: "IN" },
    { name: "Los Angeles International Airport", code: "LAX", city: "Los Angeles", country: "United States", countrycode: "US" },
    { name: "Leonardo da Vinci-Fiumicino Airport", code: "FCO", city: "Rome", country: "Italy", countrycode: "IT" },
    { name: "Hong Kong International Airport", code: "HKG", city: "Hong Kong", country: "Hong Kong", countrycode: "HK" },
    { name: "Adolfo Suárez Madrid–Barajas Airport", code: "MAD", city: "Madrid", country: "Spain", countrycode: "ES" },
];


