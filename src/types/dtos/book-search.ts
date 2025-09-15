export interface BaseSearchRequestItem {
  author: string;
  bookTitle: string | null;
  publisher: string;
  publishYear: string;
  imageInfo: string | null;
}

export interface SerialRequestItem extends BaseSearchRequestItem {
  articleTitle: string;
}

export interface SerialSearchRequest {
  items: SerialRequestItem[];
}

export interface BookSearchResponseItem {
  index: number;
  authorType: string | null;
  birthYear: string | null;
  deathYear: string | null;
  controlNumber: string | null;
  isni: string | null;
  lastAffiliation: string | null;
  remark: string | null;
}

export interface BookSearchResponse {
  successItems: BookSearchResponseItem[];
  failedIndices: number[];
}
