import * as dotenv from "dotenv";
dotenv.config();

import * as bcrypt from "bcryptjs";

// Import Express and some of its types.
import express, { Express, Request, Response } from "express";
// Import crypto module
import * as crypto from "crypto";
import { enc } from "crypto-js";

// declare encryption and decryption functions

const key = process.env.SNIPPET_ENCRYPT_KEY as string;
// console.log(key);

function encryptSymmetric(key: string, plaintext: string) {
  const iv = crypto.randomBytes(12).toString("base64");
  const cipher = crypto.createCipheriv(
    "aes-256-gcm",
    Buffer.from(key, "base64"),
    Buffer.from(iv, "base64")
  );
  let ciphertext = cipher.update(plaintext, "utf8", "base64");
  ciphertext += cipher.final("base64");
  const tag = cipher.getAuthTag();
  return { ciphertext, iv, tag };
}

function decryptSymmetric(
  key: string,
  ciphertext: string,
  iv: string,
  tag: Buffer<ArrayBufferLike>
) {
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    Buffer.from(key, "base64"),
    Buffer.from(iv, "base64")
  );

  decipher.setAuthTag(tag);

  let plaintext = decipher.update(ciphertext, "base64", "utf8");
  plaintext += decipher.final("utf8");

  return plaintext;
}

const { ciphertext, iv, tag } = encryptSymmetric(key, "Lauren");
console.log(decryptSymmetric(key, ciphertext, iv, tag));

// Create the Express application.
const app: Express = express();

// Tell Express to parse request bodies as JSON.
app.use(express.json());

interface CodeInfo {
  ciphertext: string;
  iv: string;
  tag: Buffer<ArrayBufferLike>;
}

interface Snippet {
  id: number;
  language: string;
  code: CodeInfo;
}

interface User {
  id: number;
  email: string;
  password: string;
}

const users: User[] = [];

const snippets: Snippet[] = [
  {
    id: 1,
    language: "Python",
    code: {
      ciphertext: "jv5CJ5SfFZKmDPx0mdCTQGXdWY8T9Q==",
      iv: "V/xMS4d0C88/PrLn",
      tag: Buffer.from("43d069755512eaa2578d2f5c60c76dfe", "hex"),
    },
  },
  {
    id: 2,
    language: "Python",
    code: {
      ciphertext: "+ltgcL1qmPXBny/6gM3j2AdlRj3azp5aOc745hx3GA==",
      iv: "gL/uhDgR0mzbECV5",
      tag: Buffer.from("a1e356c6ee0d4e674180bb78fcbafbd5", "hex"),
    },
  },
  {
    id: 3,
    language: "Python",
    code: {
      ciphertext:
        "H+jMogOaCKZEB2eyb1oIeWxHD4yGJecXSa3FolClhXcaX9qqQ0dbwgtaf5b8j/7ALba1vO5O0FuDfHc10ZGqOodvMeYjdxcxLJ2cGr7oah7uaQsB9B/MKYYUxQDrswcfJeawOOMkDRKmR/RQnY8Qbj5Za/z32yXjOEc6uMCDejS1+WFVBoo=",
      iv: "S4Ot+Di9Z6z7HWyM",
      tag: Buffer.from("b8be8ba2371c7827bf067e7381ba4a36", "hex"),
    },
  },
  {
    id: 4,
    language: "JavaScript",
    code: {
      ciphertext: "Fwe+6AQBI+OkIGe3i/RrB+5AebIb4GVr+LdJCkY=",
      iv: "4AmlseWDvo8xinF2",
      tag: Buffer.from("c3179e2d90987fab07e5a761327d0597", "hex"),
    },
  },
  {
    id: 5,
    language: "JavaScript",
    code: {
      ciphertext:
        "rqQ2cmoxkgDNC5aau8axgzwWgwlekyFzBRgDVMRbOqFsr0IeWeKRoM0hmBt2",
      iv: "vb7o72KBMdUGmZBr",
      tag: Buffer.from("bdc8d28fa9842b9e1305614903b43ca6", "hex"),
    },
  },
  {
    id: 6,
    language: "JavaScript",
    code: {
      ciphertext: "WlLXkf9IfjSPmU1bHlDx2QjiJnb6TKOHQMLtkYAUL28=",
      iv: "cuvRhf9LSwmYeIa3",
      tag: Buffer.from("5fb54f34539dfc09fadd286903c06476", "hex"),
    },
  },
  {
    id: 7,
    language: "Java",
    code: {
      ciphertext:
        "4+SR/kiUkP6QV5S/pqHi3b78WZJ+mOz4FOWuqX3araJUHqxYSlWtDp0TB/8YDVGbU3rvTjUZBISrG6f+fKOrMzakDhTKqZPqhZgbSoQGtmiq58ELF+xqaGyXJNsJCkXGjaB/nLmyt1UkGtQ578temE3FoAvJqWDDLrdx",
      iv: "kJruf+9fQth9ICDk",
      tag: Buffer.from("57a6830f2eb9140b18e7b5acf210dd1d", "hex"),
    },
  },
  {
    id: 8,
    language: "Java",
    code: {
      ciphertext:
        "jH8IBMx+6jxsLi80KVUrWTOX/iUu7pDNph/ku9mVWXEaM2CJzkTz9zwrr2gqvZmeJIb0/wV4aXXaiCFDh1Z3dIppnKXo37erCGHmA/ADIAphlY0KZne6UCWtLJIImydymc8D2j+CGT6ULrs0NG2YDiKitV3F7fFia2SWY4vN61MdGwsA1P50/4Z6Bjq5z6OMxcGPXpEAm00ZDEOD4HJtFmFPHol5ySUr9v/7yWAoBy4xkhevrE8xw7oYDj2/96O2Rcnc2luA8Q7wQmUEZFF4+0MlCECuP7zokXuaI+joJnrPAQv0cDj7DdXnS7KKapoPWDDIeQwIB5my",
      iv: "g/8PbaEGuJHgmO6l",
      tag: Buffer.from("9c99b65799be86833495fc6c3c33e55c", "hex"),
    },
  },
];

// GET /snippets
app.get("/snippets", (req: Request, res: Response): void => {
  try {
    const lang = req.query.lang as string;
    const filtered = snippets.filter(function (item) {
      if (lang) {
        return item.language.toLowerCase() === lang.toLowerCase();
      } else {
        return item;
      }
    });
    console.log(filtered);
    const decryptSnips = filtered.map(function (snippet) {
      return {
        ...snippet,
        code: decryptSymmetric(
          key,
          snippet.code.ciphertext,
          snippet.code.iv,
          snippet.code.tag
        ),
      };
    });
    res.status(200).json(decryptSnips);
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
      const decryptSnip = {
        ...snippet,
        code: decryptSymmetric(
          key,
          snippet.code.ciphertext,
          snippet.code.iv,
          snippet.code.tag
        ),
      };
      res.status(200).json(decryptSnip);
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

function findLargestId(array: { id: number }[]) {
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
    const { language, code } = req.body;
    const nextId = findLargestId(snippets) + 1;
    const newSnip = { id: nextId, language, code };
    snippets.push({ id: nextId, language, code: encryptSymmetric(key, code) });
    res.status(201).json(newSnip);
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

  if (index === -1) {
    res.status(404).json({ error: "Snippet not found" });
  } else {
    snippets.splice(index, 1);
    res.status(204).send();
  }
});

//POST /users
app.post("/users", (req: Request, res: Response): void => {
  const { email, password } = req.body;
  const nextId = findLargestId(users) + 1;
  const newUser = {
    id: nextId,
    email,
    password: bcrypt.hashSync(password, 10),
  };
  users.push(newUser);
  console.log(users);
  res.status(201).json({ id: newUser.id, email: newUser.email });
});

//POST /login

app.post("/login", (req: Request, res: Response): void => {
  const { email, password } = req.body;
  const user = users.find(function (item) {
    return item.email === email;
  });
  if (!user) {
    res.status(404).json({ error: "user not found" });
  } else {
    res.status(200).send(bcrypt.compareSync(password, user.password));
  }
});

const port: number = 3000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
