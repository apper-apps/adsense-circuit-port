import analysisResultsData from "@/services/mockData/analysisResults.json"

class AnalysisService {
  async analyzeImage(imageId) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    try {
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
        targetAudience: this.getRandomTargetAudience(),
        suggestions: this.getRandomSuggestions(),
        analyzedAt: new Date().toISOString()
      }
      
      return result
    } catch (error) {
      throw new Error("Failed to analyze image")
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
}

export default new AnalysisService()