import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"
import AnalysisScore from "@/components/molecules/AnalysisScore"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import Button from "@/components/atoms/Button"
import { toast } from "react-toastify"
import analysisService from "@/services/api/analysisService"
import pdfService from "@/services/api/pdfService"

const AnalysisResults = ({ analysisResult, isAnalyzing, imageData }) => {
// Remove the loading state handling since it's now handled by ProgressIndicator
  if (isAnalyzing) {
    return null
  }

  if (!analysisResult) return null

const [isExporting, setIsExporting] = useState(false)
  const [isSharing, setIsSharing] = useState(false)

  const handleExportPDF = async () => {
    if (!analysisResult || !imageData) {
      toast.error("Unable to export - missing analysis or image data")
      return
    }

    setIsExporting(true)
    try {
      await pdfService.generateAnalysisReport(analysisResult, imageData)
      toast.success("PDF report exported successfully!")
    } catch (error) {
      console.error("PDF export error:", error)
      toast.error("Failed to export PDF report")
    } finally {
      setIsExporting(false)
    }
  }

  const handleShareAnalysis = async () => {
    if (!analysisResult) {
      toast.error("No analysis to share")
      return
    }

    setIsSharing(true)
    try {
      const shareUrl = await analysisService.generateShareUrl(analysisResult, imageData)
      
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl)
        toast.success("Shareable link copied to clipboard!")
      } else {
        // Fallback for non-secure contexts
        const textArea = document.createElement('textarea')
        textArea.value = shareUrl
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        toast.success("Shareable link copied to clipboard!")
      }
    } catch (error) {
      console.error("Share analysis error:", error)
      toast.error("Failed to generate shareable link")
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <div className="space-y-6 analysis-card">
      {/* Overall Score */}
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Analysis Complete</CardTitle>
          <div className="flex justify-center">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-3 relative">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <span className="text-3xl font-bold text-white">{analysisResult.overallScore}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">Overall Creative Score</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button
          onClick={handleExportPDF}
          disabled={isExporting}
          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ApperIcon 
            name={isExporting ? "Loader2" : "Download"} 
            size={16} 
            className={isExporting ? "animate-spin" : ""} 
          />
          <span>{isExporting ? "Exporting..." : "Export PDF"}</span>
        </Button>
        
        <Button
          onClick={handleShareAnalysis}
          disabled={isSharing}
          className="flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ApperIcon 
            name={isSharing ? "Loader2" : "Share2"} 
            size={16} 
            className={isSharing ? "animate-spin" : ""} 
          />
          <span>{isSharing ? "Generating Link..." : "Share Analysis"}</span>
        </Button>
      </div>

      {/* Detailed Scores */}
      <div className="grid gap-4 md:grid-cols-3">
        <AnalysisScore
          title="Visual Impact"
          score={analysisResult.visualImpact}
          description="How eye-catching and memorable your creative appears to viewers"
          color="purple"
        />
        <AnalysisScore
          title="Message Clarity"
          score={analysisResult.messageClarity}
          description="How clear and compelling your advertising message is"
          color="blue"
        />
        <AnalysisScore
          title="Brand Recognition"
          score={85}
          description="How well your brand elements stand out and create recognition"
          color="green"
        />
      </div>

      {/* Target Audience */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="Users" size={20} className="text-purple-600" />
            <span>Target Audience</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {analysisResult.targetAudience.map((audience, index) => (
              <Badge key={index} variant="default">
                {audience}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Optimization Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="Lightbulb" size={20} className="text-amber-500" />
            <span>Optimization Suggestions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysisResult.suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-xs font-semibold text-amber-600">{index + 1}</span>
                </div>
                <p className="text-sm text-gray-700 flex-1">{suggestion}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Timestamp */}
      <Card className="bg-gray-50">
        <CardContent className="py-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Analysis completed at {new Date(analysisResult.analyzedAt).toLocaleString()}</span>
            <Badge variant="success" className="flex items-center space-x-1">
              <ApperIcon name="CheckCircle" size={12} />
              <span>Complete</span>
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AnalysisResults