import { Request, Response, NextFunction } from "express";
import db from "../database/db.js";
import { UrlSchema, DbName as UrlDbName } from "../schema/url.js";
import {
  AuthorizationSchema,
  DbName as AuthorizationDbName,
} from "../schema/authorization.js";
import { PromptSchema, DbName as PromptDbName } from "../schema/prompt.js";

interface CostumRequest extends Request {
  token?: string;
}

const ConfigRequest = async (
  req: CostumRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.sendStatus(401);

    const authorization = new db(AuthorizationDbName, AuthorizationSchema);
    const data = await authorization.selectOne({ token });
    if (!data) return res.sendStatus(401);
    req.token = data;

    next();
  } catch (error) {
    console.log(error);
  }
};

const ConfigCorsOptions = async () => {
  interface CorsOptions {
    origin: (origin: string, callback: Function) => void;
    methods: string[];
  }

  const url = new db(UrlDbName, UrlSchema);
  const data = await url.selectMany();
  const urls = data.map((url) => url.url);

  const allowedOrigins: string[] = urls;

  const corsOptions: CorsOptions = {
    origin: (origin: string, callback: Function) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["POST"],
  };

  return corsOptions;
};

const ConfigPromptRafAi = async () => {
  try {
    const prompt = new db(PromptDbName, PromptSchema);
    const data = await prompt.selectMany();
    const prompts = data.map((prompt) => prompt.prompt);
    return `${prompts.join(
      "."
    )}.Anda harus menjawab dengan kata kata yang asyik dan seru`;
  } catch (error) {
    console.log(error);
    return "Anda assiten RafAI dan RafAi dibuat untuk membantu anda dalam menyelesaikan sebuah masalah";
  }
};

export { ConfigRequest, ConfigCorsOptions, ConfigPromptRafAi };
