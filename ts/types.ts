export interface User {
  id: number;
  name: string;
}

export interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  body: string;
  category: string;
  authorId: number;
  published: boolean;
}

export interface NewsFormData {
  title: string;
  summary: string;
  body: string;
  category: string;
  authorId: number;
  published: boolean;
}