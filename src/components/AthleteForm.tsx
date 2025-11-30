import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import { FormData, ValidationErrors } from '@/types';
import { predictAthlete, BackendPredictionResponse } from '@/lib/api';
import { toast } from 'sonner';

interface AthleteFormProps {
  onSuccess?: (result: BackendPredictionResponse) => void;
  onError?: (error: string) => void;
  loading?: boolean;
  setLoading?: (loading: boolean) => void;
}

export default function AthleteForm({ onSuccess, onError, loading: externalLoading, setLoading: setExternalLoading }: AthleteFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    age: '',
    gender: '',
    disabilityType: '',
    sport: '',
    trainingHours: '',
    sleepHours: '',
    weightKg: '',
    heightCm: '',
    heartRateRest: '',
    dailyCalorieIntake: '',
    proteinIntakeG: '',
    waterIntakeLiters: '',
    hydrationLevel: '70',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const loading = externalLoading ?? submitStatus === 'loading';

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    const age = parseInt(formData.age);
    if (!formData.age || age < 12 || age > 70) {
      newErrors.age = 'Please enter a valid age (12-70)';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.disabilityType) {
      newErrors.disabilityType = 'Disability type is required';
    }

    if (!formData.sport.trim()) {
      newErrors.sport = 'Sport is required';
    }

    const trainingHours = parseFloat(formData.trainingHours);
    if (!formData.trainingHours || trainingHours < 0) {
      newErrors.trainingHours = 'Please enter valid training hours';
    }

    const sleepHours = parseFloat(formData.sleepHours);
    if (!formData.sleepHours || sleepHours < 0 || sleepHours > 12) {
      newErrors.sleepHours = 'Please enter valid sleep hours (0-12)';
    }

    const weightKg = parseFloat(formData.weightKg);
    if (!formData.weightKg || weightKg < 30 || weightKg > 150) {
      newErrors.weightKg = 'Please enter valid weight (30-150 kg)';
    }

    const heightCm = parseFloat(formData.heightCm);
    if (!formData.heightCm || heightCm < 120 || heightCm > 210) {
      newErrors.heightCm = 'Please enter valid height (120-210 cm)';
    }

    const heartRateRest = parseInt(formData.heartRateRest);
    if (!formData.heartRateRest || heartRateRest < 30 || heartRateRest > 120) {
      newErrors.heartRateRest = 'Please enter valid resting heart rate (30-120 bpm)';
    }

    const dailyCalorieIntake = parseInt(formData.dailyCalorieIntake);
    if (!formData.dailyCalorieIntake || dailyCalorieIntake < 800 || dailyCalorieIntake > 6000) {
      newErrors.dailyCalorieIntake = 'Please enter valid daily calorie intake (800-6000)';
    }

    const proteinIntakeG = parseFloat(formData.proteinIntakeG);
    if (!formData.proteinIntakeG || proteinIntakeG < 0 || proteinIntakeG > 400) {
      newErrors.proteinIntakeG = 'Please enter valid protein intake (0-400 g)';
    }

    const waterIntakeLiters = parseFloat(formData.waterIntakeLiters);
    if (!formData.waterIntakeLiters || waterIntakeLiters < 0 || waterIntakeLiters > 10) {
      newErrors.waterIntakeLiters = 'Please enter valid water intake (0-10 liters)';
    }

    const hydrationLevel = parseInt(formData.hydrationLevel);
    if (!formData.hydrationLevel || hydrationLevel < 0 || hydrationLevel > 100) {
      newErrors.hydrationLevel = 'Please enter valid hydration level (0-100)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!validateForm()) {
      setSubmitStatus('error');
      return;
    }

    setSubmitStatus('loading');
    setExternalLoading?.(true);

    try {
      const prediction = await predictAthlete({
        age: parseInt(formData.age),
        gender: formData.gender as 'Male' | 'Female' | 'Other',
        disabilityType: formData.disabilityType,
        sport: formData.sport,
        trainingHours: parseFloat(formData.trainingHours),
        sleepHours: parseFloat(formData.sleepHours),
        weightKg: parseFloat(formData.weightKg),
        heightCm: parseFloat(formData.heightCm),
        heartRateRest: parseInt(formData.heartRateRest),
        dailyCalorieIntake: parseInt(formData.dailyCalorieIntake),
        proteinIntakeG: parseFloat(formData.proteinIntakeG),
        waterIntakeLiters: parseFloat(formData.waterIntakeLiters),
        hydrationLevel: parseInt(formData.hydrationLevel),
      });

      toast.success('Prediction successful!', {
        description: `Stamina: ${prediction.predictions.stamina_level.toFixed(1)}, Fatigue: ${prediction.predictions.fatigue_level.toFixed(1)}, Injury Risk: ${prediction.predictions.injury_risk_label}`,
      });

      setSubmitStatus('success');
      setExternalLoading?.(false);
      
      // Call success callback
      onSuccess?.(prediction);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          age: '',
          gender: '',
          disabilityType: '',
          sport: '',
          trainingHours: '',
          sleepHours: '',
          weightKg: '',
          heightCm: '',
          heartRateRest: '',
          dailyCalorieIntake: '',
          proteinIntakeG: '',
          waterIntakeLiters: '',
          hydrationLevel: '70',
        });
        setSubmitStatus('idle');
        setErrors({});
      }, 2000);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Failed to get prediction. Please check your connection and try again.';
      setErrorMessage(errorMsg);
      setSubmitStatus('error');
      setExternalLoading?.(false);
      onError?.(errorMsg);
      toast.error('Prediction failed', {
        description: errorMsg,
      });
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  return (
    <Card className="w-full bg-slate-800 border-slate-700">
      <CardHeader className="bg-slate-700/50 border-b border-slate-600">
        <CardTitle className="text-white flex items-center gap-2 text-sm font-semibold">
          ATHLETE INFORMATION
        </CardTitle>
        <CardDescription className="text-gray-400 text-xs">
          Enter athlete details to get AI-powered performance predictions
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-slate-800">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-300 text-sm">Full Name *</Label>
            <Input
              id="name"
              placeholder="Enter athlete's full name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`bg-slate-700 border-slate-600 text-white placeholder:text-gray-500 ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && (
              <p className="text-sm text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Age */}
          <div className="space-y-2">
            <Label htmlFor="age" className="text-gray-300 text-sm">Age *</Label>
            <Input
              id="age"
              type="number"
              placeholder="Enter age (12-70)"
              value={formData.age}
              onChange={(e) => handleChange('age', e.target.value)}
              className={`bg-slate-700 border-slate-600 text-white placeholder:text-gray-500 ${errors.age ? 'border-red-500' : ''}`}
            />
            {errors.age && (
              <p className="text-sm text-red-400">{errors.age}</p>
            )}
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label htmlFor="gender" className="text-gray-300 text-sm">Gender *</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => handleChange('gender', value)}
            >
              <SelectTrigger className={`bg-slate-700 border-slate-600 text-white ${errors.gender ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600 text-white">
                <SelectItem value="Male" className="text-white focus:bg-slate-600">Male</SelectItem>
                <SelectItem value="Female" className="text-white focus:bg-slate-600">Female</SelectItem>
                <SelectItem value="Other" className="text-white focus:bg-slate-600">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && (
              <p className="text-sm text-red-400">{errors.gender}</p>
            )}
          </div>

          {/* Disability Type */}
          <div className="space-y-2">
            <Label htmlFor="disabilityType" className="text-gray-300 text-sm">Disability Type *</Label>
            <Select
              value={formData.disabilityType}
              onValueChange={(value) => handleChange('disabilityType', value)}
            >
              <SelectTrigger className={cn("bg-slate-700 border-slate-600 text-white placeholder:text-gray-500", errors.disabilityType ? "border-red-500" : "")}>
                <SelectValue placeholder="Select disability type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600 text-white">
                <SelectItem value="lower-limb" className="text-white focus:bg-slate-600">Lower Limb Amputation</SelectItem>
                <SelectItem value="upper-limb" className="text-white focus:bg-slate-600">Upper Limb Amputation</SelectItem>
                <SelectItem value="visual" className="text-white focus:bg-slate-600">Visual Impairment</SelectItem>
                <SelectItem value="cerebral-palsy" className="text-white focus:bg-slate-600">Cerebral Palsy</SelectItem>
                <SelectItem value="spinal-cord" className="text-white focus:bg-slate-600">Spinal Cord Injury</SelectItem>
                <SelectItem value="other" className="text-white focus:bg-slate-600">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.disabilityType && (
              <p className="text-sm text-red-400">{errors.disabilityType}</p>
            )}
          </div>

          {/* Sport */}
          <div className="space-y-2">
            <Label htmlFor="sport" className="text-gray-300 text-sm">Sport *</Label>
            <Input
              id="sport"
              placeholder="e.g., Para Athletics - Sprint, Wheelchair Racing"
              value={formData.sport}
              onChange={(e) => handleChange('sport', e.target.value)}
              className={cn("bg-slate-700 border-slate-600 text-white placeholder:text-gray-500", errors.sport ? "border-red-500" : "")}
            />
            {errors.sport && (
              <p className="text-sm text-red-400">{errors.sport}</p>
            )}
          </div>

          {/* Weight and Height in a row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weightKg" className="text-gray-300 text-sm">Weight (kg) *</Label>
              <Input
                id="weightKg"
                type="number"
                step="0.1"
                placeholder="e.g., 70"
                value={formData.weightKg}
                onChange={(e) => handleChange('weightKg', e.target.value)}
                className={cn("bg-slate-700 border-slate-600 text-white placeholder:text-gray-500", errors.weightKg ? "border-red-500" : "")}
              />
              {errors.weightKg && (
                <p className="text-sm text-red-400">{errors.weightKg}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="heightCm" className="text-gray-300 text-sm">Height (cm) *</Label>
              <Input
                id="heightCm"
                type="number"
                step="0.1"
                placeholder="e.g., 175"
                value={formData.heightCm}
                onChange={(e) => handleChange('heightCm', e.target.value)}
                className={cn("bg-slate-700 border-slate-600 text-white placeholder:text-gray-500", errors.heightCm ? "border-red-500" : "")}
              />
              {errors.heightCm && (
                <p className="text-sm text-red-400">{errors.heightCm}</p>
              )}
            </div>
          </div>

          {/* Training Hours */}
          <div className="space-y-2">
            <Label htmlFor="trainingHours" className="text-gray-300 text-sm">Training Hours per Week *</Label>
            <Input
              id="trainingHours"
              type="number"
              step="0.5"
              placeholder="e.g., 25"
              value={formData.trainingHours}
              onChange={(e) => handleChange('trainingHours', e.target.value)}
              className={cn("bg-slate-700 border-slate-600 text-white placeholder:text-gray-500", errors.trainingHours ? "border-red-500" : "")}
            />
            {errors.trainingHours && (
              <p className="text-sm text-red-400">{errors.trainingHours}</p>
            )}
          </div>

          {/* Sleep Hours */}
          <div className="space-y-2">
            <Label htmlFor="sleepHours" className="text-gray-300 text-sm">Average Sleep Hours per Night *</Label>
            <Input
              id="sleepHours"
              type="number"
              step="0.5"
              placeholder="e.g., 7.5"
              value={formData.sleepHours}
              onChange={(e) => handleChange('sleepHours', e.target.value)}
              className={cn("bg-slate-700 border-slate-600 text-white placeholder:text-gray-500", errors.sleepHours ? "border-red-500" : "")}
            />
            {errors.sleepHours && (
              <p className="text-sm text-red-400">{errors.sleepHours}</p>
            )}
          </div>

          {/* Heart Rate Rest */}
          <div className="space-y-2">
            <Label htmlFor="heartRateRest" className="text-gray-300 text-sm">Resting Heart Rate (bpm) *</Label>
            <Input
              id="heartRateRest"
              type="number"
              placeholder="e.g., 60"
              value={formData.heartRateRest}
              onChange={(e) => handleChange('heartRateRest', e.target.value)}
              className={cn("bg-slate-700 border-slate-600 text-white placeholder:text-gray-500", errors.heartRateRest ? "border-red-500" : "")}
            />
            {errors.heartRateRest && (
              <p className="text-sm text-red-400">{errors.heartRateRest}</p>
            )}
          </div>

          {/* Nutrition Section */}
          <div className="border-t border-slate-600 pt-4">
            <h3 className="text-lg font-semibold mb-4 text-white">Nutrition Information</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dailyCalorieIntake" className="text-gray-300 text-sm">Daily Calorie Intake *</Label>
                <Input
                  id="dailyCalorieIntake"
                  type="number"
                  placeholder="e.g., 2500"
                  value={formData.dailyCalorieIntake}
                  onChange={(e) => handleChange('dailyCalorieIntake', e.target.value)}
                  className={cn("bg-slate-700 border-slate-600 text-white placeholder:text-gray-500", errors.dailyCalorieIntake ? "border-red-500" : "")}
                />
                {errors.dailyCalorieIntake && (
                  <p className="text-sm text-red-400">{errors.dailyCalorieIntake}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="proteinIntakeG" className="text-gray-300 text-sm">Protein Intake (grams) *</Label>
                <Input
                  id="proteinIntakeG"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 130"
                  value={formData.proteinIntakeG}
                  onChange={(e) => handleChange('proteinIntakeG', e.target.value)}
                  className={cn("bg-slate-700 border-slate-600 text-white placeholder:text-gray-500", errors.proteinIntakeG ? "border-red-500" : "")}
                />
                {errors.proteinIntakeG && (
                  <p className="text-sm text-red-400">{errors.proteinIntakeG}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="waterIntakeLiters" className="text-gray-300 text-sm">Water Intake (liters) *</Label>
                  <Input
                    id="waterIntakeLiters"
                    type="number"
                    step="0.1"
                    placeholder="e.g., 3.0"
                    value={formData.waterIntakeLiters}
                    onChange={(e) => handleChange('waterIntakeLiters', e.target.value)}
                    className={cn("bg-slate-700 border-slate-600 text-white placeholder:text-gray-500", errors.waterIntakeLiters ? "border-red-500" : "")}
                  />
                  {errors.waterIntakeLiters && (
                    <p className="text-sm text-red-400">{errors.waterIntakeLiters}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hydrationLevel" className="text-gray-300 text-sm">Hydration Level (0-100) *</Label>
                  <Input
                    id="hydrationLevel"
                    type="number"
                    placeholder="e.g., 75"
                    value={formData.hydrationLevel}
                    onChange={(e) => handleChange('hydrationLevel', e.target.value)}
                    className={cn("bg-slate-700 border-slate-600 text-white placeholder:text-gray-500", errors.hydrationLevel ? "border-red-500" : "")}
                  />
                  {errors.hydrationLevel && (
                    <p className="text-sm text-red-400">{errors.hydrationLevel}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {submitStatus === 'success' && (
            <Alert className="bg-green-500/20 border-green-500/30">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-300">
                Prediction successful! The form will reset shortly.
              </AlertDescription>
            </Alert>
          )}

          {submitStatus === 'error' && (errorMessage || Object.keys(errors).length > 0) && (
            <Alert className="bg-red-500/20 border-red-500/30">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-300">
                {errorMessage || 'Please fix the errors above before submitting.'}
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-200 font-semibold py-6 text-lg rounded-lg mt-6"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Analyzing Performance...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Get AI Prediction
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
