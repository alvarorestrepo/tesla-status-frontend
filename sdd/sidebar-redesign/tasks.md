# Tasks - Sidebar Redesign

## Fase 1: Foundation (Infraestructura base)

### Task 1.1: Setup de estructura de carpetas
- **Archivo**: N/A (creación de directorios)
- **Qué hacer**: Crear estructura de carpetas necesaria:
  - `src/components/sidebar/` - Componentes del sidebar
  - `src/components/sidebar/sections/` - Secciones del sidebar
  - `src/components/sidebar/layout/` - Layout components (header, footer, item)
  - `src/context/` - Context providers
  - `src/hooks/` - Custom hooks
  - `src/lib/formatters/` - Helpers de formateo
  - `src/components/ui/` - Componentes UI base (InfoTooltip)
- **Verificación**: Todos los directorios existen y están vacíos listos para recibir código
- **Tiempo estimado**: 10 minutos

### Task 1.2: Context y hook para sidebar
- **Archivo**: `src/context/SidebarContext.tsx`, `src/hooks/useSidebar.ts`
- **Qué hacer**: 
  - Crear `SidebarContext` con estado para:
    - `isOpen` (boolean) - Sidebar abierto/cerrado en móvil
    - `activeSection` (string) - Sección activa actual
    - `setActiveSection` (function) - Cambiar sección activa
  - Crear `useSidebar` hook que consuma el contexto
  - Exportar `SidebarProvider` para envolver el dashboard
- **Verificación**: El hook retorna correctamente el estado y funciones, no hay errores de TypeScript
- **Tiempo estimado**: 20 minutos

### Task 1.3: Componente InfoTooltip
- **Archivo**: `src/components/ui/InfoTooltip.tsx`
- **Qué hacer**:
  - Crear componente reutilizable de tooltip con icono de información
  - Usar Radix UI o Headless UI para accesibilidad
  - Props: `content` (string), `position` (top|bottom|left|right, default: top)
  - Estilo: Icono gris claro, tooltip con fondo oscuro y texto blanco
  - Incluir icono de info (Heroicons o Lucide)
- **Verificación**: El tooltip se muestra al hover, el contenido se renderiza correctamente, es accesible (aria-label)
- **Tiempo estimado**: 25 minutos

### Task 1.4: Helpers de formateo base
- **Archivo**: `src/lib/formatters/index.ts`
- **Qué hacer**:
  - Crear archivo de exportaciones centralizado
  - Definir tipos base: `FormattedValue`, `FormatterOptions`
  - Crear utilidad `formatValue(value, type)` que maneje:
    - `currency` (con símbolo $)
    - `date` (formato localizado)
    - `percentage` (con símbolo %)
    - `text` (default, capitalize first letter)
  - Incluir manejo de valores vacíos/null (retornar "—" o "N/A")
- **Verificación**: Todos los formatos funcionan correctamente, los casos edge (null, undefined) se manejan
- **Tiempo estimado**: 30 minutos

---

## Fase 2: Layout Components (Estructura visual)

### Task 2.1: Sidebar principal
- **Archivo**: `src/components/sidebar/Sidebar.tsx`
- **Qué hacer**:
  - Crear componente contenedor del sidebar
  - Props: `children`, `className` (opcional)
  - Estructura: nav con aria-label="Main navigation"
  - Layout: 
    - Desktop: Fixed left, width 280px, full height
    - Mobile: Fixed left, width 280px, slide-in con overlay oscuro
  - Estilo: Fondo blanco, border-right gris claro, shadow suave
  - Integrar con `useSidebar` para controlar visibilidad móvil
- **Verificación**: Se renderiza correctamente, responsive funciona, overlay cierra al hacer click fuera
- **Tiempo estimado**: 40 minutos

### Task 2.2: SidebarHeader (logo + usuario)
- **Archivo**: `src/components/sidebar/layout/SidebarHeader.tsx`
- **Qué hacer**:
  - Crear header del sidebar
  - Secciones:
    - Logo Tesla (texto "TESLA" en font-bold tracking-wider)
    - Avatar del usuario (círculo con iniciales o imagen)
    - Nombre del usuario (truncado si es largo)
    - Email del usuario (texto secundario más pequeño)
  - Estilo: padding consistente, separador sutil abajo
  - Usar datos mock por ahora (se integrarán después)
- **Verificación**: Se renderiza con datos mock, el layout es correcto, responsive
- **Tiempo estimado**: 30 minutos

### Task 2.3: SidebarFooter (versión + logout)
- **Archivo**: `src/components/sidebar/layout/SidebarFooter.tsx`
- **Qué hacer**:
  - Crear footer del sidebar
  - Secciones:
    - Versión de la app (texto pequeño gris)
    - Botón de logout (icono + texto "Cerrar sesión")
  - Estilo: Posición sticky al fondo, padding, borde superior sutil
  - El botón logout debe llamar a la función de logout existente
- **Verificación**: Botón logout funciona, versión se muestra, posicionamiento correcto
- **Tiempo estimado**: 25 minutos

### Task 2.4: SidebarItem (item navegable)
- **Archivo**: `src/components/sidebar/layout/SidebarItem.tsx`
- **Qué hacer**:
  - Crear componente de item de navegación
  - Props:
    - `icon`: Componente React (icono)
    - `label`: string (texto del item)
    - `section`: string (identificador de sección)
    - `isActive`: boolean
    - `onClick`: function
  - Estados:
    - Inactivo: texto gris, icono gris
    - Hover: bg gris muy claro
    - Activo: bg rojo Tesla (#E82127), texto blanco, icono blanco
  - Incluir indicador visual cuando está activo (línea izquierda o bg completo)
- **Verificación**: Los estados hover/active funcionan, el click cambia la sección, estilos correctos
- **Tiempo estimado**: 35 minutos

### Task 2.5: MobileHeader (hamburguesa)
- **Archivo**: `src/components/sidebar/layout/MobileHeader.tsx`
- **Qué hacer**:
  - Crear header móvil con botón hamburguesa
  - Visible solo en mobile (< md breakpoint)
  - Contenido:
    - Botón hamburguesa (icono) que abre el sidebar
    - Logo Tesla centrado (opcional)
  - Estilo: bg blanco, border-bottom, padding, sticky top
  - Integrar con `useSidebar` para abrir el sidebar
- **Verificación**: Solo visible en mobile, el botón abre el sidebar, estilos correctos
- **Tiempo estimado**: 25 minutos

---

## Fase 3: Section Components (13 secciones)

### Task 3.1: OrderStatus (migrar OrderTimeline)
- **Archivo**: `src/components/sidebar/sections/OrderStatus.tsx`
- **Qué hacer**:
  - Migrar componente `OrderTimeline` existente
  - Adaptar para mostrar en el panel derecho del dashboard
  - Props: `orderData`
  - Incluir InfoTooltip explicando qué es el estado del pedido
  - Estilos Tesla: timeline vertical con círculos y líneas
- **Verificación**: El timeline se renderiza correctamente con datos, tooltip funciona
- **Tiempo estimado**: 30 minutos

### Task 3.2: OrderData (datos básicos)
- **Archivo**: `src/components/sidebar/sections/OrderData.tsx`
- **Qué hacer**:
  - Crear sección "Datos del Pedido"
  - Campos a mostrar:
    - Número de orden
    - Fecha de creación
    - Estado del pedido
    - Vendedor asignado
  - Layout: Grid 2 columnas en desktop, 1 en mobile
  - Cada campo: Label + Valor formateado
  - InfoTooltip en el título de la sección
- **Verificación**: Todos los campos se muestran, formato correcto, responsive
- **Tiempo estimado**: 25 minutos

### Task 3.3: VehicleInfo (vehículo)
- **Archivo**: `src/components/sidebar/sections/VehicleInfo.tsx`
- **Qué hacer**:
  - Crear sección "Información del Vehículo"
  - Campos:
    - Modelo (ej: "Model 3")
    - Versión/Trim (ej: "Long Range")
    - Color exterior
    - Color interior
    - Rines
    - Autopilot
    - Full Self-Driving (si aplica)
  - Mostrar imagen del vehículo si está disponible en los datos
  - Layout: Imagen a la izquierda (si existe), datos a la derecha
- **Verificación**: Datos se muestran correctamente, imagen se renderiza si existe, tooltip funciona
- **Tiempo estimado**: 35 minutos

### Task 3.4: Dates (fechas)
- **Archivo**: `src/components/sidebar/sections/Dates.tsx`
- **Qué hacer**:
  - Crear sección "Fechas Importantes"
  - Campos:
    - Fecha estimada de entrega
    - Fecha de fabricación (si aplica)
    - Fecha de envío
    - Fecha real de entrega (si aplica)
  - Formato de fechas: Localizado y humanizado (ej: "15 de marzo de 2024")
  - Mostrar diferencia de días si aplica (ej: "En 5 días")
- **Verificación**: Fechas formateadas correctamente, cálculos de días funcionan
- **Tiempo estimado**: 25 minutos

### Task 3.5: PaymentInfo (pago)
- **Archivo**: `src/components/sidebar/sections/PaymentInfo.tsx`
- **Qué hacer**:
  - Crear sección "Información de Pago"
  - Campos:
    - Precio del vehículo
    - Impuestos
    - Tarifa de destino
    - Descuentos (si aplica)
    - Total pagado / Pendiente
    - Método de pago
  - Layout: Tabla o lista con alineación derecha para montos
  - Currency formatting con símbolo $
- **Verificación**: Cálculos correctos, formato de moneda apropiado, totales destacados
- **Tiempo estimado**: 30 minutos

### Task 3.6: DeliveryInfo (entrega)
- **Archivo**: `src/components/sidebar/sections/DeliveryInfo.tsx`
- **Qué hacer**:
  - Crear sección "Información de Entrega"
  - Campos:
    - Método de entrega (Pickup / Delivery)
    - Centro de entrega (si es pickup)
    - Fecha programada
    - Hora programada
    - Notas especiales
  - Mapa embebido o link a Google Maps si hay ubicación
- **Verificación**: Datos se muestran, mapa/link funciona si hay ubicación
- **Tiempo estimado**: 25 minutos

### Task 3.7: DeliveryAddress (dirección)
- **Archivo**: `src/components/sidebar/sections/DeliveryAddress.tsx`
- **Qué hacer**:
  - Crear sección "Dirección de Entrega"
  - Campos:
    - Calle y número
    - Colonia
    - Ciudad
    - Estado
    - Código postal
    - País
    - Referencias
  - Botón para copiar dirección completa al clipboard
  - Link a Google Maps
- **Verificación**: Dirección formateada correctamente, botón copiar funciona, link funciona
- **Tiempo estimado**: 25 minutos

### Task 3.8: UserData (usuario)
- **Archivo**: `src/components/sidebar/sections/UserData.tsx`
- **Qué hacer**:
  - Crear sección "Datos del Usuario"
  - Campos:
    - Nombre completo
    - Email
    - Teléfono
    - RFC/CURP (si aplica)
    - Documento de identidad
  - Botón para editar (placeholder por ahora)
- **Verificación**: Datos personales se muestran correctamente, layout limpio
- **Tiempo estimado**: 20 minutos

### Task 3.9: Registration (placas)
- **Archivo**: `src/components/sidebar/sections/Registration.tsx`
- **Qué hacer**:
  - Crear sección "Registro y Placas"
  - Campos:
    - Estado de registro (Pendiente/En proceso/Completado)
    - Número de placas (si ya tiene)
    - Fecha estimada de placas
    - Documentos relacionados (links si existen)
  - Timeline o pasos del proceso de registro
- **Verificación**: Estado visual claro, timeline intuitivo, links funcionan
- **Tiempo estimado**: 25 minutos

### Task 3.10: TasksStatus (tareas)
- **Archivo**: `src/components/sidebar/sections/TasksStatus.tsx`
- **Qué hacer**:
  - Crear sección "Estado de Tareas"
  - Lista de tareas con checkboxes:
    - Pago inicial completado
    - Documentos enviados
    - Seguro contratado
    - Financiamiento aprobado
    - Trade-in evaluado
    - Cita de entrega agendada
  - Progreso visual (barra de progreso con %)
  - Tareas completadas vs pendientes
- **Verificación**: Checkboxes reflejan estado correcto, barra de progreso calcula bien, responsive
- **Tiempo estimado**: 30 minutos

### Task 3.11: Financing (financiamiento)
- **Archivo**: `src/components/sidebar/sections/Financing.tsx`
- **Qué hacer**:
  - Crear sección "Financiamiento"
  - Campos:
    - Estado de aprobación
    - Institución financiera
    - Monto financiado
    - Tasa de interés
    - Plazo (meses)
    - Pago mensual estimado
    - Pago inicial requerido
  - Calculadora simple o resumen visual
- **Verificación**: Datos financieros claros, cálculos correctos, estilos consistentes
- **Tiempo estimado**: 30 minutos

### Task 3.12: TradeIn (trade-in)
- **Archivo**: `src/components/sidebar/sections/TradeIn.tsx`
- **Qué hacer**:
  - Crear sección "Trade-In"
  - Campos:
    - Vehículo a cambio (marca, modelo, año)
    - Valor estimado del trade-in
    - Estado de evaluación
    - Documentos del vehículo
    - Condición del vehículo
  - Comparación: Valor vs Precio del nuevo vehículo
- **Verificación**: Información completa del vehículo actual, comparación clara
- **Tiempo estimado**: 25 minutos

### Task 3.13: Documents (documentos)
- **Archivo**: `src/components/sidebar/sections/Documents.tsx`
- **Qué hacer**:
  - Crear sección "Documentos"
  - Lista de documentos con estado:
    - Identificación oficial
    - Comprobante de domicilio
    - Constancia de situación fiscal
    - Estado de cuenta bancario
    - Seguro del vehículo
    - Pagos realizados
  - Cada documento: Nombre, estado (Pendiente/Recibido/Aprobado), fecha, link (si aplica)
  - Botón para subir documentos (placeholder)
- **Verificación**: Lista completa, estados visuales claros, links funcionan
- **Tiempo estimado**: 30 minutos

### Task 3.14: Conversion (conversión)
- **Archivo**: `src/components/sidebar/sections/Conversion.tsx`
- **Qué hacer**:
  - Crear sección "Conversión y Métricas"
  - Campos:
    - Fecha de primer contacto
    - Días en el proceso
    - Etapa del funnel actual
    - Probabilidad de conversión
    - Próxima acción requerida
    - Asesor asignado
  - Timeline del proceso de venta
- **Verificación**: Métricas calculadas correctamente, timeline claro, datos de conversión visibles
- **Tiempo estimado**: 25 minutos

---

## Fase 4: Routing & Integration

### Task 4.1: Nuevo layout.tsx para dashboard
- **Archivo**: `src/app/dashboard/layout.tsx`
- **Qué hacer**:
  - Crear layout específico para el dashboard
  - Estructura:
    - `SidebarProvider` envolviendo todo
    - `Sidebar` a la izquierda (fixed)
    - Main content area con margin-left para desktop
    - `MobileHeader` arriba (visible solo en mobile)
  - Incluir todos los `SidebarItem` necesarios mapeados desde una constante
  - Integrar `SidebarHeader` y `SidebarFooter`
- **Verificación**: Layout se renderiza, sidebar visible, responsive funciona
- **Tiempo estimado**: 35 minutos

### Task 4.2: Dynamic route [section]/page.tsx
- **Archivo**: `src/app/dashboard/[section]/page.tsx`
- **Qué hacer**:
  - Crear ruta dinámica que maneje todas las secciones
  - Params: `section` (string)
  - Mapeo de sections a componentes:
    - `estado` → OrderStatus
    - `pedido` → OrderData
    - `vehiculo` → VehicleInfo
    - `fechas` → Dates
    - `pago` → PaymentInfo
    - `entrega` → DeliveryInfo
    - `direccion` → DeliveryAddress
    - `usuario` → UserData
    - `registro` → Registration
    - `tareas` → TasksStatus
    - `financiamiento` → Financing
    - `tradein` → TradeIn
    - `documentos` → Documents
    - `conversion` → Conversion
  - Fallback 404 si la sección no existe
  - Pasar datos de la orden al componente correspondiente
- **Verificación**: Cada sección se renderiza correctamente en su URL, 404 funciona
- **Tiempo estimado**: 40 minutos

### Task 4.3: Redirect /dashboard → /dashboard/estado
- **Archivo**: `src/app/dashboard/page.tsx`
- **Qué hacer**:
  - Crear página raíz del dashboard
  - Usar `redirect()` de Next.js para redirigir a `/dashboard/estado`
  - O mostrar un resumen general con cards que linkean a cada sección
  - Decisión: Por ahora redirect simple a estado
- **Verificación**: Navegar a `/dashboard` redirige automáticamente a `/dashboard/estado`
- **Tiempo estimado**: 10 minutos

### Task 4.4: Actualizar page.tsx original
- **Archivo**: `src/app/page.tsx`
- **Qué hacer**:
  - Identificar el page.tsx existente
  - Decidir si:
    - A) Redirigir a `/dashboard` si el usuario está autenticado
    - B) Mantener como landing/login page
    - C) Modificar para integrar con nuevo sistema
  - Implementar la opción elegida (probablemente A)
- **Verificación**: Flujo de navegación funciona correctamente desde el inicio
- **Tiempo estimado**: 15 minutos

---

## Fase 5: Data Formatters (Humanización)

### Task 5.1: formatOrder.ts
- **Archivo**: `src/lib/formatters/formatOrder.ts`
- **Qué hacer**:
  - Crear formateador para datos de orden
  - Funciones:
    - `formatOrderNumber(number)` → "#12345" o "ORD-12345"
    - `formatOrderStatus(status)` → Texto humanizado con color (Ej: "pending" → "Pendiente")
    - `formatVendor(vendor)` → Nombre capitalizado
  - Retornar objetos formateados listos para UI
- **Verificación**: Todos los formatos producen output correcto, casos edge manejados
- **Tiempo estimado**: 25 minutos

### Task 5.2: formatVehicle.ts
- **Archivo**: `src/lib/formatters/formatVehicle.ts`
- **Qué hacer**:
  - Crear formateador para información de vehículo
  - Funciones:
    - `formatModel(model)` → "Model 3", "Model Y", etc.
    - `formatTrim(trim)` → "Long Range", "Performance", etc.
    - `formatColor(color)` → Nombres de colores traducidos
    - `formatWheels(wheels)` → "19\" Sport Wheels"
    - `formatAutopilot(level)` → Texto descriptivo
  - Mapeo de códigos de color a nombres amigables
- **Verificación**: Colores se traducen correctamente, nombres de modelos correctos
- **Tiempo estimado**: 30 minutos

### Task 5.3: formatPayment.ts
- **Archivo**: `src/lib/formatters/formatPayment.ts`
- **Qué hacer**:
  - Crear formateador para información de pago
  - Funciones:
    - `formatCurrency(amount)` → "$50,000.00 MXN"
    - `formatPaymentMethod(method)` → "Tarjeta de crédito", "Transferencia"
    - `formatPaymentStatus(status)` → "Pagado", "Pendiente", "En proceso"
    - `calculateTotal(items)` → Suma con descuentos
  - Soporte para diferentes monedas (MXN, USD)
- **Verificación**: Cálculos matemáticos correctos, formato de moneda localizado
- **Tiempo estimado**: 30 minutos

### Task 5.4: formatDelivery.ts
- **Archivo**: `src/lib/formatters/formatDelivery.ts`
- **Qué hacer**:
  - Crear formateador para información de entrega
  - Funciones:
    - `formatDeliveryMethod(method)` → "Recoger en centro", "Entrega a domicilio"
    - `formatDeliveryCenter(center)` → Nombre + dirección corta
    - `formatScheduledDate(date)` → Fecha con hora
    - `formatDeliveryStatus(status)` → Estado humanizado
  - Helpers para direcciones completas
- **Verificación**: Métodos traducidos correctamente, direcciones formateadas bien
- **Tiempo estimado**: 25 minutos

### Task 5.5: formatDates.ts
- **Archivo**: `src/lib/formatters/formatDates.ts`
- **Qué hacer**:
  - Crear formateador para fechas
  - Funciones:
    - `formatDateLong(date)` → "15 de marzo de 2024"
    - `formatDateShort(date)` → "15/03/2024"
    - `formatRelative(date)` → "Hace 2 días", "En 5 días", "Hoy"
    - `formatDateTime(date)` → "15 de marzo, 14:30"
    - `calculateDaysDifference(date)` → Número de días
  - Soporte para timezone local
- **Verificación**: Fechas relativas calculadas correctamente, locales funcionan
- **Tiempo estimado**: 30 minutos

### Task 5.6: formatUser.ts
- **Archivo**: `src/lib/formatters/formatUser.ts`
- **Qué hacer**:
  - Crear formateador para datos de usuario
  - Funciones:
    - `formatFullName(user)` → "Juan Pérez García"
    - `formatInitials(name)` → "JP"
    - `formatPhone(phone)` → "+52 (55) 1234-5678"
    - `formatTaxId(id)` → RFC/CURP formateado
    - `formatIdDocument(doc)` → Tipo de documento + número
  - Validación de formatos mexicanos
- **Verificación**: Formato de teléfono mexicano correcto, iniciales calculadas bien
- **Tiempo estimado**: 25 minutos

### Task 5.7: formatTasks.ts
- **Archivo**: `src/lib/formatters/formatTasks.ts`
- **Qué hacer**:
  - Crear formateador para tareas y progreso
  - Funciones:
    - `formatTaskName(taskId)` → Nombres amigables de tareas
    - `formatTaskStatus(status)` → "Completado", "Pendiente", "En progreso"
    - `calculateProgress(tasks)` → Porcentaje 0-100
    - `formatProgress(percentage)` → "75% completado"
  - Lista de tareas predefinidas con traducciones
- **Verificación**: Progreso calculado correctamente, nombres de tareas claros
- **Tiempo estimado**: 20 minutos

---

## Fase 6: Polish & Testing

### Task 6.1: Responsive testing
- **Archivo**: Múltiples (todos los componentes)
- **Qué hacer**:
  - Probar en diferentes viewports:
    - Mobile: 375px, 414px
    - Tablet: 768px
    - Desktop: 1024px, 1440px+
  - Verificar:
    - Sidebar se comporta correctamente (slide en mobile, fixed en desktop)
    - Contenido no se desborda
    - Texto legible en todos los tamaños
    - Touch targets mínimo 44px en mobile
  - Hacer ajustes donde sea necesario
- **Verificación**: App usable en todos los breakpoints, no hay scroll horizontal no deseado
- **Tiempo estimado**: 45 minutos

### Task 6.2: Transiciones y animaciones
- **Archivo**: `src/components/sidebar/Sidebar.tsx`, CSS/Tailwind
- **Qué hacer**:
  - Agregar transiciones suaves:
    - Apertura/cierre del sidebar (300ms ease-out)
    - Cambio de sección (fade in/out, 200ms)
    - Hover states (150ms)
    - Active states (instant)
  - Usar `transition-transform`, `transition-opacity`, `transition-colors`
  - Evitar animaciones que causen layout shift
  - Respetar `prefers-reduced-motion`
- **Verificación**: Transiciones suaves pero rápidas, no molestas, accesibles
- **Tiempo estimado**: 35 minutos

### Task 6.3: Tooltips explicativos en todas las secciones
- **Archivo**: Todos los archivos en `src/components/sidebar/sections/`
- **Qué hacer**:
  - Revisar cada sección y agregar InfoTooltip donde sea útil:
    - Título de cada sección (explicar qué información muestra)
    - Campos técnicos o ambiguos
    - Estados que puedan ser confusos
    - Abreviaturas (RFC, VIN, etc.)
  - Contenido de tooltips: Breve explicación clara (1-2 líneas)
  - No saturar, solo donde aporte valor
- **Verificación**: Cada sección tiene al menos un tooltip útil, contenido claro
- **Tiempo estimado**: 30 minutos

### Task 6.4: Estilos Tesla consistentes
- **Archivo**: Todos los componentes, Tailwind config
- **Qué hacer**:
  - Revisar y unificar:
    - Colores: Usar rojo Tesla (#E82127) para acciones primarias
    - Tipografía: Font weights consistentes (normal, medium, semibold, bold)
    - Espaciado: Sistema de 4px base (4, 8, 12, 16, 24, 32, 48, 64)
    - Bordes: Radius consistentes (4px para inputs, 8px para cards)
    - Sombras: Sistema de sombras suaves
  - Crear/actualizar clases utilitarias si es necesario
  - Documentar en comentarios si hay decisiones especiales
- **Verificación**: Todo el sidebar se ve coherente, ningún estilo fuera de lugar
- **Tiempo estimado**: 40 minutos

### Task 6.5: Empty states
- **Archivo**: Todos los section components
- **Qué hacer**:
  - Diseñar y implementar estados vacíos para cada sección:
    - Mensaje amigable (ej: "No hay información de pago disponible")
    - Icono ilustrativo (opcional)
    - Acción sugerida si aplica (ej: "Completar perfil")
  - Manejar casos:
    - Datos aún no disponibles (null/undefined)
    - Error al cargar datos
    - Usuario nuevo sin datos históricos
  - Estilos consistentes con el resto de la app
- **Verificación**: Cada sección muestra algo útil cuando no hay datos, no hay pantallas en blanco
- **Tiempo estimado**: 35 minutos

---

## Checklist Final

Antes de marcar el cambio como completado, verificar:

- [ ] Todas las fases 1-6 están implementadas
- [ ] TypeScript compila sin errores (`npm run type-check` o `tsc --noEmit`)
- [ ] No hay errores en consola del navegador
- [ ] Tests pasan (si existen)
- [ ] Responsive funciona en mobile, tablet y desktop
- [ ] Transiciones son suaves y accesibles
- [ ] Todos los tooltips funcionan y aportan valor
- [ ] Estilos son consistentes con el diseño Tesla
- [ ] Empty states están implementados
- [ ] El flujo de navegación es intuitivo
- [ ] Código limpio, sin console.logs, sin comentarios innecesarios

## Estimación Total

- **Fase 1**: 85 minutos (~1.5 horas)
- **Fase 2**: 155 minutos (~2.5 horas)
- **Fase 3**: 400 minutos (~6.5 horas)
- **Fase 4**: 100 minutos (~1.5 horas)
- **Fase 5**: 185 minutos (~3 horas)
- **Fase 6**: 185 minutos (~3 horas)

**Total estimado**: ~18 horas de trabajo

## Notas de Implementación

1. **Dependencias**: Asegurar que estén instaladas:
   - `@heroicons/react` o `lucide-react` para iconos
   - `@radix-ui/react-tooltip` o similar para tooltips accesibles

2. **Datos**: Usar mocks iniciales, luego integrar con API existente

3. **Prioridad**: Si el tiempo es limitado, priorizar:
   - Fases 1-2 (infraestructura base)
   - Tasks 3.1, 3.2, 3.3 (secciones más importantes)
   - Fase 4 (routing)
   - El resto se puede iterar después

4. **Testing**: Considerar agregar tests unitarios para:
   - Formatters (Fase 5)
   - Sidebar logic (context y hooks)
   - Navegación entre secciones
