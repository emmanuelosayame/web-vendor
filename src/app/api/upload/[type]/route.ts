import { NextResponse } from "next/server";
import { getServerAuthSession } from "src/server/auth";
import { uploadAsset } from "src/server/f/assetUpload";
import { uploadProduct } from "src/server/f/productUpload";

export async function PUT(
  req: Request,
  { params }: { params: { type: string } }
) {
  const session = await getServerAuthSession();

  const res = NextResponse;

  //   if (session && session.user) {
  const type = params.type;

  switch (type) {
    case "product": {
      return await uploadProduct(req);
    }
    case "asset": {
      return await uploadAsset(req);
    }
  }
  //   } else return res.json("UNAUTHENTICATED", { status: 401 });
}

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
