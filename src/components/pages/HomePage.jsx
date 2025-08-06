import React, { useEffect, useState } from "react";
import ProgressIndicator from "@/components/ui/ProgressIndicator";
import AnalysisHistory from "@/components/organisms/AnalysisHistory";
import { toast } from "react-toastify";
import analysisService from "@/services/api/analysisService";
import ApperIcon from "@/components/ApperIcon";
import AnalysisResults from "@/components/organisms/AnalysisResults";
import Header from "@/components/organisms/Header";
import UploadSection from "@/components/organisms/UploadSection";
import Button from "@/components/atoms/Button";

const HomePage = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState({ step: 0, message: '', progress: 0 });
const [showHistory, setShowHistory] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState([]);

  useEffect(() => {
    loadAnalysisHistory();
  }, []);

const loadAnalysisHistory = async () => {
    try {
      const history = await analysisService.getAnalysisHistory();
      setAnalysisHistory(history);
    } catch (error) {
      console.error("Failed to load analysis history:", error);
    }
  };
const handleFileSelect = (file) => {
    const imageUrl = URL.createObjectURL(file);
    const uploadedImageData = {
      id: Date.now().toString(),
      file: file,
      url: imageUrl,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date()
    };
    
    setUploadedImage(uploadedImageData);
    setAnalysisResult(null);
    toast.success("Image uploaded successfully!");
  };

const handleRemoveImage = () => {
    if (uploadedImage?.url) {
      URL.revokeObjectURL(uploadedImage.url);
    }
    setUploadedImage(null);
    setAnalysisResult(null);
    toast.info("Image removed");
  };
const handleAnalyze = async () => {
    if (!uploadedImage) {
      toast.error("Please upload an image first");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress({ step: 0, message: 'Initializing analysis...', progress: 0 });
    
    try {
      const result = await analysisService.analyzeImage(uploadedImage.id, (progress) => {
        setAnalysisProgress(progress);
      });
      
      const savedAnalysis = await analysisService.saveAnalysis(result, uploadedImage);
      setAnalysisResult(savedAnalysis);
      await loadAnalysisHistory();
      toast.success("Analysis complete and saved!");
    } catch (error) {
      toast.error("Analysis failed. Please try again.");
      console.error("Analysis error:", error);
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress({ step: 0, message: '', progress: 0 });
    }
  };

const handleViewAnalysis = (analysis) => {
    setAnalysisResult(analysis);
    setUploadedImage(null); // Clear current upload when viewing history
    setShowHistory(false);
  };

return (
    <div className="min-h-screen bg-gray-50 relative">
      <Header />
      
      {/* History Toggle Button */}
      <button
        onClick={() => setShowHistory(!showHistory)}
        className="fixed top-20 right-4 z-40 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors duration-200"
        title="Analysis History"
      >
        <ApperIcon name="History" size={20} className="text-gray-600" />
        {analysisHistory.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {analysisHistory.length}
          </span>
        )}
      </button>

      {/* Analysis History Sidebar */}
      <AnalysisHistory 
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        analyses={analysisHistory}
        onViewAnalysis={handleViewAnalysis}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${showHistory ? 'mr-80' : ''}`}>
      
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

{/* Progress Indicator */}
          {isAnalyzing && (
            <ProgressIndicator 
              step={analysisProgress.step}
              message={analysisProgress.message}
              progress={analysisProgress.progress}
            />
          )}

          {/* Analyze Button */}
          {uploadedImage && !analysisResult && !isAnalyzing && (
            <div className="flex justify-center">
              <Button 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                size="lg"
                className="min-w-[200px]"
              >
                <ApperIcon name="Zap" size={20} className="mr-2" />
                Analyze Creative
              </Button>
            </div>
          )}

{/* Analysis Results */}
          {!isAnalyzing && (
            <AnalysisResults 
              analysisResult={analysisResult}
              isAnalyzing={false}
            />
          )}

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
    </div>
  );
};

export default HomePage;