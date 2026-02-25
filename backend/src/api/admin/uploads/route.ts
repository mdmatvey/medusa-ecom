import {
  AuthenticatedMedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { uploadFilesWorkflow } from "@medusajs/medusa/core-flows"
import { MedusaError } from "@medusajs/framework/utils"
import sharp from "sharp"

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/tiff",
  "image/bmp",
  "image/gif",
])

async function processFile(file: Express.Multer.File): Promise<{
  filename: string
  mimeType: string
  content: string
  access: "public"
}> {
  if (IMAGE_TYPES.has(file.mimetype.toLowerCase())) {
    const compressed = await sharp(file.buffer)
      .webp({ quality: 85 })
      .toBuffer()

    const basename = file.originalname.replace(/\.[^.]+$/, "")

    return {
      filename: `${basename}.webp`,
      mimeType: "image/webp",
      content: compressed.toString("base64"),
      access: "public",
    }
  }

  return {
    filename: file.originalname,
    mimeType: file.mimetype,
    content: file.buffer.toString("base64"),
    access: "public",
  }
}

export async function POST(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const files = req.files as Express.Multer.File[]

  if (!files?.length) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      "No files were uploaded"
    )
  }

  const processedFiles = await Promise.all(files.map(processFile))

  const { result } = await uploadFilesWorkflow(req.scope).run({
    input: { files: processedFiles },
  })

  res.status(200).json({ files: result })
}
