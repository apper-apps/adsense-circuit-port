import React from "react"
import { Card, CardContent } from "@/components/atoms/Card"
import ApperIcon from "@/components/ApperIcon"

const ProgressIndicator = ({ step, message, progress }) => {
  const steps = [
    { id: 1, name: "Analyzing visual elements...", icon: "Eye" },
    { id: 2, name: "Processing copy and messaging...", icon: "Type" },
    { id: 3, name: "Evaluating brand recognition...", icon: "Award" },
    { id: 4, name: "Assessing target audience fit...", icon: "Users" },
    { id: 5, name: "Generating recommendations...", icon: "Lightbulb" },
    { id: 6, name: "Finalizing analysis...", icon: "CheckCircle" }
  ]

  const currentStep = steps[step] || steps[0]

  return (
    <Card className="analysis-card max-w-2xl mx-auto">
      <CardContent className="p-8">
        <div className="text-center space-y-6">
          {/* Main Status */}
          <div className="flex items-center justify-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <ApperIcon name={currentStep.icon} size={24} className="text-purple-600" />
              </div>
              <div className="absolute inset-0 w-12 h-12 border-4 border-purple-200 rounded-full animate-spin border-t-purple-500"></div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Analyzing Creative
              </h3>
              <p className="text-gray-600 text-sm">
                {message || currentStep.name}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full max-w-md mx-auto">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Steps Indicator */}
          <div className="flex justify-center space-x-2">
            {steps.map((stepItem, index) => (
              <div
                key={stepItem.id}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index <= step 
                    ? 'bg-purple-500' 
                    : index === step + 1 
                    ? 'bg-purple-300 animate-pulse' 
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Status Message */}
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-purple-800 text-sm font-medium">
              Our AI is carefully analyzing your creative to provide the most accurate insights and recommendations.
            </p>
            <div className="flex items-center justify-center mt-3 text-purple-600 text-xs">
              <ApperIcon name="Clock" size={14} className="mr-1" />
              This usually takes 30-60 seconds
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProgressIndicator