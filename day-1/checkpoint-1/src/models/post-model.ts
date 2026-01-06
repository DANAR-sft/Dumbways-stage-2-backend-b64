export interface Post {
  id: number;
  title: string;
  content: string;
}

export const posts: Post[] = [
  { id: 1, title: "post pertama", content: "content 1" },
  { id: 2, title: "post kedua", content: "content 2" },
];
