import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"
import AnalysisScore from "@/components/molecules/AnalysisScore"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"

const AnalysisResults = ({ analysisResult, isAnalyzing }) => {
  if (isAnalyzing) {
    return (
      <Card className="analysis-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Analyzing Creative...</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full shimmer"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded shimmer"></div>
                    <div className="h-3 bg-gray-100 rounded w-2/3 shimmer"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center py-4">
              <p className="text-gray-600 pulse-loader">
                Our AI is analyzing your creative for visual impact, messaging, and audience targeting...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!analysisResult) return null

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