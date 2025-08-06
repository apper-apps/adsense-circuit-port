import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import ApperIcon from "@/components/ApperIcon"
import { formatDistanceToNow, format } from "date-fns"

const AnalysisHistory = ({ isOpen, onClose, analyses, onViewAnalysis }) => {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffInHours = (now - date) / (1000 * 60 * 60)
      
      if (diffInHours < 24) {
        return formatDistanceToNow(date, { addSuffix: true })
      } else {
        return format(date, 'MMM d, yyyy')
      }
    } catch (error) {
      return 'Unknown date'
    }
  }

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadgeVariant = (score) => {
    if (score >= 85) return 'success'
    if (score >= 70) return 'warning'
    return 'error'
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-20 z-30 lg:hidden"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-40 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <ApperIcon name="History" size={20} className="mr-2" />
                Analysis History
              </h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ApperIcon name="X" size={20} className="text-gray-500" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {analyses.length} saved {analyses.length === 1 ? 'analysis' : 'analyses'}
            </p>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {analyses.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center p-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ApperIcon name="FileText" size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No analyses yet</h3>
                <p className="text-gray-600 text-sm">
                  Upload and analyze your first creative to see it appear here.
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {analyses.map((analysis) => (
                  <Card 
                    key={analysis.Id}
                    className="cursor-pointer hover:shadow-md transition-shadow duration-200 analysis-history-item"
                    onClick={() => onViewAnalysis(analysis)}
                  >
                    <CardContent className="p-4">
                      <div className="flex space-x-3">
                        {/* Thumbnail */}
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                          {analysis.imageUrl ? (
                            <img 
                              src={analysis.imageUrl} 
                              alt={analysis.imageName || 'Analysis'}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ApperIcon name="Image" size={20} className="text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {analysis.imageName || `Analysis #${analysis.Id}`}
                            </h4>
                            <Badge 
                              variant={getScoreBadgeVariant(analysis.overallScore)}
                              className="ml-2 flex-shrink-0"
                            >
                              {analysis.overallScore}
                            </Badge>
                          </div>
                          
                          <p className="text-xs text-gray-500 mb-2">
                            {formatDate(analysis.analyzedAt)}
                          </p>

                          <div className="flex items-center space-x-4 text-xs text-gray-600">
                            <div className="flex items-center">
                              <ApperIcon name="Eye" size={12} className="mr-1" />
                              <span>{analysis.visualImpact}</span>
                            </div>
                            <div className="flex items-center">
                              <ApperIcon name="MessageSquare" size={12} className="mr-1" />
                              <span>{analysis.messageClarity}</span>
                            </div>
                            <div className="flex items-center">
                              <ApperIcon name="Award" size={12} className="mr-1" />
                              <span>{analysis.brandRecognition}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Hover Indicator */}
                      <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                        <span>{analysis.suggestions?.length || 0} suggestions</span>
                        <div className="flex items-center">
                          <span>Click to view</span>
                          <ApperIcon name="ChevronRight" size={12} className="ml-1" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default AnalysisHistory