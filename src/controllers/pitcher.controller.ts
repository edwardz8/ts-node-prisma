import { NextFunction, Request, Response, Router } from 'express';
import auth from '../utils/auth';
import {
  getPitchers,
  getPitcher,
  getPitchersFeed,
  addComment,
  getCommentsByPitcher,
  deleteComment,
  favoritePitcher,
  unfavoritePitcher,
  // updatePitcher,
} from '../services/pitcher.service';

const router = Router();

/**
 * Get paginated pitchers
 * @auth optional
 * @route {GET} /pitchers
 * @queryparam offset number of pitchers dismissed from the first one
 * @queryparam limit number of pitchers returned
 * @queryparam user
 * @queryparam favorited
 * @returns pitchers: list of pitchers
 */
router.get('/pitchers', auth.optional, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getPitchers(req.query, req.user?.username);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * Get paginated feed of pitchers
 * @auth required
 * @route {GET} /pitchers/feed
 * @returns pitchers list of pitchers
 */
router.get(
  '/pitchers/feed',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getPitchersFeed(
        Number(req.query.offset),
        Number(req.query.limit),
        req.user?.username as string,
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Get unique pitcher
 * @auth optional
 * @route {GET} /pitcher/:id
 * @param slug slug of the pitcher (based on the id)
 * @returns pithcer
 */
router.get(
  '/pitchers/:id',
  auth.optional,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pitcher = await getPitcher(Number(req.params.id), req.user?.username as string);
      res.json({ pitcher });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Update pitcher
 * @auth required
 * @route {PUT} /pitchers/:id
 * @param slug slug of the pitcher (based on the name)
 * @bodyparam description new description
 * @returns pitcher updated pitcher
 */
/* router.put(
  '/pitchers/:id',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pitcher = await updatePitcher(
        req.body.pitcher,
        req.params.id,
        req.user?.username as string,
      );
      res.json({ pitcher });
    } catch (error) {
      next(error);
    }
  },
); */

/**
 * Get comments on a unique pitcher
 * @auth optional
 * @route {GET} /articles/:id/comments
 * @param slug id of the pitcher (based on the name)
 * @returns comments list of comments
 */
router.get(
  '/pitchers/:id/comments',
  auth.optional,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const comments = await getCommentsByPitcher(Number(req.params.id), req.user?.username);
      res.json({ comments });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Add comment to pitcher
 * @auth required
 * @route {POST} /pitchers/:id/comments
 * @param slug slug of the article (based on the name)
 * @bodyparam body content of the comment
 * @returns comment created comment
 */
router.post(
  '/pitchers/:id/comments',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const comment = await addComment(
        req.body.comment.body,
        Number(req.params.id),
        req.user?.username as string,
      );
      res.json({ comment });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Delete comment
 * @auth required
 * @route {DELETE} /pitcher/:id/comments/:id
 * @param slug slug of the pitcher (based on the title)
 * @param id id of the comment
 */
router.delete(
  '/pitchers/:id/comments/:id',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteComment(Number(req.params.id), req.user?.username as string);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Favorite pitcher
 * @auth required
 * @route {POST} /pitchers/:id/favorite
 * @param slug slug of the pitcher (based on the name)
 * @returns pitcher favorited pitcher
 */
router.post(
  '/pitchers/:id/favorite',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pitcher = await favoritePitcher(Number(req.params.id), req.user?.username as string);
      res.json({ pitcher });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * Unfavorite pitcher
 * @auth required
 * @route {DELETE} /pitchers/:id/favorite
 * @param slug slug of the pitcher (based on the name)
 * @returns pitcher unfavorited pitcher
 */
router.delete(
  '/pitchers/:id/favorite',
  auth.required,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pitcher = await unfavoritePitcher(Number(req.params.id), req.user?.username as string);
      res.json({ pitcher });
    } catch (error) {
      next(error);
    }
  },
);

export default router;
