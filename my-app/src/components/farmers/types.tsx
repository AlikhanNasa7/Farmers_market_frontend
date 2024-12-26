interface Contact {
    email: string,
    phone: string
}
export interface FarmerData {
    average_performance: number | null; 
    certification_details: string | null;  // Assuming this could be a string or null
    created_at: string;  // ISO string date format
    first_name: string;
    last_name: string;
    specialization: string | null;  // Assuming this could be a string or null
    total_farm_area: string;  // Assuming it could be a number or null
    updated_at: string;  // ISO string date format
    user: string;  // Assuming it's a string representing a UUID
    years_of_experience: number;
  }