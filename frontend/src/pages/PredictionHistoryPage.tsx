
import PredictionHistory from "../components/prediction/PredictionHistory";
import { Navbar, Footer } from "./WildfireRisklandingpage";

export default function PredictionHistoryPage() {
  return (
    <div className="min-h-screen bg-[#F6EFE4] text-[#1E2330] font-sans flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight font-serif sm:text-4xl">Prediction History</h2>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            Review past wildfire risk assessments retrieved directly from the database.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <PredictionHistory />
        </div>
      </main>

      <Footer />
    </div>
  );
}
