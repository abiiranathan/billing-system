const http = require("http");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const morgan = require("morgan");

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(express.static(path.resolve("frontend", "dist")));

const prisma = new PrismaClient();

app.get("/api/drugs", async (req, res) => {
  const pageSize = 10;
  const count = await prisma.drug.count();
  const pages = Math.round(count / pageSize);

  const currentPage = parseInt(req.query.page) || 1;
  const skip = Math.min(Math.max(currentPage - 1, 0), pages) * pageSize;

  const results = await prisma.drug.findMany({
    skip: skip,
    take: pageSize,
    where: {
      name: {
        contains: req.query.name || "",
        mode: "insensitive",
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  res.json({
    results,
    pages,
    count,
    next: currentPage < pages,
    prev: currentPage > 1,
    page: currentPage,
  });
});

app.get("/api/lab", async (req, res) => {
  const tests = await prisma.investigation.findMany({
    where: {
      name: {
        contains: req.query.name || "",
        mode: "insensitive",
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  res.json(tests);
});

app.get("/api/services", async (req, res) => {
  const services = await prisma.service.findMany({
    where: {
      name: {
        contains: req.query.name || "",
        mode: "insensitive",
      },
    },
    orderBy: {
      name: "asc",
    },
  });
  res.json(services);
});

app.get("/api/consumables", async (req, res) => {
  const consumables = await prisma.consumable.findMany({
    where: {
      name: {
        contains: req.query.name || "",
        mode: "insensitive",
      },
    },
    orderBy: {
      name: "asc",
    },
  });
  res.json(consumables);
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      username,
      password,
    },
  });

  if (user) {
    const payload = { id: user.id };
    const token = jwt.sign(payload, process.env.TOKEN, { expiresIn: "1 day" });

    res.json({
      user,
      token,
    });
  } else {
    res.status(401).json("Invalid login credentials");
  }
});

app.get("/api/user", async (req, res) => {
  // Parse the token from header
  const authorization = req.headers.authorization;
  if (!authorization) return res.status(403).json("Forbidden");
  const [tokenPrefix, token] = authorization.split(" ");

  if (tokenPrefix !== "Bearer") return res.status(403).json("Invalid token prefix");
  if (!token) return res.status(403).json("Invalid token!");

  jwt.verify(token, process.env.TOKEN, async (err, payload) => {
    if (err) return res.status(403).json("Expired token");

    const user = await prisma.user.findFirst({
      where: {
        id: payload.id,
      },
    });
    res.json(user);
  });
});

app.get("*", (req, res) => {
  const index = path.resolve("frontend", "dist", "index.html");
  res.sendFile(index);
});

const startServer = async () => {
  const PORT = process.env.PORT || 5000;
  server.listen(5000, () => console.log(`Server listening on port ${PORT}`));
};

startServer();
