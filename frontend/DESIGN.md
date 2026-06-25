# Sistema de Diseño: Vital Blood Management (Hemocentro)

## Identidad de Marca
- Nombre del Producto: Hemocentro
- Eslogan Operativo: Salvando vidas a través de la precisión.
- Personalidad: Profesional, médico, confiable, eficiente y sobrio.

## Fundamentos Visuales

### Paleta de Colores
- Primario: #bc002d (Rojo Sangre Institucional) - Utilizado para acciones principales (CTAs), alertas críticas y branding.
- Superficie: #fff8f7 (Blanco con matiz cálido) - Color de fondo principal para reducir la fatiga visual.
- Contenedores: #ffffff (Blanco puro) - Para tarjetas y secciones de formularios.
- Estados:
  - Crítico: #bc002d / Rojo
  - Bajo: Naranja
  - Saludable/Suficiente: Verde
- Bordes/Outline: #f1d3d2 (Matiz suave del primario).

### Tipografía
- Fuente Principal: Inter (Sans-serif)
- Escala:
  - Display: font-display (Para titulares de impacto)
  - Headline: font-headline-md (Para títulos de sección)
  - Body: font-body-md (Lectura general y datos técnicos)
  - Label: font-label-md (Etiquetas de formulario y estados)

### Formas y Espaciado
- Redondez: ROUND_FOUR (Esquinas suavizadas pero profesionales).
- Elevación: Estilo mayoritariamente plano con sombras muy sutiles (shadow-sm) para mantener un aspecto moderno y limpio.

## Componentes Compartidos

### Navegación Superior (TopAppBar)
- Elementos: Logo de Hemocentro, buscador global, notificaciones, ayuda y perfil de usuario.
- Comportamiento: Fijo en la parte superior con borde inferior sutil.

### Navegación Lateral (SideNavBar)
- Secciones: Dashboard, Donantes, Donaciones, Campañas, Inventario, Reportes.
- Acciones Rápidas: Botón "+" para Nueva Donación destacado en la parte inferior.

### Tarjetas de Estado (Inventory Cards)
- Indicadores visuales de stock por tipo sanguíneo con barras de progreso y etiquetas de estado (Crítico, Bajo, Suficiente).

## Principios de Diseño
1. Prioridad de Datos: En formularios médicos, el espacio y la legibilidad de las etiquetas son prioritarios.
2. Jerarquía de Color: El rojo se reserva estrictamente para el branding y situaciones de urgencia médica.
3. Flujo Lineal: Los formularios se estructuran de arriba hacia abajo, agrupando datos relacionados (Información General, Datos Técnicos, Observaciones).