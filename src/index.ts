/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/**
 * Import express framework
 */
import express, { Request, Response, Application } from 'express';
/**
 * Swagger UI for API documentation
 */
import swaggerUi from 'swagger-ui-express';
/**
 * Import Cors (needed because of API documentation in this project)
 * What is CORS?: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
 */
import cors from 'cors';
/**
 * Import API documentation file
 */
import swaggerDocument from '../openApi.json';
/**
 * Create express app
 */
const app: Application = express();

/**
 * Middleware for creating request body object
 */
app.use(express.json());
/**
 * Register CORS middleware
 */
app.use(cors());
/**
 * Register API documentation middleware
 */
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/**
 * Port number for express app
 */
const port = 3000;

/**
 * Http response codes
 */
const responseCodes = {
  ok: 200,
  created: 201,
  noContent: 204,
  badRequest: 400,
  notFound: 404,
};

/**
 * User interface
 */
interface User {
  id: number;
  firstName: string;
  lastName: string;
}

/**
 * Category interface
 */
interface Category {
  id: number;
  name: string;
  createdBy: number;
}

/**
 * Excuse interface
 */
interface Excuse {
  id: number;
  description: string;
  createdBy: number;
  category: number;
  visibility: string;
}

/**
 * Database interface
 */
interface Db {
  users: User[];
  categories: Category[];
  excuses: Excuse[];
}

/**
 * Mock database
 */
const db: Db = {
  users: [
    {
      id: 1,
      firstName: 'Juku',
      lastName: 'Juurikas',
    },
    {
      id: 2,
      firstName: 'Mari',
      lastName: 'Maasikas',
    },
  ],
  categories: [
    {
      id: 1,
      name: 'Koolitööd',
      createdBy: 1,
    },
    {
      id: 2,
      name: 'Kodu',
      createdBy: 2,
    },
    {
      id: 3,
      name: 'Töö',
      createdBy: 2,
    },
  ],
  excuses: [
    {
      id: 1,
      description: 'Ei viitsinud teha',
      category: 1,
      createdBy: 1,
      visibility: 'Public',
    },
    {
      id: 2,
      description: 'Ei tahtnud teha',
      category: 1,
      createdBy: 1,
      visibility: 'Public',
    },
    {
      id: 3,
      description: 'Ei jõudnud teha',
      category: 1,
      createdBy: 1,
      visibility: 'Public',
    },
    {
      id: 4,
      description: 'Ei osanud teha',
      category: 1,
      createdBy: 1,
      visibility: 'Public',
    },
    {
      id: 4,
      description: 'Ei tahtnud koristada',
      category: 2,
      createdBy: 1,
      visibility: 'Public',
    },
  ],
};

/**
 * API test endpoint
 */
app.get('/ping', (req: Request, res: Response) => {
  res.status(responseCodes.ok).json({
    message: 'Alive',
  });
});

/**
 * *********************** Users ******************
 * Get all users
 */
app.get('/users', (req: Request, res: Response) => {
  const { users } = db;
  return res.status(responseCodes.ok).json({
    users,
  });
});

/**
 * Get user by id
 */
app.get('/users/:id', (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  if (!id) {
    return res.status(responseCodes.badRequest).json({
      error: 'No valid id provided',
    });
  }
  const user = db.users.find((element) => element.id === id);
  if (!user) {
    return res.status(responseCodes.badRequest).json({
      error: `No user found with id: ${id}`,
    });
  }
  return res.status(responseCodes.ok).json({
    user,
  });
});

/**
 * Remove user by id
 */
app.delete('/users/:id', (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  if (!id) {
    return res.status(responseCodes.badRequest).json({
      error: 'No valid id provided',
    });
  }
  const index = db.users.findIndex((element) => element.id === id);
  if (index < 0) {
    return res.status(responseCodes.badRequest).json({
      message: `User not found with id: ${id}`,
    });
  }
  db.users.splice(index, 1);
  return res.status(responseCodes.noContent).json({});
});

/**
 * Create user
 */
app.post('/users', (req: Request, res: Response) => {
  const { firstName, lastName } = req.body;
  if (!firstName) {
    return res.status(responseCodes.badRequest).json({
      error: 'First name is required',
    });
  }
  if (!lastName) {
    return res.status(responseCodes.badRequest).json({
      error: 'Last name is required',
    });
  }
  const id = db.users.length + 1;
  db.users.push({
    id,
    firstName,
    lastName,
  });
  return res.status(responseCodes.created).json({
    id,
  });
});

/**
 * Update user
 */
app.patch('/users/:id', (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  const { firstName, lastName } = req.body;
  if (!id) {
    return res.status(responseCodes.badRequest).json({
      error: 'No valid id provided',
    });
  }
  if (!firstName && !lastName) {
    return res.status(responseCodes.badRequest).json({
      error: 'Nothing to update',
    });
  }
  const index = db.users.findIndex((element) => element.id === id);
  if (index < 0) {
    return res.status(responseCodes.badRequest).json({
      error: `No user found with id: ${id}`,
    });
  }
  if (firstName) {
    db.users[index].firstName = firstName;
  }
  if (lastName) {
    db.users[index].lastName = lastName;
  }
  return res.status(responseCodes.noContent).json({});
});

/**
 * *********************** Categories ******************
 * Get all categories
 */
app.get('/categories', (req: Request, res: Response) => {
  const { categories } = db;
  return res.status(responseCodes.ok).json({
    categories,
  });
});

/**
 * Get category by id
 */
app.get('/categories/:id', (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  if (!id) {
    return res.status(responseCodes.badRequest).json({
      error: 'No valid id provided',
    });
  }
  const category = db.categories.find((element) => element.id === id);
  if (!category) {
    return res.status(responseCodes.badRequest).json({
      error: `No category found with id: ${id}`,
    });
  }
  return res.status(responseCodes.ok).json({
    category,
  });
});

/**
 * Remove category by id
 */
app.delete('/categories/:id', (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  if (!id) {
    return res.status(responseCodes.badRequest).json({
      error: 'No valid id provided',
    });
  }
  const index = db.categories.findIndex((element) => element.id === id);
  if (index < 0) {
    return res.status(responseCodes.badRequest).json({
      message: `Category not found with id: ${id}`,
    });
  }
  db.categories.splice(index, 1);
  return res.status(responseCodes.noContent).json({});
});

/**
 * Create category
 */
app.post('/categories', (req: Request, res: Response) => {
  const { name, createdBy } = req.body;
  if (!name) {
    return res.status(responseCodes.badRequest).json({
      error: 'Category name is required',
    });
  }
  if (!createdBy) {
    return res.status(responseCodes.badRequest).json({
      error: 'Created by id is required',
    });
  }
  const id = db.users.length + 1;
  db.categories.push({
    id,
    name,
    createdBy,
  });
  return res.status(responseCodes.created).json({
    id,
  });
});

/**
 * Update category
 */
app.patch('/categories/:id', (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  const { name } = req.body;
  if (!name) {
    return res.status(responseCodes.badRequest).json({
      error: 'Nothing to update',
    });
  }
  const index = db.categories.findIndex((element) => element.id === id);
  if (index < 0) {
    return res.status(responseCodes.badRequest).json({
      error: `No category found with id: ${id}`,
    });
  }
  db.categories[index].name = name;
  return res.status(responseCodes.noContent).json({});
});

/**
 * *********************** Excuses ******************
 * Get excuses
 */
app.get('/excuses', (req: Request, res: Response) => {
  const { category } = req.query;
  const { excuses } = db;
  if (!category) {
    return res.status(responseCodes.ok).json({
      excuses,
    });
  }
  const foundCategory = db.categories.find((element) => element.name === category);
  if (!foundCategory) {
    return res.status(responseCodes.badRequest).json({
      error: `No ${category} found`,
    });
  }
  const excusesInCategory = excuses.filter((element) => element.category === foundCategory.id);
  if (!excusesInCategory || excusesInCategory.length < 1) {
    return res.status(responseCodes.badRequest).json({
      error: `No excuses found in ${category}`,
    });
  }
  return res.status(responseCodes.ok).json({
    excuses: excusesInCategory,
  });
});
/**
 * Get random excuse
 */
app.get('/excuses/random', (req: Request, res: Response) => {
  const random = Math.round(Math.random() * (db.excuses.length - 1));
  const excuse: Excuse = db.excuses[random];
  return res.status(responseCodes.ok).json({
    excuse,
  });
});

/**
 * Get excuse by id
 */
app.get('/excuses/:id', (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  if (!id) {
    return res.status(responseCodes.badRequest).json({
      error: 'No valid id provided',
    });
  }
  const excuse = db.excuses.find((element) => element.id === id);
  if (!excuse) {
    return res.status(responseCodes.badRequest).json({
      error: `No excuse found with id: ${id}`,
    });
  }
  return res.status(responseCodes.ok).json({
    excuse,
  });
});

/**
 * Remove excuse by id
 */
app.delete('/excuses/:id', (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  if (!id) {
    return res.status(responseCodes.badRequest).json({
      error: 'No valid id provided',
    });
  }
  const index = db.excuses.findIndex((element) => element.id === id);
  if (index < 0) {
    return res.status(responseCodes.badRequest).json({
      message: `Excuse not found with id: ${id}`,
    });
  }
  db.excuses.splice(index, 1);
  return res.status(responseCodes.noContent).json({});
});

/**
 * Create excuse
 */
app.post('/excuses', (req: Request, res: Response) => {
  const {
    description,
    createdBy,
    category,
    visibility,
  } = req.body;

  if (!description) {
    return res.status(responseCodes.badRequest).json({
      error: 'Excuse description is required',
    });
  }
  if (!createdBy) {
    return res.status(responseCodes.badRequest).json({
      error: 'Created by id is required',
    });
  }
  if (!category) {
    return res.status(responseCodes.badRequest).json({
      error: 'Category id is required',
    });
  }
  if (!visibility) {
    return res.status(responseCodes.badRequest).json({
      error: 'Visibility is required',
    });
  }
  const id = db.excuses.length + 1;
  const excuse: Excuse = {
    id,
    description,
    createdBy,
    category,
    visibility,
  };
  db.excuses.push(excuse);
  return res.status(responseCodes.created).json({
    id,
  });
});

/**
 * Update excuse
 */
app.patch('/excuses/:id', (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id, 10);
  const { description, category, visibility } = req.body;
  if (!description && !category && !visibility) {
    return res.status(responseCodes.badRequest).json({
      error: 'Nothing to update',
    });
  }
  const index = db.excuses.findIndex((element) => element.id === id);
  if (index < 0) {
    return res.status(responseCodes.badRequest).json({
      error: `No excuse found with id: ${id}`,
    });
  }
  if (description) {
    db.excuses[index].description = description;
  }
  if (category) {
    db.excuses[index].category = category;
  }
  if (visibility) {
    db.excuses[index].visibility = visibility;
  }

  return res.status(responseCodes.noContent).json({});
});

/**
 * Start listening
 */
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port: ${port}`);
});
