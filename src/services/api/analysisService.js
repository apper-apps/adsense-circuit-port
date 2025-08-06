import analysisResultsData from "@/services/mockData/analysisResults.json"

class AnalysisService {
async analyzeImage(imageId, progressCallback = null) {
    const steps = [
      { message: "Analyzing visual elements...", duration: 500 },
      { message: "Processing copy and messaging...", duration: 800 },
      { message: "Evaluating brand recognition...", duration: 600 },
      { message: "Assessing target audience fit...", duration: 700 },
      { message: "Generating recommendations...", duration: 900 },
      { message: "Finalizing analysis...", duration: 400 }
    ]

    let totalProgress = 0
    const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0)

    try {
      // Simulate step-by-step analysis with progress updates
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i]
        
        if (progressCallback) {
          progressCallback({
            step: i,
            message: step.message,
            progress: Math.round((totalProgress / totalDuration) * 100)
          })
        }

        await new Promise(resolve => setTimeout(resolve, step.duration))
        totalProgress += step.duration
      }

      // Final progress update
      if (progressCallback) {
        progressCallback({
          step: steps.length - 1,
          message: "Analysis complete!",
          progress: 100
        })
      }

      // Generate a realistic analysis result
// Generate a realistic analysis result
      const baseResult = analysisResultsData[Math.floor(Math.random() * analysisResultsData.length)]
      
      // Create a new result with some randomization
      const result = {
        ...baseResult,
        Id: Date.now(),
        imageId: imageId,
        overallScore: this.generateScore(70, 95),
        visualImpact: this.generateScore(65, 98),
        messageClarity: this.generateScore(70, 95),
        brandRecognition: this.generateScore(60, 95),
        visualSummary: this.getRandomVisualSummary(),
        purpose: this.getRandomPurpose(),
        targetAudience: this.getRandomTargetAudience(),
        overallStrength: this.getRandomOverallStrength(),
        suggestions: this.getRandomSuggestions(),
        recommendationsWithScores: this.getRandomRecommendationsWithScores(),
analyzedAt: new Date().toISOString()
      }

      return result
    } catch (error) {
      throw new Error("Failed to analyze image")
    }
  }

  async saveAnalysis(analysisResult, imageData) {
    try {
      // Get existing saved analyses
      const existingAnalyses = JSON.parse(localStorage.getItem('savedAnalyses') || '[]')
      
      // Create saved analysis with image data
      const savedAnalysis = {
        ...analysisResult,
        imageName: imageData.name,
        imageUrl: imageData.url,
        imageSize: imageData.size,
        imageType: imageData.type,
        savedAt: new Date().toISOString()
      }
      
      // Add to beginning of array (most recent first)
      existingAnalyses.unshift(savedAnalysis)
      
      // Limit to 50 most recent analyses
      const limitedAnalyses = existingAnalyses.slice(0, 50)
      
      // Save to localStorage
      localStorage.setItem('savedAnalyses', JSON.stringify(limitedAnalyses))
      
      return savedAnalysis
    } catch (error) {
      console.error('Failed to save analysis:', error)
      throw new Error("Failed to save analysis")
    }
  }

  async getAnalysisHistory() {
    try {
      const savedAnalyses = JSON.parse(localStorage.getItem('savedAnalyses') || '[]')
      return savedAnalyses.sort((a, b) => new Date(b.analyzedAt) - new Date(a.analyzedAt))
    } catch (error) {
      console.error('Failed to load analysis history:', error)
      return []
    }
  }

  async deleteAnalysis(analysisId) {
    try {
      const existingAnalyses = JSON.parse(localStorage.getItem('savedAnalyses') || '[]')
      const filteredAnalyses = existingAnalyses.filter(analysis => analysis.Id !== analysisId)
      localStorage.setItem('savedAnalyses', JSON.stringify(filteredAnalyses))
      return filteredAnalyses
    } catch (error) {
      console.error('Failed to delete analysis:', error)
      throw new Error("Failed to delete analysis")
    }
  }
  
  generateScore(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
  
  getRandomTargetAudience() {
    const allAudiences = [
      "Young Adults (18-34)",
      "Tech Enthusiasts", 
      "Urban Professionals",
      "Social Media Users",
      "Business Professionals",
      "Decision Makers",
      "B2B Audience",
      "Enterprise Clients",
      "Millennials",
      "Eco-Conscious Consumers",
      "Lifestyle Enthusiasts",
      "Social Impact Oriented",
      "Gen Z Consumers",
      "Working Parents",
      "Health & Wellness Focused"
    ]
    
    // Return 3-5 random audiences
    const count = Math.floor(Math.random() * 3) + 3
    const shuffled = allAudiences.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }
  
getRandomSuggestions() {
    const allSuggestions = [
      "Consider increasing the contrast between your main text and background for better readability",
      "Your color palette effectively captures attention - maintain this vibrant approach in future creatives",
      "The call-to-action could be more prominent by increasing its size by 20-30%",
      "Adding a subtle shadow or glow effect to your brand logo would improve brand recognition",
      "Consider testing this creative with A/B variations focusing on different value propositions",
      "Enhance visual hierarchy by making the headline 25% larger",
      "Consider using a more dynamic background to increase visual interest",
      "Your messaging is clear and direct - excellent work on value proposition",
      "Try incorporating more brand colors to strengthen brand association",
      "Adding testimonials or social proof could boost credibility",
      "Outstanding visual composition - this creative should perform excellently",
      "Your brand elements are perfectly integrated and highly recognizable",
      "Consider creating variations of this high-performing creative for different platforms",
      "The emotional appeal is strong - maintain this approach in future campaigns",
      "Test different call-to-action wordings to optimize conversion rates",
      "Consider using more whitespace to improve visual breathing room",
      "Your typography choices are excellent and highly readable",
      "Try testing this creative across different device orientations",
      "The visual balance is well-executed between text and imagery",
      "Consider adding animated elements for social media versions"
    ]
    
    // Return 4-6 random suggestions
    const count = Math.floor(Math.random() * 3) + 4
    const shuffled = allSuggestions.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  getRandomVisualSummary() {
    const visualSummaries = [
      "Modern luxury apartment listing with professional photography showcasing spacious interiors and premium finishes",
      "Suburban family home advertisement featuring exterior shot with landscaped yard and traditional architectural style",
      "Premium commercial real estate investment opportunity showcasing modern office building with impressive architecture",
      "Cozy starter home with updated kitchen and bathrooms in established neighborhood",
      "Waterfront property featuring panoramic views and private dock access",
      "Historic downtown loft conversion with exposed brick and industrial design elements"
    ]
    
    return visualSummaries[Math.floor(Math.random() * visualSummaries.length)]
  }

  getRandomPurpose() {
    const purposes = [
      "Attract affluent buyers for high-end residential property in downtown core",
      "Market family-friendly property to middle-income households seeking suburban lifestyle",
      "Attract serious investors for high-value commercial property acquisition",
      "Generate interest from first-time homebuyers in affordable housing market",
      "Appeal to luxury lifestyle buyers seeking exclusive waterfront living",
      "Target young professionals looking for urban loft living experience"
    ]
    
    return purposes[Math.floor(Math.random() * purposes.length)]
  }

  getRandomOverallStrength() {
    const strengths = [
      "Excellent visual appeal with professional staging and lighting that effectively conveys luxury positioning",
      "Clear messaging with good property presentation, though visual impact could be enhanced",
      "Outstanding professional presentation with compelling investment metrics and premium positioning",
      "Strong emphasis on affordability and family-friendly features with clear value proposition",
      "Exceptional lifestyle imagery that captures the aspirational aspects of waterfront living",
      "Modern urban aesthetic with strong appeal to target demographic preferences"
    ]
    
    return strengths[Math.floor(Math.random() * strengths.length)]
  }

  getRandomRecommendationsWithScores() {
    const allRecommendations = [
      "Add neighborhood amenities showcase to increase buyer interest (+15 points)",
      "Include virtual tour QR code for enhanced engagement (+12 points)",
      "Highlight unique selling propositions more prominently (+18 points)",
      "Add social proof through recent sales data (+10 points)",
      "Improve photography with professional staging (+20 points)",
      "Add school district and safety ratings prominently (+15 points)",
      "Include family lifestyle imagery to connect emotionally (+12 points)",
      "Highlight financing options and affordability (+8 points)",
      "Add detailed ROI projections and cash flow analysis (+5 points)",
      "Include tenant occupancy rates and lease terms (+3 points)",
      "Highlight location advantages and growth potential (+2 points)",
      "Showcase property's investment potential with market data (+14 points)",
      "Add energy efficiency ratings and green features (+11 points)",
      "Include neighborhood walkability and transit scores (+9 points)"
    ]
    
    // Return 3-5 random recommendations
    const count = Math.floor(Math.random() * 3) + 3
    const shuffled = allRecommendations.sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  async generateShareUrl(analysisResult, imageData) {
    try {
      // Generate unique share ID
      const shareId = `share_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Create shareable data
      const shareData = {
        Id: shareId,
        analysisResult: analysisResult,
        imageData: imageData,
        sharedAt: new Date().toISOString(),
        accessCount: 0
      }
      
      // Store in localStorage (in production, this would be sent to a backend)
      const existingShares = JSON.parse(localStorage.getItem('sharedAnalyses') || '{}')
      existingShares[shareId] = shareData
      localStorage.setItem('sharedAnalyses', JSON.stringify(existingShares))
      
      // Generate shareable URL
      const baseUrl = window.location.origin
      const shareUrl = `${baseUrl}/shared/${shareId}`
      
      return shareUrl
    } catch (error) {
      console.error('Failed to generate share URL:', error)
      throw new Error("Failed to generate shareable link")
    }
  }

  async getSharedAnalysis(shareId) {
    try {
      const existingShares = JSON.parse(localStorage.getItem('sharedAnalyses') || '{}')
      const shareData = existingShares[shareId]
      
      if (!shareData) {
        throw new Error("Shared analysis not found")
      }
      
      // Increment access count
      shareData.accessCount = (shareData.accessCount || 0) + 1
      existingShares[shareId] = shareData
      localStorage.setItem('sharedAnalyses', JSON.stringify(existingShares))
      
      return shareData
    } catch (error) {
      console.error('Failed to get shared analysis:', error)
      throw new Error("Failed to load shared analysis")
    }
  }
}

export default new AnalysisService()