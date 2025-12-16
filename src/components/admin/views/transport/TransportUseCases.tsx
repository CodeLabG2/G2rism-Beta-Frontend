import React from 'react';
import { Card } from '../../../ui/Card';
import { Badge } from '../../../ui/Badge';
import {
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  Users,
  Car,
  MapPin,
  Calendar,
  DollarSign,
  Shield,
  Wrench,
  FileText,
} from 'lucide-react';

/**
 * Componente de Casos de Uso del Módulo de Transporte
 * 
 * Muestra ejemplos prácticos y escenarios reales de uso
 */
export function TransportUseCases() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#3A7AFE] to-[#1A2440] rounded-lg p-6 text-white">
        <h1 className="text-2xl mb-2">📚 Casos de Uso - Módulo de Transporte</h1>
        <p className="text-blue-100">
          Ejemplos prácticos de cómo usar el módulo en operaciones diarias de turismo
        </p>
      </div>

      {/* Caso de Uso 1: Tour Corporativo */}
      <Card className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <Users className="text-[#3A7AFE]" size={24} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg text-gray-900 mb-1">
              Caso 1: Tour Corporativo a Cartagena
            </h2>
            <p className="text-sm text-gray-600">
              Empresa solicita transporte para 35 empleados desde Bogotá a Cartagena
            </p>
          </div>
          <Badge variant="blue" size="sm">Ejemplo Real</Badge>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm text-gray-700 flex items-center gap-2">
                <Car size={16} className="text-[#3A7AFE]" />
                Selección de Vehículo
              </h3>
              <div className="pl-6 text-sm text-gray-600 space-y-1">
                <p>✓ Capacidad requerida: 35 pasajeros</p>
                <p>✓ Vehículo seleccionado: Bus Volkswagen 17.260</p>
                <p>✓ Placa: DEF456</p>
                <p>✓ Capacidad: 40 pasajeros</p>
                <p>✓ Estado: Disponible → En_Servicio</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm text-gray-700 flex items-center gap-2">
                <Users size={16} className="text-green-600" />
                Asignación de Conductor
              </h3>
              <div className="pl-6 text-sm text-gray-600 space-y-1">
                <p>✓ Conductor: Carlos Alberto Rodríguez Pérez</p>
                <p>✓ Licencia: C2 (Buses)</p>
                <p>✓ Vencimiento: 15/08/2026</p>
                <p>✓ Experiencia: 4 años</p>
                <p>✓ Estado: Activo → Asignado</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm text-gray-700 flex items-center gap-2">
                <MapPin size={16} className="text-purple-600" />
                Ruta Programada
              </h3>
              <div className="pl-6 text-sm text-gray-600 space-y-1">
                <p>✓ Origen: Bogotá</p>
                <p>✓ Destino: Cartagena de Indias</p>
                <p>✓ Distancia: 1,050 km</p>
                <p>✓ Tiempo estimado: 18 horas</p>
                <p>✓ Paradas: Bucaramanga, Valledupar</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm text-gray-700 flex items-center gap-2">
                <DollarSign size={16} className="text-orange-600" />
                Facturación
              </h3>
              <div className="pl-6 text-sm text-gray-600 space-y-1">
                <p>✓ Tarifa base ruta: $2,500,000</p>
                <p>✓ Número de pasajeros: 35</p>
                <p>✓ Reserva: RES-2024-001</p>
                <p>✓ Estado pago: Confirmado</p>
                <p>✓ Comisión agencia: 15%</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-3 mt-3">
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle size={16} />
              <span>Asignación completada exitosamente - Salida programada: 20/12/2024 06:00 AM</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Caso de Uso 2: Tour del Café */}
      <Card className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-green-50 rounded-lg">
            <MapPin className="text-green-600" size={24} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg text-gray-900 mb-1">
              Caso 2: Tour del Eje Cafetero
            </h2>
            <p className="text-sm text-gray-600">
              Familia de 12 personas solicita tour por haciendas cafeteras
            </p>
          </div>
          <Badge variant="green" size="sm">En Curso</Badge>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm text-gray-700">📍 Itinerario</h3>
              <div className="pl-4 text-sm text-gray-600 space-y-1">
                <p>08:30 - Salida de Medellín</p>
                <p>10:00 - Hacienda en Manizales</p>
                <p>12:30 - Almuerzo tradicional</p>
                <p>14:00 - Chinchiná (proceso café)</p>
                <p>16:00 - Regreso a Medellín</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm text-gray-700">🚐 Vehículo</h3>
              <div className="pl-4 text-sm text-gray-600 space-y-1">
                <p>Ford Transit Minibus</p>
                <p>Placa: STU901</p>
                <p>Capacidad: 18 pasajeros</p>
                <p>Año: 2021</p>
                <p>Estado: En_Servicio</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm text-gray-700">👨‍✈️ Conductor</h3>
              <div className="pl-4 text-sm text-gray-600 space-y-1">
                <p>María Fernanda González</p>
                <p>Licencia C1</p>
                <p>Teléfono: +57 311 345 6789</p>
                <p>Experiencia: 3 años</p>
                <p>Calificación: ⭐⭐⭐⭐⭐</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-3 mt-3">
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <Clock size={16} />
              <span>Viaje en curso - Última ubicación: Manizales (10:15 AM)</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Caso de Uso 3: Alerta de Mantenimiento */}
      <Card className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-orange-50 rounded-lg">
            <Wrench className="text-orange-600" size={24} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg text-gray-900 mb-1">
              Caso 3: Mantenimiento Preventivo
            </h2>
            <p className="text-sm text-gray-600">
              Sistema detecta que vehículo requiere mantenimiento próximamente
            </p>
          </div>
          <Badge variant="orange" size="sm">Alerta Activa</Badge>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm text-gray-700 flex items-center gap-2">
                <Car size={16} className="text-orange-600" />
                Vehículo Afectado
              </h3>
              <div className="pl-6 text-sm text-gray-600 space-y-1">
                <p>• Hyundai H350 Van</p>
                <p>• Placa: JKL012</p>
                <p>• Kilometraje: 115,000 km</p>
                <p>• Último mantenimiento: 01/12/2024</p>
                <p>• Próximo mantenimiento: 01/03/2025</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm text-gray-700 flex items-center gap-2">
                <AlertTriangle size={16} className="text-orange-600" />
                Acción Requerida
              </h3>
              <div className="pl-6 text-sm text-gray-600 space-y-1">
                <p>⚠️ Mantenimiento en 30 días</p>
                <p>⚠️ No programar viajes largos</p>
                <p>⚠️ Coordinar con taller</p>
                <p>✓ Vehículos alternativos disponibles</p>
                <p>✓ Presupuesto: $2,000,000</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-3 mt-3 space-y-2">
            <div className="flex items-center gap-2 text-sm text-orange-600">
              <AlertTriangle size={16} />
              <span>Estado cambiado automáticamente: Disponible → Mantenimiento</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileText size={16} />
              <span>Trabajos programados: Frenos, transmisión, cambio de aceite</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Caso de Uso 4: Renovación de Licencia */}
      <Card className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-yellow-50 rounded-lg">
            <Shield className="text-yellow-600" size={24} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg text-gray-900 mb-1">
              Caso 4: Alerta de Vencimiento de Licencia
            </h2>
            <p className="text-sm text-gray-600">
              Conductor con licencia próxima a vencer
            </p>
          </div>
          <Badge variant="orange" size="sm">60 días</Badge>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm text-gray-700">👤 Conductor</h3>
              <div className="pl-4 text-sm text-gray-600 space-y-1">
                <p>Nombre: Patricia Morales Díaz</p>
                <p>Documento: 52678901</p>
                <p>Licencia: C1-52678901</p>
                <p>Categoría: C1 (Vans)</p>
                <p>Fecha vencimiento: 31/12/2024</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm text-gray-700">📋 Acciones</h3>
              <div className="pl-4 text-sm text-gray-600 space-y-1">
                <p>1. Notificar al conductor</p>
                <p>2. Solicitar documentos</p>
                <p>3. Programar examen médico</p>
                <p>4. Renovación en tránsito</p>
                <p>5. Actualizar en sistema</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-3 mt-3">
            <div className="flex items-center gap-2 text-sm text-orange-600">
              <Clock size={16} />
              <span>
                Alerta generada: 2 de noviembre de 2024 (60 días antes del vencimiento)
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Caso de Uso 5: Optimización de Recursos */}
      <Card className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="p-3 bg-purple-50 rounded-lg">
            <TrendingUp className="text-purple-600" size={24} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg text-gray-900 mb-1">
              Caso 5: Optimización de Flota
            </h2>
            <p className="text-sm text-gray-600">
              Análisis de uso y recomendaciones del sistema
            </p>
          </div>
          <Badge variant="purple" size="sm">Análisis IA</Badge>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div>
            <h3 className="text-sm text-gray-700 mb-2">📊 Análisis de Utilización</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded border border-gray-200">
                <p className="text-xs text-gray-500">Ruta más rentable</p>
                <p className="text-sm text-gray-900">Santa Marta - Tayrona</p>
                <p className="text-xs text-green-600">45 viajes/mes</p>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200">
                <p className="text-xs text-gray-500">Vehículo más usado</p>
                <p className="text-sm text-gray-900">Bus Scania K410</p>
                <p className="text-xs text-blue-600">85% ocupación</p>
              </div>
              <div className="bg-white p-3 rounded border border-gray-200">
                <p className="text-xs text-gray-500">Conductor destacado</p>
                <p className="text-sm text-gray-900">Luis F. Ramírez</p>
                <p className="text-xs text-purple-600">⭐ 4.9/5.0</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm text-gray-700 mb-2">💡 Recomendaciones</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span>
                  Incrementar frecuencia en ruta Santa Marta - Tayrona (alta demanda)
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span>
                  Considerar segundo bus grande para temporada alta (Diciembre-Enero)
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span>
                  Vehículo Chevrolet Spark tiene baja utilización (10%), revisar estrategia
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                <span>
                  Capacitar más conductores en categoría C3 para buses grandes
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Métricas Finales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-2xl text-gray-900">98%</p>
              <p className="text-xs text-gray-500">Tasa de éxito</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="text-[#3A7AFE]" size={20} />
            </div>
            <div>
              <p className="text-2xl text-gray-900">172</p>
              <p className="text-xs text-gray-500">Capacidad total</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Calendar className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-2xl text-gray-900">160</p>
              <p className="text-xs text-gray-500">Viajes/mes</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <TrendingUp className="text-orange-600" size={20} />
            </div>
            <div>
              <p className="text-2xl text-gray-900">+24%</p>
              <p className="text-xs text-gray-500">Crecimiento</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div className="bg-[#F5F6FA] rounded-lg p-4 border border-gray-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white rounded-lg">
            <FileText className="text-[#3A7AFE]" size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm text-gray-900 mb-1">
              Documentación Adicional
            </h3>
            <p className="text-xs text-gray-600 mb-2">
              Para más ejemplos y casos de uso, consulta la documentación completa del módulo
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <Badge variant="blue" size="sm">GUIA_EJEMPLOS_TRANSPORTE.md</Badge>
              <Badge variant="green" size="sm">GUIA_RAPIDA_TRANSPORTE.md</Badge>
              <Badge variant="purple" size="sm">API_INTEGRATION_GUIDE.md</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
