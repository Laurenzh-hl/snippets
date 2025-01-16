import * as dotenv from "dotenv";
dotenv.config();

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

interface Snippet {
  id: number;
  language: string;
  code: string;
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

const temp = snippets.map(function (snippet) {
  return { ...snippet, code: encryptSymmetric(key, snippet.code as string) };
});
console.log(temp);
