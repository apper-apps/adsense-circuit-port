import React, { useRef, useState } from "react"
import { cn } from "@/utils/cn"
import ApperIcon from "@/components/ApperIcon"
import { toast } from "react-toastify"

const FileUpload = ({ onFileSelect, acceptedFormats = [".jpg", ".jpeg", ".png", ".gif", ".webp"], maxSize = 10 * 1024 * 1024 }) => {
  const fileInputRef = useRef(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const validateFile = (file) => {
    const fileExtension = "." + file.name.split(".").pop().toLowerCase()
    
    if (!acceptedFormats.includes(fileExtension)) {
      toast.error(`File format not supported. Please use: ${acceptedFormats.join(", ")}`)
      return false
    }
    
    if (file.size > maxSize) {
      toast.error(`File too large. Maximum size is ${Math.round(maxSize / (1024 * 1024))}MB`)
      return false
    }
    
    return true
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    const file = files[0]
    
    if (file && validateFile(file)) {
      onFileSelect(file)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file && validateFile(file)) {
      onFileSelect(file)
    }
  }

  return (
    <div
      className={cn(
        "upload-zone border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer transition-all duration-300",
        "hover:border-purple-400 hover:bg-purple-50/50",
        isDragOver && "drag-over border-purple-500 bg-purple-50"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300",
          isDragOver ? "bg-purple-500 text-white" : "bg-purple-100 text-purple-600"
        )}>
          <ApperIcon name="Upload" size={24} />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Drop your ad creative here
          </h3>
          <p className="text-gray-600">
            or <span className="text-purple-600 font-medium">browse files</span>
          </p>
        </div>
        
        <div className="text-sm text-gray-500 space-y-1">
          <p>Supports: JPG, PNG, GIF, WebP</p>
          <p>Max size: {Math.round(maxSize / (1024 * 1024))}MB</p>
        </div>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(",")}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}

export default FileUpload