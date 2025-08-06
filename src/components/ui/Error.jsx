import React from "react"
import { Card, CardContent } from "@/components/atoms/Card"
import Button from "@/components/atoms/Button"
import ApperIcon from "@/components/ApperIcon"

const Error = ({ message = "Something went wrong", onRetry, className = "" }) => {
  return (
    <Card className={`border-red-200 bg-red-50 ${className}`}>
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertCircle" size={24} className="text-red-600" />
        </div>
        
        <h3 className="text-lg font-semibold text-red-900 mb-2">
          Analysis Failed
        </h3>
        
        <p className="text-red-700 mb-6">
          {message}
        </p>
        
        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
            <ApperIcon name="RefreshCw" size={16} className="mr-2" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export default Error