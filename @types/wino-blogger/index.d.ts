declare function regexIno(content: string, pattern?: RegExp): string[];

declare function urlJsonSearchPostsCategories(params: {
  category?: string;
  postId?: string;
  query?: string;
  blogUrl?: string;
  blogId?: string;
}): string;

declare class WinoBlogger {
  blogUrl: string;
  blogId: string;
  saveTmp: any;
  isBrowser: boolean;
  data: any;
  category: string;
  postId: string;
  query: string;
  variables: any[];
  constructor(props?: {
    blogId?: string;
    isBrowser?: boolean;
    saveTmp?: any;
    blogUrl?: string;
  });
  categories(cats?: string[]): this;
  labels(cats?: string[]): this;
  post(postId?: string): this;
  search(text?: string): this;
  limit(n?: number): this;
  skip(n?: number): this;
  orderby(value?: string): this;
  callback(cb: any): this;
  setData(data: any): this;
  getData(): any;
  published(dateMin?: string, dateMax?: string): this;
  updated(dateMin?: string, dateMax?: string): this;
  load(variables: any[]): Promise<any>;
  exec(variables: any[]): Promise<any>;
}

declare function getPost(
  entry: any,
  variables?: any[]
): {
  id: string;
  content: string;
  media$thumbnail: any;
  published: string;
  updated: string;
  title: string;
  category: any;
  link: any;
};

