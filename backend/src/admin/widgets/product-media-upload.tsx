import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Button, toast } from "@medusajs/ui"
import { useCallback, useRef, useState } from "react"

type Props = {
  data: {
    id: string
    images?: { url: string }[]
  }
}

const ProductMediaUploadWidget = ({ data }: Props) => {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(
    async (fileList: FileList) => {
      if (!fileList.length) return
      setUploading(true)

      try {
        const formData = new FormData()
        Array.from(fileList).forEach((f) => formData.append("files", f))

        const uploadRes = await fetch("/admin/uploads", {
          method: "POST",
          credentials: "include",
          body: formData,
        })

        if (!uploadRes.ok) {
          const err = await uploadRes.json().catch(() => ({}))
          throw new Error(err.message ?? "Upload failed")
        }

        const { files: uploaded } = await uploadRes.json()

        const existing = (data.images ?? []).map((img) => ({ url: img.url }))
        const added = (uploaded as { url: string }[]).map((f) => ({
          url: f.url,
        }))

        const updateRes = await fetch(`/admin/products/${data.id}`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ images: [...existing, ...added] }),
        })

        if (!updateRes.ok) {
          throw new Error("Images uploaded but failed to attach to product — copy URLs from the network tab")
        }

        toast.success(`${uploaded.length} image(s) uploaded and added to product`)
      } catch (err: any) {
        toast.error(err.message ?? "Upload error")
      } finally {
        setUploading(false)
        if (inputRef.current) inputRef.current.value = ""
      }
    },
    [data]
  )

  return (
    <Container>
      <Heading level="h2" className="mb-1">
        Upload Large Images
      </Heading>
      <Text size="small" className="text-ui-fg-subtle mb-4">
        No 1 MB limit — auto-compressed &amp; converted to WebP.
      </Text>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
      <Button
        variant="secondary"
        size="small"
        isLoading={uploading}
        onClick={() => inputRef.current?.click()}
      >
        Select images
      </Button>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.side.before",
})

export default ProductMediaUploadWidget
