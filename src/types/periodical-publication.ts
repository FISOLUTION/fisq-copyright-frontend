export interface PeriodicalPublication {
  id: string;
  selected?: boolean;
  
  // 기본정보
  signature: string;
  workTitle: string;
  authorName: string;
  publisherName: string;
  publicationYear: string;
  copyrightCategory: string;
  
  // 메타정보
  birthYear?: string;
  deathYear?: string;
  kac?: string;
  isni?: string;
  nationality?: string;
  roleDescription?: string;
  residenceInfo?: string;
  rightsHolderUnknown?: string;
  copyrightStatus?: string;
}