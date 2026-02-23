import { defineMiddlewares } from "@medusajs/framework/http"
import multer from "multer"

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB per file
})

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/uploads",
      method: ["POST"],
      middlewares: [upload.array("files") as any],
    },
  ],
})
