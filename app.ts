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
  res.send(snippets);
});

// POST /snippets
app.post("/snippets", (req: Request, res: Response): void => {
  // Create a new snippet with the request body.
  // Add the new snippet to the end of the `snippets` array.
  // Send a 201 Created response with the new snippet as the body.
});

const port: number = 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
