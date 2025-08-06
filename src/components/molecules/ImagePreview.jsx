import React from "react"
import { Card, CardContent } from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"

const ImagePreview = ({ image, onRemove }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <Card className="image-preview overflow-hidden">
      <div className="relative">
        <img
          src={image.url}
          alt={image.name}
          className="w-full h-64 object-cover"
        />
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <ApperIcon name="X" size={16} className="text-gray-600" />
        </button>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 truncate">{image.name}</h4>
            <p className="text-sm text-gray-500 mt-1">
              {formatFileSize(image.size)} • {image.type.split("/")[1].toUpperCase()}
            </p>
          </div>
          <Badge variant="success" className="ml-2">
            Ready
          </Badge>
        </div>
        
        <div className="mt-3 text-xs text-gray-400">
          Uploaded {new Date(image.uploadedAt).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  )
}

export default ImagePreview