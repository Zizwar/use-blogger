declare module "winoblogger" {
  export default class WinoBlogger {
    blogUrl: string;
    blogId: string;
    saveTmp: boolean;
    isBrowser: boolean;
    data: any;
    category: string;
    postId: string;
    query: string;
    variables: any;
    constructor(props?: { blogId?: string; isBrowser: boolean; saveTmp: boolean; blogUrl?: string });
    categories(cats?: string[]): this;
    labels(cats?: string[]): this;
    post(postId: string): this;
    search(text: string): this;
    limit(n: number): this;
    skip(n: number): this;
    orderby(value: "published" | "updated"): this;
    callback(cb: Function): this;
    setData(data: any): this;
    getData(): any;
    published(dateMin?: string, dateMax?: string): this;
    updated(dateMin?: string, dateMax?: string): this;
    load(variables: any): Promise<any>;
    exec(variables: any): Promise<any>;
  }
}
