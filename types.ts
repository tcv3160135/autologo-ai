
export type BrandPersonality = 'Smart' | 'Reliable' | 'Innovative' | 'Scalable';

export interface LogoConfig {
  brandName: string;
  personality: BrandPersonality[];
  primaryColor: string;
  style: 'Minimalist' | 'Geometric' | 'Abstract' | 'Symbolic';
}

export interface GeneratedLogo {
  id: string;
  imageUrl: string;
  prompt: string;
  timestamp: number;
}
