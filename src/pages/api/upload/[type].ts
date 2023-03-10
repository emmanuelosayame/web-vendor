import type { NextApiRequest, NextApiResponse } from "next";
import { getServerAuthSession } from "src/server/auth";
import { uploadAsset } from "src/server/functions/assetUpload";
import { uploadProduct } from "src/server/functions/productUpload";

interface TNextApiRequest extends NextApiRequest {
  query: {
    type: string | string[];
    id: string | string[];
  };
}

export default async function handler(
  req: TNextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerAuthSession({ req, res });
  if (session && session.user) {
    if (req.method === "PUT") {
      const type = req.query.type?.toString() || "product";

      switch (type) {
        case "product": {
          await uploadProduct({ req, res });
        }
        case "asset": {
          await uploadAsset({ req, res });
        }
      }
    } else res.status(500).json("invalid request");
  } else res.status(400).json("unauthenticated");
}

export const config = {
  api: {
    bodyParser: false,
  },
};
