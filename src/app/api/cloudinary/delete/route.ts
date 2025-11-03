import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const { publicIds } = await req.json();
    // publicIds can be a string or array
    const ids = Array.isArray(publicIds) ? publicIds : [publicIds];

    if (ids.length === 0) {
      return new Response(JSON.stringify({ error: "Missing publicId(s)" }), {
        status: 400,
      });
    }

    const result = await cloudinary.api.delete_resources(ids, {
      invalidate: true,
    });

    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete image(s)" }),
      { status: 500 }
    );
  }
}
