import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { toast } from "react-toastify";
import pdfService from "@/services/api/pdfService";
import analysisService from "@/services/api/analysisService";
import ApperIcon from "@/components/ApperIcon";
import AnalysisScore from "@/components/molecules/AnalysisScore";
import Error from "@/components/ui/Error";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const AnalysisResults = ({ analysisResult, isAnalyzing, imageData }) => {
  const [isExporting, setIsExporting] = useState(false)
  const [isSharing, setIsSharing] = useState(false)

  // Remove the loading state handling since it's now handled by ProgressIndicator
  if (isAnalyzing) {
    return null
  }

  if (!analysisResult) return null
const handleExportPDF = async () => {
    // Enhanced validation with specific error messages
    if (!analysisResult) {
      toast.error("Unable to export - no analysis data available. Please run an analysis first.")
      return
    }

    // Check for required analysis data fields
    if (!analysisResult.Id) {
      toast.error("Unable to export - analysis data is incomplete (missing ID)")
      return
    }

    if (!analysisResult.overallScore && analysisResult.overallScore !== 0) {
      toast.error("Unable to export - analysis data is incomplete (missing overall score)")
      return
    }

    // Log what data we have for debugging
    console.log("Export validation:", {
      hasAnalysisResult: !!analysisResult,
      analysisId: analysisResult?.Id,
      hasImageData: !!imageData,
      imageUrl: imageData?.url ? "present" : "missing"
    })

    setIsExporting(true)
    try {
      // Image data is now optional - PDF service will handle missing images gracefully
      await pdfService.generateAnalysisReport(analysisResult, imageData);
      toast.success("PDF report exported successfully!")
    } catch (error) {
      console.error("PDF export error:", error)
      
      // Show specific error message to user
      const errorMessage = error.message || "Failed to export PDF report"
      toast.error(errorMessage, { autoClose: 5000 })
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
      
      // Try modern clipboard API with permission check
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(shareUrl)
          toast.success("Shareable link copied to clipboard!")
          return
        } catch (clipboardError) {
          console.warn("Clipboard API failed:", clipboardError)
          // Fall through to next method
        }
      }
      
      // Try Web Share API if available (mobile-friendly)
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Ad Analysis Result',
            text: 'Check out this ad analysis result',
            url: shareUrl
          })
          toast.success("Share dialog opened!")
          return
        } catch (shareError) {
          if (shareError.name !== 'AbortError') {
            console.warn("Share API failed:", shareError)
          }
          // Fall through to manual copy
        }
      }
      
      // Fallback: Create a temporary input for manual selection
      const textArea = document.createElement('textarea')
      textArea.value = shareUrl
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      try {
        const successful = document.execCommand('copy')
        if (successful) {
          toast.success("Shareable link copied to clipboard!")
        } else {
          throw new Error('Copy command failed')
        }
      } catch (copyError) {
        console.warn("Manual copy failed:", copyError)
        // Show the URL to user for manual copying
        toast.info(
          `Please copy this link manually: ${shareUrl.length > 50 ? shareUrl.substring(0, 50) + '...' : shareUrl}`,
          { autoClose: 10000 }
        )
      } finally {
        document.body.removeChild(textArea)
      }
      
    } catch (error) {
      console.error("Share analysis error:", error)
      toast.error("Failed to generate shareable link. Please try again.")
    } finally {
      setIsSharing(false)
    }
  }

const getScoreClassification = (score) => {
    if (score >= 91) return { label: "Excellent", color: "text-green-600", bgColor: "bg-green-50" }
    if (score >= 61) return { label: "Good", color: "text-blue-600", bgColor: "bg-blue-50" }
    if (score >= 31) return { label: "Average", color: "text-yellow-600", bgColor: "bg-yellow-50" }
    return { label: "Below Average", color: "text-red-600", bgColor: "bg-red-50" }
  }

  const scoreClass = getScoreClassification(analysisResult.overallScore)

  return (
    <div className="space-y-6 analysis-card">
      {/* Real Estate Ad Creative Analysis Header */}
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            🎯 Real Estate Ad Creative Analysis
          </CardTitle>
          <div className="w-24 h-24 mx-auto mb-4">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-3xl font-bold text-white">{analysisResult.overallScore}</span>
            </div>
          </div>
          <Badge className={`${scoreClass.color} ${scoreClass.bgColor} border-0`}>
            {scoreClass.label} ({analysisResult.overallScore} out of 100)
          </Badge>
        </CardHeader>
      </Card>

{/* Strategic Objective Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-xl">
            <ApperIcon name="Target" size={22} className="text-purple-600" />
            <span>🎯 Strategic Objective</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">1. Visual Summary:</h4>
            <p className="text-gray-700 bg-purple-50 p-3 rounded-lg">{analysisResult.visualSummary}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">2. Purpose:</h4>
            <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">{analysisResult.purpose}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">3. Target Audience:</h4>
            <div className="flex flex-wrap gap-2">
              {analysisResult.targetAudience?.map((audience, index) => (
                <Badge key={index} variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                  {audience}
                </Badge>
              )) || (
                <p className="text-gray-500 italic">No target audience data available</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Visual Analysis Summary Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-xl">
            <ApperIcon name="BarChart3" size={22} className="text-blue-600" />
            <span>🖼️ Visual Analysis Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              1. Total Score: ({analysisResult.overallScore} out of 100) and Classify it as 
              <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${scoreClass.bgColor} ${scoreClass.color}`}>
                {scoreClass.label} ({analysisResult.overallScore >= 91 ? '91 to 100' : 
                 analysisResult.overallScore >= 61 ? '61 to 90' : 
                 analysisResult.overallScore >= 31 ? '31 to 60' : '1 to 30'})
              </span>
            </h4>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">2. Overall Strength:</h4>
            <p className="text-gray-700 bg-amber-50 p-3 rounded-lg">{analysisResult.overallStrength}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">3. Overall Recommendations: Each point should mention how much score it will increase (i.e. +10, +20, +35)</h4>
            <div className="space-y-2">
              {analysisResult.recommendationsWithScores?.map((recommendation, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-semibold text-green-600">{index + 1}</span>
                  </div>
                  <p className="text-sm text-gray-700 flex-1">{recommendation}</p>
                </div>
              )) || (
                <p className="text-gray-500 italic">No specific recommendations available</p>
              )}
            </div>
          </div>
        </CardContent>
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
          score={analysisResult.brandRecognition}
          description="How well your brand elements stand out and create recognition"
          color="green"
        />
      </div>

      {/* Additional Optimization Suggestions */}
      {analysisResult.suggestions && analysisResult.suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Lightbulb" size={20} className="text-amber-500" />
              <span>Additional Optimization Tips</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysisResult.suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-amber-50 rounded-lg">
                  <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-xs font-semibold text-amber-600">{index + 1}</span>
                  </div>
                  <p className="text-sm text-gray-700 flex-1">{suggestion}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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