export interface BaseSearchRequestItem {
  author: string;
  bookTitle: string | null;
  publisher: string;
  publishYear: string;
  additionalInfo: string | null;
}

export interface SerialRequestItem extends BaseSearchRequestItem {
  articleTitle: string;
}

export type MonographRequestItem = BaseSearchRequestItem;

export interface CopyrightInfo {
  code: string;
  has_copyright: boolean;
  reason: string;
}

export interface BookSearchResponseItem {
  authorType: string | null;
  birthYear: string | null;
  deathYear: string | null;
  controlNumber: string | null;
  isni: string | null;
  lastAffiliation: string | null;
  remark: string | null;
  webSearchUtilized: boolean | null;
  isAuthorUnknown: boolean | null;
  copyrightInfo: CopyrightInfo;
}
