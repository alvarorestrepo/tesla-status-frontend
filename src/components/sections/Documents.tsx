'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InfoTooltip } from '@/components/InfoTooltip';
import { Order } from '@/lib/tesla/types';
import { FileStack, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

interface DocumentsProps {
  order: Order;
}

export function Documents({ order }: DocumentsProps) {
  const formatValue = (value: any, defaultText: string = "No disponible") => {
    if (value === null || value === undefined || value === "") {
      return <span className="text-muted-foreground italic">{defaultText}</span>;
    }
    return value;
  };

  const documents = [
    {
      name: 'MVPA (Acuerdo de Compra)',
      exists: order.has_mvpa_doc,
      description: 'Motor Vehicle Purchase Agreement - Contrato principal de compra',
      tooltip: 'Documento legal que establece los términos de la compra'
    },
    {
      name: 'Factura Final',
      exists: order.final_invoice_exists || order.has_final_invoice,
      description: 'Factura definitiva del vehículo',
      tooltip: 'Documento de facturación final con todos los cargos'
    }
  ];

  const availableDocs = documents.filter(d => d.exists).length;
  const totalDocs = documents.length;

  return (
    <div className="space-y-6">
      {/* Resumen de Documentos */}
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileStack className="w-5 h-5 text-[#E31937]" />
            Documentos del Pedido
            <InfoTooltip content="Documentos legales y de facturación asociados a tu pedido" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Documentos Disponibles</p>
              <p className="font-semibold">{availableDocs} de {totalDocs}</p>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#E31937] transition-all duration-500"
                style={{ width: `${(availableDocs / totalDocs) * 100}%` }}
              />
            </div>
          </div>

          {/* Lista de Documentos */}
          
          <div className="space-y-3">
            {documents.map((doc) => (
              <div 
                key={doc.name} 
                className="flex items-start gap-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors"
              >
                <div className={`p-2 rounded-lg ${
                  doc.exists ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <FileText className={`w-5 h-5 ${
                    doc.exists ? 'text-green-600' : 'text-gray-400'
                  }`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{doc.name}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant={doc.exists ? 'default' : 'outline'}>
                        {doc.exists ? 'Disponible' : 'Pendiente'}
                      </Badge>
                      <InfoTooltip content={doc.tooltip} />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{doc.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Estado de Regeneración */}
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#E31937]" />
            Estado de Documentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Regeneración de Documentos</p>
              <Badge variant={order.is_docs_being_regenerated ? 'secondary' : 'outline'}>
                {order.is_docs_being_regenerated ? 'En Proceso' : 'No activo'}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Reconocimiento Pendiente</p>
              <Badge variant={order.is_any_acknowledgement_pending ? 'secondary' : 'outline'}>
                {order.is_any_acknowledgement_pending ? 'Sí' : 'No'}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Puede Mostrar Reconocimiento</p>
              <Badge variant={order.can_display_acknowledgement ? 'default' : 'outline'}>
                {order.can_display_acknowledgement ? 'Sí' : 'No'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estado de Acuerdos */}
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#E31937]" />
            Estado de Acuerdos
            <InfoTooltip content="Información sobre el estado de firma de acuerdos y documentos" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Estado de Firma Electrónica</p>
              <Badge variant={order.agreements_e_sign_status === 'COMPLETE' ? 'default' : 'secondary'}>
                {order.agreements_e_sign_status || 'No disponible'}
              </Badge>
            </div>

            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Ha Firmado Documentos</p>
              <Badge variant={order.agreements_has_signed_one_of_packets ? 'default' : 'outline'}>
                {order.agreements_has_signed_one_of_packets ? 'Sí' : 'No'}
              </Badge>
            </div>

            {order.agreements_completed_packets && order.agreements_completed_packets.length > 0 && (
              <div className="space-y-1 md:col-span-2">
                <p className="text-sm text-muted-foreground">Documentos Completados</p>
                <div className="flex flex-wrap gap-2">
                  {order.agreements_completed_packets.map((packet, index) => (
                    <Badge key={index} variant="outline" className="bg-green-50">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      {packet}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Información */}
      
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-blue-900">Documentos Importantes</p>
              <p className="text-sm text-blue-700 mt-1">
                Los documentos estarán disponibles para descarga una vez que 
                se complete la configuración de tu pedido. Asegúrate de revisar 
                y guardar todos los documentos para tus registros.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
