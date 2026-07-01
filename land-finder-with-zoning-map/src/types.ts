export type ZoningCode = 'RES' | 'COMM' | 'IND' | 'AGRI';

export interface ZoningInfo {
  code: ZoningCode;
  name: string;
  category: string;
  color: string; // Tailwind class-compatible color or hex
  borderColor: string;
  bgLight: string;
  allowedUses: string[];
  maxHeight: string;
  setback: string;
  lotCoverage: string;
  description: string;
}

export interface LandListing {
  id: string;
  title: string;
  location: string; // Town/District/State
  areaName: string; // Compulsory Area/Village name
  county: string; // State/District level
  price: number; // Value in lakhs/crores or base rupees
  acres: number; // Size in acres (Compulsory)
  zoning: ZoningCode; // General system zoning code
  imageUrl: string; // Photo of the property
  videoUrl?: string; // Video recording link or simulated clip
  description: string;
  coordinates: { lat: number; lng: number }; // Live location coordinates
  parcelPolygon: [number, number][]; // Relative points [x, y] for SVG overlay (0-100 coordinate space)
  agentId: string;
  agentName: string;
  agentPhone: string;
  agentEmail: string;
  landType: string; // Compulsory: dry land, wetland, commercial converted, etc.
  soilType: string; // Compulsory soil type (Red soil, alluvial black, clay, etc.)
  landColor?: string; // Color of the land
  cropsSuggested: string; // Compulsory crop details
  existingPlants: string; // Compulsory existing trees/crops info
  surveyNumber?: string; // Land registry survey identifier
  ownerName?: string; // Full legal name of landowner
  treesCount?: string; // Number/count of specifically listed trees on plot
  state?: string;      // Explicit registered State (India)
  district?: string;   // Explicit registered District
  taluk?: string;      // Explicit registered Taluk
  village?: string;    // Explicit registered Village
  pincode?: string;    // Pincode of the location
  address?: string;    // Direct geocoded/saved address
  waterSource: string;
  electricity: string;
  roadAccess: string;
  hasSoilTest: boolean;
  hasSurvey: boolean;
  featured?: boolean;
  hub?: 'INDIA'; // Strictly local
  isUserAdded?: boolean; // Label for user registered listings
  status?: 'approved' | 'rejected' | 'pending';
}

export type UserRole = 'buyer' | 'agent' | 'deployer' | 'seller' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isVerifiedAgent?: boolean;
  agencyName?: string;
  licenseNumber?: string;
  agentPhone?: string;
  verificationIdType?: string;
  verificationIdNo?: string;
}

export interface LoginLog {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  timestamp: string; // fallback
  loginTime: string;  // Explicit tracking
  logoutTime?: string; // Explicit tracking
  passwordSecure?: string; // Shielded private password
  method: string;
  status: 'success' | 'failed';
  userAgent?: string;
  action?: string;
}

export function getDeployerEmail(): string {
  // Safe virtualized placeholder that aligns with the secure backend email masking
  return "admin@indiacadasters.gov.in";
}

export function formatToIST(utcVal: string | Date | undefined): string {
  if (!utcVal) return '';
  try {
    // If the value is a string and contains " UTC", convert it to standard ISO representation for parsing
    let cleanVal = utcVal;
    if (typeof utcVal === 'string') {
      if (utcVal.endsWith(' UTC')) {
        cleanVal = utcVal.slice(0, -4).replace(' ', 'T') + 'Z';
      }
    }
    const d = typeof cleanVal === 'string' ? new Date(cleanVal) : cleanVal;
    if (isNaN(d.getTime())) return String(utcVal);
    const formatter = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    return formatter.format(d) + ' IST';
  } catch (err) {
    return String(utcVal);
  }
}

export interface InquiryMessage {
  id: string;
  propertyId: string;
  propertyName: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  agentId: string;
  message: string;
  createdAt: string;
  type: 'general' | 'offer';
  offerPrice?: number;
  offerTerms?: string;
  status?: 'pending' | 'accepted' | 'countered' | 'rejected';
  agentResponse?: string;
}
