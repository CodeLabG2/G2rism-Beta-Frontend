import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { X, DollarSign, Calendar, Star, MapPin } from 'lucide-react';

interface FiltersModalProps {
  show: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
  currentFilters: any;
}

export function FiltersModal({ show, onClose, onApply, currentFilters }: FiltersModalProps) {
  const [filters, setFilters] = useState(currentFilters || {
    priceRange: [0, 5000],
    duration: [],
    rating: 0,
    types: [],
  });

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      priceRange: [0, 5000],
      duration: [],
      rating: 0,
      types: [],
    };
    setFilters(resetFilters);
    onApply(resetFilters);
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h5>Filtros</h5>
              <button
                onClick={onClose}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {/* Price Range */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <DollarSign size={18} className="text-[#3A7AFE]" />
                <h6>Rango de Precio</h6>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>${filters.priceRange[0]}</span>
                  <span>${filters.priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={filters.priceRange[1]}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      priceRange: [0, parseInt(e.target.value)],
                    })
                  }
                  className="w-full"
                />
              </div>
            </div>

            {/* Duration */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={18} className="text-[#3A7AFE]" />
                <h6>Duración</h6>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {['3-5 días', '6-8 días', '9-12 días', '+12 días'].map((duration) => (
                  <button
                    key={duration}
                    onClick={() => {
                      const newDurations = filters.duration.includes(duration)
                        ? filters.duration.filter((d: string) => d !== duration)
                        : [...filters.duration, duration];
                      setFilters({ ...filters, duration: newDurations });
                    }}
                    className={`p-3 text-sm border rounded-lg transition-colors ${
                      filters.duration.includes(duration)
                        ? 'border-[#3A7AFE] bg-[#3A7AFE]/10 text-[#3A7AFE]'
                        : 'border-gray-300 hover:border-[#3A7AFE]'
                    }`}
                  >
                    {duration}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Star size={18} className="text-[#3A7AFE]" />
                <h6>Rating Mínimo</h6>
              </div>
              <div className="flex gap-2">
                {[3, 3.5, 4, 4.5, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setFilters({ ...filters, rating })}
                    className={`flex-1 p-3 border rounded-lg transition-colors ${
                      filters.rating === rating
                        ? 'border-[#3A7AFE] bg-[#3A7AFE]/10 text-[#3A7AFE]'
                        : 'border-gray-300 hover:border-[#3A7AFE]'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <Star
                        size={14}
                        className={filters.rating === rating ? 'fill-[#3A7AFE]' : ''}
                      />
                      <span className="text-xs">{rating}+</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Type */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={18} className="text-[#3A7AFE]" />
                <h6>Tipo de Viaje</h6>
              </div>
              <div className="space-y-2">
                {['Playa', 'Ciudad', 'Aventura', 'Cultural', 'Naturaleza', 'Lujo'].map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.types.includes(type)}
                      onChange={(e) => {
                        const newTypes = e.target.checked
                          ? [...filters.types, type]
                          : filters.types.filter((t: string) => t !== type);
                        setFilters({ ...filters, types: newTypes });
                      }}
                      className="w-4 h-4 rounded border-2 border-gray-300 bg-white text-[#3A7AFE] focus:ring-2 focus:ring-[#3A7AFE] focus:ring-offset-0 cursor-pointer transition-all checked:bg-[#3A7AFE] checked:border-[#3A7AFE] hover:border-[#3A7AFE] accent-[#3A7AFE]"
                    />
                    <span className="text-sm">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex gap-3">
              <Button variant="secondary" onClick={handleReset} fullWidth>
                Limpiar
              </Button>
              <Button variant="primary" onClick={handleApply} fullWidth>
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}