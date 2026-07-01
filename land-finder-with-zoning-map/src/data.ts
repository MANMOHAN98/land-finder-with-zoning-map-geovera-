import { ZoningInfo, LandListing, ZoningCode } from './types';

export const ZONING_RULES: Record<ZoningCode, ZoningInfo> = {
  'AGRI': {
    code: 'AGRI',
    name: 'Zone A-1: Prime Agricultural & Forest land',
    category: 'Agricultural',
    color: '#16a34a', // green-600
    borderColor: '#15803d', // green-700
    bgLight: '#f0fdf4', // green-50
    allowedUses: ['Traditional and modern organic field crops', 'Horticulture, Floriculture & Silviculture', 'Livestock grazing & dairy development', 'Farmhouses up to 10% lot coverage'],
    maxHeight: '30 feet (Exceptions for granaries & water silos)',
    setback: 'Front: 35ft, Rear: 30ft, Side: 20ft',
    lotCoverage: '10% maximum building footprint',
    description: 'Reserved exclusively for preserving high-yield agricultural soils, protecting water resources, and facilitating sustainable rural and plantation farming.'
  },
  'RES': {
    code: 'RES',
    name: 'Zone R-1: Low to Medium Density Residential',
    category: 'Residential',
    color: '#0284c7', // sky-600
    borderColor: '#0369a1', // sky-700
    bgLight: '#f0f9ff', // sky-50
    allowedUses: ['Single-family custom villas', 'Multi-family gated housing clusters', 'Public parks and community recreational spaces', 'Home-based cottage occupations'],
    maxHeight: '50 feet (G+3 Floors maximum limit)',
    setback: 'Front: 20ft, Rear: 15ft, Side: 8ft',
    lotCoverage: '50% maximum coverage',
    description: 'Aimed to foster calm residential neighborhoods, maintaining aesthetic garden spaces, sewage isolation, and proper building setbacks.'
  },
  'COMM': {
    code: 'COMM',
    name: 'Zone C-2: Commercial Core Hub District',
    category: 'Commercial',
    color: '#a855f7', // purple-500
    borderColor: '#9333ea', // purple-600
    bgLight: '#faf5ff', // purple-50
    allowedUses: ['Retail malls and shopping plazas', 'Corporate offices, coworking spaces', 'Hospitals, medical diagnostics clinics', 'Hotels, fine dining, recreation centers'],
    maxHeight: '120 feet (High-rise commercial permission)',
    setback: 'Front: 15ft, Rear: 10ft, Side: 0ft (approved zero-setback with firewall)',
    lotCoverage: '75% maximum coverage',
    description: 'High-density commercial sector optimized for public foot traffic, business accessibility, and professional services near transit systems.'
  },
  'IND': {
    code: 'IND',
    name: 'Zone M-1: Light and Medium Industrial Corridor',
    category: 'Industrial',
    color: '#ec4899', // pink-500
    borderColor: '#db2777', // pink-600
    bgLight: '#fdf2f8', // pink-50
    allowedUses: ['Manufacturing units, processing yards', 'E-commerce logistics & distribution warehouses', 'Information technology tech-parks', 'R&D labs & calibration terminals'],
    maxHeight: '80 feet',
    setback: 'Front: 40ft, Rear: 30ft, Side: 20ft',
    lotCoverage: '60% maximum coverage',
    description: 'Specifically allocated away from core residential towns to handle truck logistics loading, heavy power equipment, and assembly warehouses with strict buffer perimeters.'
  }
};

export const INITIAL_LISTINGS: LandListing[] = [];

export function formatCurrency(priceInRupees: number, hub: 'INDIA' = 'INDIA') {
  if (priceInRupees >= 10000000) {
    return `₹${(priceInRupees / 10000000).toFixed(2)} Cr`;
  } else if (priceInRupees >= 100000) {
    return `₹${(priceInRupees / 100000).toFixed(2)} Lakh`;
  }
  return `₹${Math.round(priceInRupees).toLocaleString('en-IN')}`;
}

export function formatArea(acres: number, hub: 'INDIA' = 'INDIA') {
  const bighas = acres * 1.6; // realistic conversion in central/north india
  const gunthas = acres * 40; // realistic conversion in south/west india
  return `${acres.toFixed(2)} Acres (~${bighas.toFixed(1)} Bighas / ${Math.round(gunthas)} Gunthas)`;
}
