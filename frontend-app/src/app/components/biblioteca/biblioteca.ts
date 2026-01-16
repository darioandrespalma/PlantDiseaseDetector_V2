import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Angular Material
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

interface FichaEnfermedad {
  cultivo: string;
  enfermedad: string;
  sintomas: string;
  condiciones: string;
  manejoCultural: string;
  manejoOrganico: string;
  manejoQuimico: string;
  relacionIA: string;
  severidad: 'alta' | 'media' | 'baja';
  temporada: string;
}

@Component({
  selector: 'app-biblioteca',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    MatExpansionModule,
    MatListModule,
    MatDividerModule,
    MatButtonModule
  ],
  templateUrl: './biblioteca.html',
  styleUrls: ['./biblioteca.css']
})
export class BibliotecaComponent {

  // 🧪 Fichas técnicas que se muestran en la pestaña 1
  fichas: FichaEnfermedad[] = [
    {
      cultivo: 'Banano',
      enfermedad: 'Sigatoka negra',
      severidad: 'alta',
      temporada: '🌧️ Épocas lluviosas',
      sintomas:
        'Manchas ovaladas de color café oscuro con halo amarillento en el tercio medio e inferior de la hoja. ' +
        'Las hojas se secan desde la punta hacia la base y pierden área verde rápidamente.',
      condiciones:
        'Alta humedad relativa, lluvias frecuentes, plantaciones muy densas y con poca ventilación. ' +
        'Temperaturas cálidas favorecen el desarrollo del hongo.',
      manejoCultural:
        'Eliminar hojas muy afectadas, mejorar la ventilación entre plantas, mantener la plantación limpia ' +
        'y usar material de siembra sano.',
      manejoOrganico:
        'Aplicar extractos vegetales (por ejemplo, ajo, cola de caballo u otros fungicidas biológicos ' +
        'autorizados) de manera preventiva y después de lluvias intensas.',
      manejoQuimico:
        'Uso racional de fungicidas sistémicos y de contacto, alternando ingredientes activos para evitar ' +
        'resistencias. Siempre bajo recomendación de un agrónomo o técnico especializado.',
      relacionIA:
        'La Sigatoka negra es una de las clases que detecta el modelo de IA para banano. ' +
        'Cuando subes una foto de hoja de banano, el modelo analiza el patrón de manchas y puede ' +
        'clasificarla como "sigatoka" con un porcentaje de confianza.'
    },
    {
      cultivo: 'Arroz',
      enfermedad: 'Tizón (Blast)',
      severidad: 'alta',
      temporada: '☀️ Climas cálido-húmedos',
      sintomas:
        'Lesiones pequeñas que crecen hasta formar manchas elípticas de color gris claro con bordes café oscuro. ' +
        'Pueden aparecer en hojas, nudos y panículas, causando el secado de la planta.',
      condiciones:
        'Ambientes cálidos y húmedos, manejo excesivo de nitrógeno, alta densidad de siembra y mala ventilación ' +
        'favorecen el tizón.',
      manejoCultural:
        'Usar variedades tolerantes, evitar exceso de nitrógeno, manejar adecuadamente la lámina de agua ' +
        'y eliminar residuos muy infectados.',
      manejoOrganico:
        'Uso de biofungicidas registrados, extractos de plantas y fortalecimiento de la planta con buena nutrición.',
      manejoQuimico:
        'Aplicar fungicidas específicos para tizón siguiendo dosis y épocas recomendadas por el servicio técnico.',
      relacionIA:
        'El modelo de IA para arroz diferencia entre hojas sanas, mancha marrón y tizón. ' +
        'El patrón y forma de las lesiones ayuda a que el modelo identifique esta enfermedad.'
    },
    {
      cultivo: 'Café',
      enfermedad: 'Roya del café',
      severidad: 'media',
      temporada: '🌡️ Todo el año (clima templado)',
      sintomas:
        'Pequeñas pústulas de color anaranjado en la cara inferior de la hoja. ' +
        'Las hojas se tornan amarillas y terminan cayendo, reduciendo la producción.',
      condiciones:
        'Climas húmedos y templados, plantaciones sombreadas y densas, exceso de humedad en el follaje.',
      manejoCultural:
        'Podas sanitarias, regulación de la sombra, buena aireación y nutrición balanceada del cafetal.',
      manejoOrganico:
        'Aplicación de productos biológicos a base de microorganismos benéficos o extractos vegetales ' +
        'aprobados para café.',
      manejoQuimico:
        'Uso responsable de fungicidas cúpricos o sistémicos según la recomendación de un agrónomo. ' +
        'Respetar periodos de carencia.',
      relacionIA:
        'En el modelo de IA para café, la roya es una de las clases principales. ' +
        'El color anaranjado de las pústulas y su distribución en la hoja son claves para la detección automática.'
    }
  ];

  // 🔍 Pasos para explicar cómo funciona la IA (pestaña 2)
  pasosIA = [
    {
      icon: 'photo_camera',
      titulo: '1. Toma de la foto',
      texto:
        'El agricultor toma una foto de la hoja desde la aplicación web o móvil, ' +
        'tratando de que la hoja ocupe la mayor parte de la imagen y esté bien enfocada.'
    },
    {
      icon: 'cloud_upload',
      titulo: '2. Envío al servidor',
      texto:
        'La imagen viaja al backend en Node.js (backend-api), donde se asocia al usuario, cultivo y lote. ' +
        'Desde allí se reenvía al microservicio de IA en Python.'
    },
    {
      icon: 'analytics',
      titulo: '3. Microservicio de IA (Python)',
      texto:
        'Según el cultivo seleccionado (banano, arroz o café), Python carga el modelo correspondiente ' +
        'y aplica un preprocesamiento específico a la imagen (redimensionar, normalizar, filtrado, etc.).'
    },
    {
      icon: 'science',
      titulo: '4. Predicción del modelo',
      texto:
        'El modelo calcula la probabilidad de cada clase (por ejemplo: sigatoka, sana, otras enfermedades) ' +
        'y selecciona la de mayor probabilidad como diagnóstico principal.'
    },
    {
      icon: 'database',
      titulo: '5. Guardado en la base de datos',
      texto:
        'El backend guarda el resultado en la colección "predictions" de MongoDB, incluyendo fecha, ' +
        'usuario, cultivo, enfermedad detectada, confianza y ruta de la imagen.'
    },
    {
      icon: 'insights',
      titulo: '6. Visualización y recomendaciones',
      texto:
        'El frontend muestra el diagnóstico con el porcentaje de confianza y permite abrir la ficha técnica ' +
        'en la Biblioteca para entender mejor la enfermedad y sus opciones de manejo.'
    }
  ];

  // 📸 Recomendaciones para tomar fotos y buenas prácticas (pestaña 3)
  tipsFotos = [
    'Evita tomar la foto contra la luz; es mejor que la luz venga desde atrás del celular.',
    'Asegúrate de que la hoja esté bien enfocada y ocupe la mayor parte de la imagen.',
    'No mezcles muchas hojas en una sola foto; es mejor una hoja principal clara.',
    'Evita fotos muy oscuras o con sombras fuertes sobre la hoja.',
    'Limpia ligeramente la superficie si está cubierta de polvo, barro o agua.'
  ];

  tipsMIP = [
    'Realiza monitoreos frecuentes en la finca para detectar problemas a tiempo.',
    'Practica rotación de cultivos cuando sea posible para reducir la presión de plagas.',
    'Usa siempre equipos de protección personal al aplicar productos químicos.',
    'Combina manejo cultural, biológico y químico: ningún método por sí solo es suficiente.',
    'Consulta a un técnico local antes de aplicar productos no conocidos.'
  ];

  glosario = [
    { termino: 'Fungicida', definicion: 'Producto que se utiliza para prevenir o controlar enfermedades causadas por hongos.' },
    { termino: 'MIP', definicion: 'Manejo Integrado de Plagas: combinación de diferentes métodos de control para reducir daños.' },
    { termino: 'Patógeno', definicion: 'Microorganismo (hongo, bacteria, virus) que causa enfermedad en las plantas.' },
    { termino: 'Roya', definicion: 'Enfermedad causada por hongos que forman pústulas de color amarillo o anaranjado.' },
    { termino: 'Tizón', definicion: 'Daño fuerte y rápido de hojas o tallos, que se ven como quemados o secos.' },
    { termino: 'Clorosis', definicion: 'Amarillamiento de las hojas por falta de nutrientes o daño en el tejido.' }
  ];
}
