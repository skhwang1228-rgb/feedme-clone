export type ConvertedPage = {
  title: string;
  author: string;
  site: string;
  wordCount: number;
  markdown: string;
  /** 최종(리다이렉트 이후) 원본 URL */
  url: string;
};
