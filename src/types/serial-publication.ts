// 기본 도서 데이터 인터페이스 (연속간행물과 단행본 공통)
export interface BaseBookData {
  id: string;
  selected?: boolean;
  [key: string]: string | boolean | number | null | undefined;
}

// 연속간행물 전용 인터페이스
export interface SerialPublication extends BaseBookData {
  // 기본정보 (SerialRequestItem 기반)
  author: string;
  bookTitle: string | null;
  publisher: string;
  publishYear: string;
  imageInfo: string | null;
  articleTitle: string;

  // 메타정보 (SerialResponseItem 기반, 기본정보 중복 제외)
  authorType: string | null;
  birthYear: string | null;
  deathYear: string | null;
  controlNumber: string | null;
  isni: string | null;
  lastAffiliation: string | null;
  remark: string | null;
}

// 단행본 전용 인터페이스 (articleTitle 제외)
export interface MonographPublication extends BaseBookData {
  // 기본정보 (MonographRequestItem 기반)
  author: string;
  bookTitle: string | null;
  publisher: string;
  publishYear: string;
  imageInfo: string | null;

  // 메타정보 (BookSearchResponseItem 기반)
  authorType: string | null;
  birthYear: string | null;
  deathYear: string | null;
  controlNumber: string | null;
  isni: string | null;
  lastAffiliation: string | null;
  remark: string | null;
}
