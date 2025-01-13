// Import Express and some of its types.
import express, { Express, Request, Response } from "express";

// Create the Express application.
const app: Express = express();

// Tell Express to parse request bodies as JSON.
app.use(express.json());

interface Snippet {
  id: number;
  language: string;
  code: string;
}

const snippets: Snippet[] = [
  {
    id: 1,
    language: "Python",
    code: "print('Hello, World!')",
  },
  {
    id: 2,
    language: "Python",
    code: "def add(a, b):\n    return a + b",
  },
  {
    id: 3,
    language: "Python",
    code: "class Circle:\n    def __init__(self, radius):\n        self.radius = radius\n\n    def area(self):\n        return 3.14 * self.radius ** 2",
  },
  {
    id: 4,
    language: "JavaScript",
    code: "console.log('Hello, World!');",
  },
  {
    id: 5,
    language: "JavaScript",
    code: "function multiply(a, b) {\n    return a * b;\n}",
  },
  {
    id: 6,
    language: "JavaScript",
    code: "const square = num =\u003E num * num;",
  },
  {
    id: 7,
    language: "Java",
    code: 'public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
  },
  {
    id: 8,
    language: "Java",
    code: "public class Rectangle {\n    private int width;\n    private int height;\n\n    public Rectangle(int width, int height) {\n        this.width = width;\n        this.height = height;\n    }\n\n    public int getArea() {\n        return width * height;\n    }\n}",
  },
];

// GET /snippets
app.get("/snippets", (req: Request, res: Response): void => {
  // Bonus: Filter the snippets by language if someone adds a query parameter,
  // e.g. /snippets?lang=python.
  try {
    const lang = req.query.lang as string;
    const filtered = snippets.filter(function (item) {
      if (lang) {
        return item.language.toLowerCase() === lang.toLowerCase();
      } else {
        return item;
      }
    });
    res.status(200).json(filtered);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch snippets" });
  }
});

// GET /snippets/:id
// app.get("/snippets/:id", (req: Request, res: Response): void => {
//   try {
//     const filtered = snippets.filter(function (item, idx) {
//       return idx + 1 === Number(req.params.id);
//     });
//     if (filtered.length > 0) {
//       res.status(200).json(filtered);
//     } else {
//       res.status(404).json({ error: "Snippet not found" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch snippet" });
//   }
// });

// GET /snippets/:id with improvements
app.get("/snippets/:id", (req: Request, res: Response): void => {
  try {
    const snippet = snippets.find(function (item) {
      return item.id === Number(req.params.id);
    });
    if (snippet) {
      res.status(200).json(snippet);
    } else {
      res.status(404).json({ error: "Snippet not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch snippet" });
  }
});

// POST /snippets
// app.post("/snippets", (req: Request, res: Response): void => {
//   try {
//     // Create a new snippet with the request body.
//     const { id, language, code } = req.body;
//     // Add the new snippet to the end of the `snippets` array.
//     snippets.push({ id, language, code });
//     // Send a 201 Created response with the new snippet as the body.
//     res.status(201).json(snippets.at(-1));
//   } catch (error) {
//     res.status(500).json({ error: "Failed to add new snippet" });
//   }
// });

function findLargestId(array: Snippet[]) {
  let number = 0;
  for (let i = 0; i < array.length; i++) {
    if (array[i].id > number) {
      number = array[i].id;
    }
  }
  return number;
}

// POST /snippets with improvements
app.post("/snippets", (req: Request, res: Response): void => {
  try {
    // Create a new snippet with the request body.
    const { language, code } = req.body;
    const nextId = findLargestId(snippets) + 1;
    // Add the new snippet to the end of the `snippets` array.
    snippets.push({ id: nextId, language, code });
    // Send a 201 Created response with the new snippet as the body.
    res.status(201).json(snippets.at(-1));
  } catch (error) {
    res.status(500).json({ error: "Failed to add new snippet" });
  }
});

// DELETE /snippets/:id
app.delete("/snippets/:id", (req: Request, res: Response): void => {
  // Find the index of the snippet we want to delete.
  const index = snippets.findIndex(function (snippet) {
    return snippet.id === Number(req.params.id);
  });

  // If the snippet can't be found, send a 404 Not Found response.
  // Otherwise, delete it and send a 204 No Content response.
  if (index === -1) {
    res.status(404).json({ error: "Snippet not found" });
  } else {
    snippets.splice(index, 1);
    res.status(204).send();
  }
});

const port: number = 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
