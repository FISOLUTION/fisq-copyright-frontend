// 기본 도서 데이터 인터페이스 (연속간행물과 단행본 공통)
export interface BaseBookData {
  id: string;
  selected?: boolean;
  [key: string]: string | boolean | undefined;
}

// 연속간행물 전용 인터페이스
export interface PeriodicalPublication extends BaseBookData {
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
