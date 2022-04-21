import { Comment } from './comment.model';

export interface Article {
  id: number;
  title: string;
  slug: string;
  image: string;
  description: string;
  comments: Comment[];
  favorited: boolean;
}
