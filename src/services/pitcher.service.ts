import slugify from 'slugify';
import prisma from '../../prisma/prisma-client';
import HttpException from '../models/http-exception.model';
import { findUserIdByUsername } from './auth.service';
import profileMapper from '../utils/profile.utils';

const buildFindAllQuery = (query: any, username: string | undefined) => {
  const queries: any = [];
  const orAuthorQuery = [];
  const andAuthorQuery = [];

  if (username) {
    orAuthorQuery.push({
      username: {
        equals: username,
      },
    });
  }

  if ('author' in query) {
    andAuthorQuery.push({
      username: {
        equals: query.author,
      },
    });
  }

  const authorQuery = {
    author: {
      OR: orAuthorQuery,
      AND: andAuthorQuery,
    },
  };

  queries.push(authorQuery);

  if ('tag' in query) {
    queries.push({
      tagList: {
        some: {
          name: query.tag,
        },
      },
    });
  }

  if ('favorited' in query) {
    queries.push({
      favoritedBy: {
        some: {
          username: {
            equals: query.favorited,
          },
        },
      },
    });
  }

  return queries;
};

export const getPitchers = async (query: any, username?: string) => {
  const andQueries = buildFindAllQuery(query, username);
  const pitchersCount = await prisma.pitcher.count({
    where: {
      AND: andQueries,
    },
  });

  const pitchers = await prisma.pitcher.findMany({
    where: { AND: andQueries },
    skip: Number(query.offset) || 0,
    take: Number(query.limit) || 20,
    include: {
      tagList: {
        select: {
          name: true,
        },
      },
      author: {
        select: {
          username: true,
          image: true,
          followedBy: true,
        },
      },
      favoritedBy: true,
      _count: {
        select: {
          favoritedBy: true,
        },
      },
    },
  });

  return {
    pitchers: pitchers.map(({ authorId, id, _count, favoritedBy, ...pitcher }) => ({
      ...pitcher,
      author: profileMapper(pitcher.author, username),
      tagList: pitcher.tagList.map(tag => tag.name),
      favoritesCount: _count?.favoritedBy,
      favorited: favoritedBy.some(item => item.username === username),
    })),
    pitchersCount,
  };
};

export const getPitchersFeed = async (offset: number, limit: number, username: string) => {
  const user = await findUserIdByUsername(username);

  const pitchersCount = await prisma.pitcher.count({
    where: {
      author: {
        followedBy: { some: { id: user?.id } },
      },
    },
  });

  const pitchers = await prisma.pitcher.findMany({
    where: {
      author: {
        followedBy: { some: { id: user?.id } },
      },
    },
    skip: offset || 0,
    take: limit || 10,
    include: {
      tagList: {
        select: {
          name: true,
        },
      },
      author: {
        select: {
          username: true,
          bio: true,
          image: true,
          followedBy: true,
        },
      },
      favoritedBy: true,
      _count: {
        select: {
          favoritedBy: true,
        },
      },
    },
  });

  return {
    pitchers: pitchers.map(({ authorId, id, _count, favoritedBy, ...pitcher }) => ({
      ...pitcher,
      name: profileMapper(pitcher.name, username),
      tagList: pitcher.tagList.map(tag => tag.name),
      favoritesCount: _count?.favoritedBy,
      favorited: favoritedBy.some(item => item.username === username),
    })),
    pitchersCount,
  };
};

export const getPitcher = async (id: number, username?: string) => {
  const pitcher = await prisma.pitcher.findUnique({
    where: {
      id,
    },
    include: {
      tagList: {
        select: {
          name: true,
        },
      },
      author: {
        select: {
          username: true,
          image: true,
          followedBy: true,
        },
      },
      favoritedBy: true,
      _count: {
        select: {
          favoritedBy: true,
        },
      },
    },
  });

  return {
    name: pitcher?.name,
    id: pitcher?.id,
    team: pitcher?.team,
    wins: pitcher?.wins,
    losses: pitcher?.losses,
    ks_per_nine: pitcher?.ks_per_nine,
    // description: pitcher?.description,
    tagList: pitcher?.tagList.map(tag => tag.name),
    favoritesCount: pitcher?._count?.favoritedBy,
    favorited: pitcher?.favoritedBy.some(item => item.username === username),
    author: {
      ...pitcher?.author,
      following: pitcher?.author.followedBy.some(follow => follow.username === username),
    },
  };
};

/* const disconnectPitchersTags = async (id: number) => {
  await prisma.pitcher.update({
    where: {
      id,
    },
    data: {
      tagList: {
        set: [],
      },
    },
  });
}; */

/* export const updatePitcher = async (pitcher: any, id: number, username: string) => {
  let newPitcherSlug = null;
  const user = await findUserIdByUsername(username);

  // newPitcherSlug = `${slugify(pitcher.name)}-${user?.id}`;

  if (pitcher.id) {
    const existingTitle = await prisma.pitcher.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (existingTitle) {
      throw new HttpException(422, { errors: { title: ['must be unique'] } });
    }
  }

  const tagList = pitcher.tagList?.length
    ? pitcher.tagList.map((tag: string) => ({
      create: { name: tag },
      where: { name: tag },
    }))
    : [];

  await disconnectPitchersTags(id);

  const updatedPitcher = await prisma.pitcher.update({
    where: {
      id,
    },
    data: {
      ...(pitcher.id ? { id: pitcher.id } : {}),
      ...(pitcher.name ? { title: pitcher.name } : {}),
      ...(pitcher.description ? { description: pitcher.description } : {}),
      tagList: {
        connectOrCreate: tagList,
      },
    },
    include: {
      tagList: {
        select: {
          name: true,
        },
      },
      author: {
        select: {
          username: true,
          image: true,
        },
      },
      favoritedBy: true,
      _count: {
        select: {
          favoritedBy: true,
        },
      },
    },
  });

  return {
    name: updatedPitcher?.name,
    description: updatedPitcher?.description,
    tagList: updatedPitcher?.tagList.map(tag => tag.name),
    favoritesCount: updatedPitcher?._count?.favoritedBy,
    favorited: updatedPitcher?.favoritedBy.some(item => item.username === username),
    author: updatedPitcher?.author,
  };
}; */

export const deletepitcher = async (id: number) => {
  await prisma.pitcher.delete({
    where: {
      id,
    },
  });
};

export const getCommentsByPitcher = async (id: number, username?: string) => {
  const queries = [];

  if (username) {
    queries.push({
      author: {
        username,
      },
    });
  }

  const comments = await prisma.pitcher.findUnique({
    where: {
      id,
    },
    include: {
      comments: {
        where: {
          OR: queries,
        },
        select: {
          id: true,
          body: true,
          author: {
            select: {
              username: true,
              image: true,
              followedBy: true,
            },
          },
        },
      },
    },
  });

  const result = comments?.comments.map(comment => ({
    ...comment,
    author: {
      username: comment.author.username,
      image: comment.author.image,
      following: comment.author.followedBy.some(follow => follow.username === username),
    },
  }));

  return result;
};

export const addComment = async (body: string, id: number, username: string) => {
  if (!body) {
    throw new HttpException(422, { errors: { body: ["can't be blank"] } });
  }

  const user = await findUserIdByUsername(username);

  const pitcher = await prisma.pitcher.findUnique({
    where: {
      id
    },
    select: {
      id: true,
    },
  });

  const comment = await prisma.comment.create({
    data: {
      body,
      pitcher: {
        connect: {
          id: pitcher?.id,
        },
      },
      author: {
        connect: {
          id: user?.id,
        },
      },
    },
    include: {
      author: {
        select: {
          username: true,
          image: true,
          followedBy: true,
        },
      },
    },
  });

  return {
    id: comment.id,
    body: comment.body,
    author: {
      username: comment.author.username,
      image: comment.author.image,
      following: comment.author.followedBy.some(follow => follow.id === user?.id),
    },
  };
};

export const deleteComment = async (id: number, username: string) => {
  const comment = await prisma.comment.findFirst({
    where: {
      id,
      author: {
        username,
      },
    },
  });

  if (!comment) {
    throw new HttpException(201, {});
  }

  await prisma.comment.delete({
    where: {
      id,
    },
  });
};

export const favoritePitcher = async (id: number, usernameAuth: string) => {
  const user = await findUserIdByUsername(usernameAuth);

  const { _count, ...pitcher } = await prisma.pitcher.update({
    where: {
      id,
    },
    data: {
      favoritedBy: {
        connect: {
          id: user?.id,
        },
      },
    },
    include: {
      tagList: {
        select: {
          name: true,
        },
      },
      author: {
        select: {
          username: true,
          image: true,
          followedBy: true,
        },
      },
      favoritedBy: true,
      _count: {
        select: {
          favoritedBy: true,
        },
      },
    },
  });

  const result = {
    ...pitcher,
    author: profileMapper(pitcher.author, usernameAuth),
    tagList: pitcher?.tagList.map(tag => tag.name),
    favorited: pitcher.favoritedBy.some(favorited => favorited.id === user?.id),
    favoritesCount: _count?.favoritedBy,
  };

  return result;
};

export const unfavoritePitcher = async (id: number, usernameAuth: string) => {
  const user = await findUserIdByUsername(usernameAuth);

  const { _count, ...pitcher } = await prisma.pitcher.update({
    where: {
      id,
    },
    data: {
      favoritedBy: {
        disconnect: {
          id: user?.id,
        },
      },
    },
    include: {
      tagList: {
        select: {
          name: true,
        },
      },
      author: {
        select: {
          username: true,
          image: true,
          followedBy: true,
        },
      },
      favoritedBy: true,
      _count: {
        select: {
          favoritedBy: true,
        },
      },
    },
  });

  const result = {
    ...pitcher,
    author: profileMapper(pitcher.author, usernameAuth),
    tagList: pitcher?.tagList.map(tag => tag.name),
    favorited: pitcher.favoritedBy.some(favorited => favorited.id === user?.id),
    favoritesCount: _count?.favoritedBy,
  };

  return result;
};
