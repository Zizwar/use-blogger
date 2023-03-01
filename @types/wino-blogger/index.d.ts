declare module "wino-blogger" {
    export const regexs: {
      https: string;
      dictionary: string;
      tuple: string;
      array: string;
      src: string;
      video: string;
      custom: (r: any) => any;
    };
    export function regexIno(content: string, pattern?: RegExp): string[];
    export function urlJsonSearchPostsCategories(options: {
      category?: string;
      postId?: string;
      query?: string;
      blogUrl?: string;
      blogId?: string;
    }): string;
    export default class WinoBlogger {
      constructor(props?: {
        blogId?: string;
        isBrowser?: boolean;
        saveTmp?: boolean;
        blogUrl?: string;
      });
      categories(cats?: string[]): this;
      labels(cats?: string[]): this;
      post(postId?: string): this;
      search(text?: string): this;
      limit(n?: number): this;
      skip(n: number): this;
      orderby(value?: string): this;
      callback(cb: (data: any) => void): this;
      setData(data: any): this;
      getData(): any;
      published(dateMin?: string, dateMax?: string): this;
      updated(dateMin?: string, dateMax?: string): this;
      load(variables: any[]): Promise<any>;
      exec(variables: any[]): Promise<any>;
    }
  }
  