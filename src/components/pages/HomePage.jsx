import React, { useState } from "react"
import Header from "@/components/organisms/Header"
import UploadSection from "@/components/organisms/UploadSection"
import AnalysisResults from "@/components/organisms/AnalysisResults"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"
import { toast } from "react-toastify"
import analysisService from "@/services/api/analysisService"

const HomePage = () => {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleFileSelect = (file) => {
    const imageUrl = URL.createObjectURL(file)
    const uploadedImageData = {
      id: Date.now().toString(),
      file: file,
      url: imageUrl,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date()
    }
    
    setUploadedImage(uploadedImageData)
    setAnalysisResult(null)
    toast.success("Image uploaded successfully!")
  }

  const handleRemoveImage = () => {
    if (uploadedImage?.url) {
      URL.revokeObjectURL(uploadedImage.url)
    }
    setUploadedImage(null)
    setAnalysisResult(null)
    toast.info("Image removed")
  }

  const handleAnalyze = async () => {
    if (!uploadedImage) {
      toast.error("Please upload an image first")
      return
    }

    setIsAnalyzing(true)
    try {
      const result = await analysisService.analyzeImage(uploadedImage.id)
      setAnalysisResult(result)
      toast.success("Analysis complete!")
    } catch (error) {
      toast.error("Analysis failed. Please try again.")
      console.error("Analysis error:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Analyze Your Ad Creatives
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Upload your advertising images and get instant AI-powered insights on visual impact, 
              messaging effectiveness, and audience targeting to optimize your campaigns.
            </p>
          </div>

          {/* Upload Section */}
          <UploadSection
            uploadedImage={uploadedImage}
            onFileSelect={handleFileSelect}
            onRemoveImage={handleRemoveImage}
          />

          {/* Analyze Button */}
          {uploadedImage && !analysisResult && (
            <div className="flex justify-center">
              <Button 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                size="lg"
                className="min-w-[200px]"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Zap" size={20} className="mr-2" />
                    Analyze Creative
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Analysis Results */}
          <AnalysisResults 
            analysisResult={analysisResult}
            isAnalyzing={isAnalyzing}
          />

          {/* New Analysis Button */}
          {analysisResult && !isAnalyzing && (
            <div className="flex justify-center pt-4">
              <Button 
                onClick={() => {
                  handleRemoveImage()
                  setAnalysisResult(null)
                }}
                variant="outline"
                size="lg"
              >
                <ApperIcon name="Plus" size={20} className="mr-2" />
                Analyze New Creative
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default HomePage