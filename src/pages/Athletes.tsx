import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AthleteForm from '@/components/AthleteForm';
import AthleteCard from '@/components/AthleteCard';
import PredictionSummary from '@/components/PredictionSummary';
import { mockAthletes, mockPredictions } from '@/data/mockData';
import { Athlete } from '@/types';

export default function Athletes() {
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(
    mockAthletes[0]
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Athletes Management</h1>
        <p className="text-gray-500 mt-1">
          Add new athletes and view detailed performance metrics
        </p>
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="list">Athletes List</TabsTrigger>
          <TabsTrigger value="add">Add New Athlete</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6 mt-6">
          {/* Athletes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockAthletes.map((athlete) => (
              <div
                key={athlete.id}
                onClick={() => setSelectedAthlete(athlete)}
                className={`cursor-pointer transition-all ${
                  selectedAthlete?.id === athlete.id ? 'ring-2 ring-blue-500 rounded-lg' : ''
                }`}
              >
                <AthleteCard
                  athlete={athlete}
                  prediction={mockPredictions[athlete.id]}
                />
              </div>
            ))}
          </div>

          {/* Selected Athlete Details */}
          {selectedAthlete && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Detailed View: {selectedAthlete.name}
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PredictionSummary
                  prediction={mockPredictions[selectedAthlete.id]}
                  athleteName={selectedAthlete.name}
                />
                <div className="space-y-4">
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Athlete Information
                    </h3>
                    <dl className="space-y-3">
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Age</dt>
                        <dd className="font-medium">{selectedAthlete.age} years</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Disability Type</dt>
                        <dd className="font-medium">{selectedAthlete.disabilityType}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Sport</dt>
                        <dd className="font-medium">{selectedAthlete.sport}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Training Load</dt>
                        <dd className="font-medium">{selectedAthlete.trainingHours}h/week</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Sleep Quality</dt>
                        <dd className="font-medium">{selectedAthlete.sleepHours}h/night</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Nutrition Score</dt>
                        <dd className="font-medium">{selectedAthlete.nutritionScore}/100</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="add" className="mt-6">
          <div className="max-w-2xl mx-auto">
            <AthleteForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}