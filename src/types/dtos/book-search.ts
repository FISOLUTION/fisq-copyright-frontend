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

export type MonographRequestItem = BaseSearchRequestItem;

export interface BookSearchResponseItem {
  authorType: string | null;
  birthYear: string | null;
  deathYear: string | null;
  controlNumber: string | null;
  isni: string | null;
  lastAffiliation: string | null;
  remark: string | null;
}
