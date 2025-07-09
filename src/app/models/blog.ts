export interface Blog {
  id?:string;
  title: string;
  content: string;
  createdAt: Date;
  author_id:string;
}