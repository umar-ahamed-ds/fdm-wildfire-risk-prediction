import React from 'react';
import { useForm } from 'react-hook-form';
import type { PredictionRequest } from '../../types/prediction';
import { MapPin, Calendar, CloudRain, Flame, Wind, AlertCircle } from 'lucide-react';

interface PredictionFormProps {
  onSubmit: (data: PredictionRequest) => void;
  isLoading: boolean;
}

const PredictionForm: React.FC<PredictionFormProps> = ({ onSubmit, isLoading }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PredictionRequest>({
    defaultValues: {
      latitude: undefined,
      longitude: undefined,
      assessment_date: new Date().toISOString().split('T')[0],
      precipitation: undefined,
      relative_humidity_max: undefined,
      relative_humidity_min: undefined,
      specific_humidity: undefined,
      solar_radiation: undefined,
      temperature_min: undefined,
      temperature_max: undefined,
      wind_speed: undefined,
      burning_index: undefined,
      fuel_moisture_100hr: undefined,
      fuel_moisture_1000hr: undefined,
      energy_release_component: undefined,
      reference_evapotranspiration: undefined,
      potential_evapotranspiration: undefined,
      vapor_pressure_deficit: undefined,
    } as unknown as PredictionRequest,
    mode: 'onTouched',
  });

  const getValues = watch();

  // Helper component for error rendering
  const ErrorMsg = ({ error }: { error?: any }) => {
    if (!error) return null;
    return <p className="text-red-500 text-xs mt-1 font-medium">{error.message}</p>;
  };

  const getBaseInputClass = (error: any, focusColor: string) => 
    `w-full px-4 py-2 border rounded-lg focus:ring-2 ${focusColor} outline-none transition-colors ${
      error ? 'border-red-500 focus:border-red-500 bg-red-50/30' : 'border-gray-300'
    }`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      
      {/* Location Section */}
      <section>
        <div className="flex items-center gap-2 mb-4 text-gray-800 border-b pb-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Location</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Latitude</label>
            <p className="text-xs text-gray-500 mb-2">North/South positioning.</p>
            <input
              type="number"
              step="any"
              className={getBaseInputClass(errors.latitude, 'focus:ring-blue-500 focus:border-blue-500')}
              placeholder="e.g., 7.29"
              {...register('latitude', { 
                required: 'Please enter the latitude.',
                min: { value: -90, message: 'Latitude cannot be less than -90' },
                max: { value: 90, message: 'Latitude cannot be greater than 90' },
                valueAsNumber: true
              })}
            />
            <ErrorMsg error={errors.latitude} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Longitude</label>
            <p className="text-xs text-gray-500 mb-2">East/West positioning.</p>
            <input
              type="number"
              step="any"
              className={getBaseInputClass(errors.longitude, 'focus:ring-blue-500 focus:border-blue-500')}
              placeholder="e.g., 80.63"
              {...register('longitude', { 
                required: 'Please enter the longitude.',
                min: { value: -180, message: 'Longitude cannot be less than -180' },
                max: { value: 180, message: 'Longitude cannot be greater than 180' },
                valueAsNumber: true
              })}
            />
            <ErrorMsg error={errors.longitude} />
          </div>
        </div>
      </section>

      {/* Date Section */}
      <section>
        <div className="flex items-center gap-2 mb-4 text-gray-800 border-b pb-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Assessment Date</h3>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
          <p className="text-xs text-gray-500 mb-2">The date of the environmental conditions being evaluated.</p>
          <input
            type="date"
            className={getBaseInputClass(errors.assessment_date, 'focus:ring-blue-500 focus:border-blue-500')}
            {...register('assessment_date', { required: 'Please select an assessment date.' })}
          />
          <ErrorMsg error={errors.assessment_date} />
        </div>
      </section>

      {/* Weather Conditions */}
      <section>
        <div className="flex items-center gap-2 mb-4 text-gray-800 border-b pb-2">
          <CloudRain className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Weather Conditions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Precipitation (mm)</label>
            <input 
              type="number" step="any" placeholder="e.g., 12.5"
              className={getBaseInputClass(errors.precipitation, 'focus:ring-blue-500 focus:border-blue-500')}
              {...register('precipitation', { 
                required: 'Please enter the precipitation amount.', 
                min: { value: 0, message: 'Cannot be negative.' },
                valueAsNumber: true 
              })} 
            />
            <ErrorMsg error={errors.precipitation} />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Specific Humidity</label>
            <input 
              type="number" step="any" placeholder="e.g., 0.015"
              className={getBaseInputClass(errors.specific_humidity, 'focus:ring-blue-500 focus:border-blue-500')}
              {...register('specific_humidity', { 
                required: 'Please enter specific humidity.', 
                min: { value: 0, message: 'Cannot be negative.' },
                valueAsNumber: true 
              })} 
            />
            <ErrorMsg error={errors.specific_humidity} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Solar Radiation (W/m²)</label>
            <input 
              type="number" step="any" placeholder="e.g., 15.2"
              className={getBaseInputClass(errors.solar_radiation, 'focus:ring-blue-500 focus:border-blue-500')}
              {...register('solar_radiation', { 
                required: 'Please enter solar radiation.', 
                min: { value: 0, message: 'Cannot be negative.' },
                valueAsNumber: true 
              })} 
            />
            <ErrorMsg error={errors.solar_radiation} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Wind Speed (m/s)</label>
            <input 
              type="number" step="any" placeholder="e.g., 4.5"
              className={getBaseInputClass(errors.wind_speed, 'focus:ring-blue-500 focus:border-blue-500')}
              {...register('wind_speed', { 
                required: 'Please enter wind speed.', 
                min: { value: 0, message: 'Cannot be negative.' },
                valueAsNumber: true 
              })} 
            />
            <ErrorMsg error={errors.wind_speed} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Min Rel. Humidity (%)</label>
            <input 
              type="number" step="any" placeholder="e.g., 60"
              className={getBaseInputClass(errors.relative_humidity_min, 'focus:ring-blue-500 focus:border-blue-500')}
              {...register('relative_humidity_min', { 
                required: 'Please enter min relative humidity.', 
                min: { value: 0, message: 'Must be >= 0.' },
                max: { value: 100, message: 'Must be <= 100.' },
                validate: (value) => {
                  if (getValues.relative_humidity_max !== undefined && value > getValues.relative_humidity_max) {
                    return 'Cannot be greater than Max Humidity.';
                  }
                  return true;
                },
                valueAsNumber: true 
              })} 
            />
            <ErrorMsg error={errors.relative_humidity_min} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Max Rel. Humidity (%)</label>
            <input 
              type="number" step="any" placeholder="e.g., 85"
              className={getBaseInputClass(errors.relative_humidity_max, 'focus:ring-blue-500 focus:border-blue-500')}
              {...register('relative_humidity_max', { 
                required: 'Please enter max relative humidity.', 
                min: { value: 0, message: 'Must be >= 0.' },
                max: { value: 100, message: 'Must be <= 100.' },
                validate: (value) => {
                  if (getValues.relative_humidity_min !== undefined && value < getValues.relative_humidity_min) {
                    return 'Cannot be less than Min Humidity.';
                  }
                  return true;
                },
                valueAsNumber: true 
              })} 
            />
            <ErrorMsg error={errors.relative_humidity_max} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Min Temperature (°C)</label>
            <input 
              type="number" step="any" placeholder="e.g., 22.5"
              className={getBaseInputClass(errors.temperature_min, 'focus:ring-blue-500 focus:border-blue-500')}
              {...register('temperature_min', { 
                required: 'Please enter min temperature.', 
                validate: (value) => {
                  if (isNaN(value)) return 'Must be a valid number.';
                  if (getValues.temperature_max !== undefined && value > getValues.temperature_max) {
                    return 'Cannot be greater than Max Temperature.';
                  }
                  if (value < -100 || value > 60) return 'Please enter a realistic temperature.';
                  return true;
                },
                valueAsNumber: true 
              })} 
            />
            <ErrorMsg error={errors.temperature_min} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Max Temperature (°C)</label>
            <input 
              type="number" step="any" placeholder="e.g., 30.1"
              className={getBaseInputClass(errors.temperature_max, 'focus:ring-blue-500 focus:border-blue-500')}
              {...register('temperature_max', { 
                required: 'Please enter max temperature.', 
                validate: (value) => {
                  if (isNaN(value)) return 'Must be a valid number.';
                  if (getValues.temperature_min !== undefined && value < getValues.temperature_min) {
                    return 'Cannot be less than Min Temperature.';
                  }
                  if (value < -100 || value > 60) return 'Please enter a realistic temperature.';
                  return true;
                },
                valueAsNumber: true 
              })} 
            />
            <ErrorMsg error={errors.temperature_max} />
          </div>
        </div>
      </section>

      {/* Fire / Fuel Conditions */}
      <section>
        <div className="flex items-center gap-2 mb-4 text-gray-800 border-b pb-2">
          <Flame className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-semibold">Fire / Fuel Conditions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Burning Index</label>
            <input 
              type="number" step="any" placeholder="e.g., 45.2"
              className={getBaseInputClass(errors.burning_index, 'focus:ring-orange-500 focus:border-orange-500')}
              {...register('burning_index', { 
                required: 'Please enter burning index.', 
                min: { value: 0, message: 'Cannot be negative.' },
                valueAsNumber: true 
              })} 
            />
            <ErrorMsg error={errors.burning_index} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Fuel Moisture 100hr (%)</label>
            <input 
              type="number" step="any" placeholder="e.g., 12.0"
              className={getBaseInputClass(errors.fuel_moisture_100hr, 'focus:ring-orange-500 focus:border-orange-500')}
              {...register('fuel_moisture_100hr', { 
                required: 'Please enter 100hr moisture.', 
                min: { value: 0, message: 'Cannot be negative.' },
                valueAsNumber: true 
              })} 
            />
            <ErrorMsg error={errors.fuel_moisture_100hr} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Fuel Moisture 1000hr (%)</label>
            <input 
              type="number" step="any" placeholder="e.g., 15.5"
              className={getBaseInputClass(errors.fuel_moisture_1000hr, 'focus:ring-orange-500 focus:border-orange-500')}
              {...register('fuel_moisture_1000hr', { 
                required: 'Please enter 1000hr moisture.', 
                min: { value: 0, message: 'Cannot be negative.' },
                valueAsNumber: true 
              })} 
            />
            <ErrorMsg error={errors.fuel_moisture_1000hr} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Energy Release Comp.</label>
            <input 
              type="number" step="any" placeholder="e.g., 35.5"
              className={getBaseInputClass(errors.energy_release_component, 'focus:ring-orange-500 focus:border-orange-500')}
              {...register('energy_release_component', { 
                required: 'Please enter ERC.', 
                min: { value: 0, message: 'Cannot be negative.' },
                valueAsNumber: true 
              })} 
            />
            <ErrorMsg error={errors.energy_release_component} />
          </div>
        </div>
      </section>

      {/* Atmospheric Conditions */}
      <section>
        <div className="flex items-center gap-2 mb-4 text-gray-800 border-b pb-2">
          <Wind className="w-5 h-5 text-teal-600" />
          <h3 className="text-lg font-semibold">Atmospheric Conditions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Reference Evapotranspiration</label>
            <input 
              type="number" step="any" placeholder="e.g., 5.2"
              className={getBaseInputClass(errors.reference_evapotranspiration, 'focus:ring-teal-500 focus:border-teal-500')}
              {...register('reference_evapotranspiration', { 
                required: 'Please enter reference ET.', 
                min: { value: 0, message: 'Cannot be negative.' },
                valueAsNumber: true 
              })} 
            />
            <ErrorMsg error={errors.reference_evapotranspiration} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Potential Evapotranspiration</label>
            <input 
              type="number" step="any" placeholder="e.g., 4.8"
              className={getBaseInputClass(errors.potential_evapotranspiration, 'focus:ring-teal-500 focus:border-teal-500')}
              {...register('potential_evapotranspiration', { 
                required: 'Please enter potential ET.', 
                min: { value: 0, message: 'Cannot be negative.' },
                valueAsNumber: true 
              })} 
            />
            <ErrorMsg error={errors.potential_evapotranspiration} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Vapor Pressure Deficit (kPa)</label>
            <input 
              type="number" step="any" placeholder="e.g., 1.2"
              className={getBaseInputClass(errors.vapor_pressure_deficit, 'focus:ring-teal-500 focus:border-teal-500')}
              {...register('vapor_pressure_deficit', { 
                required: 'Please enter VPD.', 
                min: { value: 0, message: 'Cannot be negative.' },
                valueAsNumber: true 
              })} 
            />
            <ErrorMsg error={errors.vapor_pressure_deficit} />
          </div>
        </div>
      </section>
      
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-start gap-3 border border-red-100">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <p className="text-sm font-medium">Please correct the highlighted fields before assessing risk.</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-4 px-6 text-white font-semibold rounded-xl text-lg transition-all shadow-md
          ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]'}`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          'Assess Wildfire Risk'
        )}
      </button>
    </form>
  );
};

export default PredictionForm;
