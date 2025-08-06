import React from "react"
import FileUpload from "@/components/molecules/FileUpload"
import ImagePreview from "@/components/molecules/ImagePreview"
import { Card } from "@/components/atoms/Card"

const UploadSection = ({ uploadedImage, onFileSelect, onRemoveImage }) => {
  return (
    <div className="space-y-6">
      {!uploadedImage ? (
        <FileUpload onFileSelect={onFileSelect} />
      ) : (
        <div className="space-y-4">
          <ImagePreview 
            image={uploadedImage} 
            onRemove={onRemoveImage}
          />
        </div>
      )}
    </div>
  )
}

export default UploadSection