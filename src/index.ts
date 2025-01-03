import express, { Request, Response, ErrorRequestHandler } from "express";
import cors, { CorsOptions } from "cors";
import { v4 as uuidv4 } from "uuid";
import {
  ConfigRequest,
  ConfigCorsOptions,
  ConfigPromptRafAi,
} from "./utils/middleware.js";
import RafAi from "./utils/RafAi.js";
import {
  AuthorizationSchema,
  DbName as AuthorizationDbName,
} from "./schema/authorization.js";
import db from "./database/db.js";
db.connect();

const app: any = express();
const port: number | string = process.env.PORT || 3000;

app.use(cors(ConfigCorsOptions() as CorsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(ConfigRequest);

interface CostumRequest extends Request {
  token?: string;
}

app.post("/api/rafai", async (req: CostumRequest, res: Response) => {
  try {
    const { text, session = uuidv4() } = req.body;
    const token = req.token as any;

    if (!text) return res.status(400).json({ message: "Text is required" });

    const message = await RafAi(text, {
      session,
      prompt: await ConfigPromptRafAi(),
    });
    const response = {
      creator: "Rafly",
      status: true,
      method: "POST",
      data: message,
    };

    res.status(200).json(response);
    const authorization = new db(AuthorizationDbName, AuthorizationSchema);

    if (!token.unlimited) {
      if (token.limit <= 0)
        return res.status(401).json({ message: "Telah mencapai limit" });

      const limit = token.limit - 1;
      await authorization.updateOne({ token: token.token }, { limit });
    }
  } catch (error) {
    console.log(error);
  }
});

app.use((err: Error, req: Request, res: Response, next: Function) => {
  if (err.message === "Not allowed by CORS") {
    res.status(403).json({ error: "Origin not allowed" });
  } else {
    next(err);
  }
});

app.listen(port, () => {
  console.log(`Running app listening on port http://localhost:${port}`);
});
