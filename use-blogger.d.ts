declare module 'use-blogger' {
    interface UseBloggerProps {
      blogUrl?: string;
      blogId?: string;
      isBrowser?: boolean;
      save?: (data: any) => void;
    }
  
    interface UseBloggerInstance {
      categories: (categories?: string[]) => UseBloggerInstance;
      uncategories: (categories?: string[]) => UseBloggerInstance;
      labels: (categories?: string[]) => UseBloggerInstance;
      unlabels: (categories?: string[]) => UseBloggerInstance;
      post: (postId?: string) => UseBloggerInstance;
      search: (text?: string) => UseBloggerInstance;
      limit: (n?: number) => UseBloggerInstance;
      select: (select?: string[]) => UseBloggerInstance;
      unselect: (select?: string[]) => UseBloggerInstance;
      skip: (n?: number) => UseBloggerInstance;
      orderby: (value?: 'published' | 'updated') => UseBloggerInstance;
      callback: (cb: (data: any) => void) => UseBloggerInstance;
      setData: (data: any) => UseBloggerInstance;
      getData: () => any;
      published: (dateMin?: string, dateMax?: string) => UseBloggerInstance;
      updated: (dateMin?: string, dateMax?: string) => UseBloggerInstance;
      load: (variables: any) => Promise<any>;
      exec: (variables: any) => Promise<any>;
    }
  
    export default class UseBlogger implements UseBloggerInstance {
      constructor(props: UseBloggerProps);
  
      categories(categories?: string[]): UseBloggerInstance;
      uncategories(categories?: string[]): UseBloggerInstance;
      labels(categories?: string[]): UseBloggerInstance;
      unlabels(categories?: string[]): UseBloggerInstance;
      post(postId?: string): UseBloggerInstance;
      search(text?: string): UseBloggerInstance;
      limit(n?: number): UseBloggerInstance;
      select(select?: string[]): UseBloggerInstance;
      unselect(select?: string[]): UseBloggerInstance;
      skip(n?: number): UseBloggerInstance;
      orderby(value?: 'published' | 'updated'): UseBloggerInstance;
      callback(cb: (data: any) => void): UseBloggerInstance;
      setData(data: any): UseBloggerInstance;
      getData(): any;
      published(dateMin?: string, dateMax?: string): UseBloggerInstance;
      updated(dateMin?: string, dateMax?: string): UseBloggerInstance;
      load(variables: any): Promise<any>;
      exec(variables: any): Promise<any>;
    }
  }
  