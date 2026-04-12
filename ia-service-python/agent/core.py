"""
Agente Agrónomo Experto — SDK google-genai (Blindado v3.0)
Mejoras: Traducción de cultivos, Pre-flight check de API, Fuzzy Matching robusto.
"""

import time
import os
from google import genai
from google.genai import types

# ============================================================
# CONFIGURACIÓN
# ============================================================
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyBBf5IBLKE8pVBSCy6CU8_QRP5l6glicxc")
client = genai.Client(api_key=GEMINI_API_KEY)

GEMINI_MODELS = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash",
]

# Traductor visual para el frontend
CROP_TRANSLATIONS = {
    "corn": "Maíz",
    "tomato": "Tomate",
    "apple": "Manzano",
    "banana": "Banano",
    "coffee": "Café",
    "rice": "Arroz"
}

# ============================================================
# CONTEXTO AGRONÓMICO LOCAL (fallback sin internet)
# ============================================================
AGRONOMIC_CONTEXT = {
    # ... [MANTÉN EXACTAMENTE TU DICCIONARIO AGRONOMIC_CONTEXT AQUÍ COMO LO TIENES AHORA] ...
    "apple": {
        "apple_scab": { "sintomas": "Manchas oscuras con textura de corcho en hojas y frutos.", "tratamiento": "Fungicidas cúpricos o azufre, aplicar en brotes tempranos.", "prevencion": "Poda para mejorar ventilación, retirar hojas caídas.", "urgencia": "ALTA" },
        "apple_black_rot": { "sintomas": "Manchas marrones con anillos concéntricos, momificación de frutos.", "tratamiento": "Eliminar frutos infectados, fungicidas con captan o mancozeb.", "prevencion": "Higiene del huerto, evitar heridas en corteza.", "urgencia": "ALTA" },
        "cedar_apple_rust": { "sintomas": "Manchas amarillo-anaranjadas en hojas, tubos espóricos en cara inferior.", "tratamiento": "Fungicidas preventivos (miclobutanil) antes del brote.", "prevencion": "Eliminar cedros cercanos, variedades resistentes.", "urgencia": "MEDIA" },
        "healthy": { "sintomas": "Planta sin signos de enfermedad.", "tratamiento": "Mantener fertilización y riego.", "prevencion": "Monitoreo regular.", "urgencia": "NINGUNA" }
    },
    "banana": {
        "cordana": { "sintomas": "Manchas ovaladas marrón-amarillentas con halo amarillo.", "tratamiento": "Fungicidas sistémicos (propiconazol), eliminar hojas afectadas.", "prevencion": "Evitar exceso de humedad, riego por goteo.", "urgencia": "MEDIA" },
        "pestalotiopsis": { "sintomas": "Lesiones necróticas con borde marrón oscuro y halo clorótico.", "tratamiento": "Cobre + mancozeb, mejorar drenaje.", "prevencion": "Evitar daños físicos en plantas.", "urgencia": "MEDIA" },
        "sigatoka": { "sintomas": "Rayas amarillas que evolucionan a manchas negras, necrosis severa.", "tratamiento": "Fungicidas sistémicos (triazoles), programa de aspersiones.", "prevencion": "Variedades tolerantes, eliminar hojas enfermas.", "urgencia": "MUY ALTA" },
        "healthy": { "sintomas": "Planta vigorosa sin lesiones.", "tratamiento": "Fertilización balanceada K-N-Mg.", "prevencion": "Monitoreo semanal.", "urgencia": "NINGUNA" }
    },
    "coffee": {
        "rust": { "sintomas": "Pústulas amarillo-anaranjadas en cara inferior de hoja (roya).", "tratamiento": "Fungicidas cúpricos o triazoles al 5% de incidencia.", "prevencion": "Variedades resistentes, fertilización con K.", "urgencia": "MUY ALTA" },
        "miner": { "sintomas": "Galerías sinuosas en el interior de la hoja.", "tratamiento": "Insecticidas sistémicos (imidacloprid), control biológico.", "prevencion": "Trampas amarillas, enemigos naturales.", "urgencia": "MEDIA" },
        "healthy": { "sintomas": "Hojas brillantes verde intenso, sin manchas.", "tratamiento": "Abono orgánico + foliar de micronutrientes.", "prevencion": "Monitoreo quincenal.", "urgencia": "NINGUNA" }
    },
    "rice": {
        "manchamarron": { "sintomas": "Manchas ovaladas marrones con centro grisáceo.", "tratamiento": "Fungicidas (carbendazim), corregir nutrición K y Si.", "prevencion": "Semilla certificada, dosis adecuada de potasio.", "urgencia": "ALTA" },
        "tizon": { "sintomas": "Lesiones romboidales con centro gris y borde marrón (blast).", "tratamiento": "Tricyclazol o azoxistrobina al inicio de síntomas.", "prevencion": "Variedades resistentes, evitar exceso de nitrógeno.", "urgencia": "MUY ALTA" },
        "saludable": { "sintomas": "Macollamiento normal, hojas verdes.", "tratamiento": "Plan nutricional N-P-K según etapa.", "prevencion": "Manejo integrado, monitoreo de lámina de agua.", "urgencia": "NINGUNA" }
    },
    "tomato": {
        "early_blight": { "sintomas": "Manchas oscuras concéntricas (tipo 'ojo de buey') en hojas viejas.", "tratamiento": "Fungicidas con clorotalonil o cobre. Podar hojas bajas.", "prevencion": "Rotación de cultivos, riego por goteo, evitar mojar el follaje.", "urgencia": "ALTA" },
        "late_blight": { "sintomas": "Manchas verde oscuro/grisáceas de apariencia húmeda que necrosan rápido.", "tratamiento": "Fungicidas sistémicos (mancozeb, mefenoxam) de inmediato.", "prevencion": "Variedades resistentes, destruir restos de cultivos infectados.", "urgencia": "MUY ALTA" },
        "bacterial_spot": { "sintomas": "Pequeñas lesiones necróticas angulares con halo amarillo.", "tratamiento": "Aplicaciones de sulfato de cobre + mancozeb.", "prevencion": "Semilla certificada libre de bacterias, desinfección de herramientas.", "urgencia": "ALTA" },
        "leaf_mold": { "sintomas": "Manchas verde pálido a amarillo en el haz; moho verde-oliva en el envés.", "tratamiento": "Mejorar ventilación, fungicidas preventivos.", "prevencion": "Aumentar espacio entre plantas, control de humedad en invernaderos.", "urgencia": "MEDIA" },
        "healthy": { "sintomas": "Hojas verdes y vigorosas.", "tratamiento": "Mantener plan nutricional.", "prevencion": "Monitoreo preventivo.", "urgencia": "NINGUNA" }
    },
    "corn": {
        "blight": { "sintomas": "Lesiones largas, elípticas, de color verde grisáceo a marrón.", "tratamiento": "Aplicación de fungicidas (triazoles/estrobilurinas) en etapas tempranas.", "prevencion": "Siembra de híbridos resistentes, manejo de residuos (labranza).", "urgencia": "ALTA" },
        "gray_spot": { "sintomas": "Manchas rectangulares grises o marrones restringidas por las nervaduras.", "tratamiento": "Fungicidas protectantes si el clima es muy húmedo.", "prevencion": "Rotación de cultivos por al menos 1-2 años.", "urgencia": "MEDIA" },
        "rust": { "sintomas": "Pústulas de color rojo ladrillo a marrón en ambas caras de la hoja.", "tratamiento": "Fungicidas foliares si la infección ocurre antes del llenado del grano.", "prevencion": "Uso de híbridos con resistencia genética.", "urgencia": "MEDIA" },
        "healthy": { "sintomas": "Plantas con desarrollo foliar normal.", "tratamiento": "Nutrición con nitrógeno y fósforo.", "prevencion": "Monitoreo de plagas y malezas.", "urgencia": "NINGUNA" }
    }
}

# ============================================================
# FUNCIÓN PRINCIPAL BLINDADA
# ============================================================
def generate_agronomist_response(
    user_query: str,
    crop: str,
    prediction_result: str,
    confidence: float,
    max_retries: int = 2
) -> str:

    local_context = _get_local_context(crop, prediction_result)
    
    # PRE-FLIGHT CHECK: Evitar llamar a la API si la llave es inválida o es la de por defecto
    if not GEMINI_API_KEY or GEMINI_API_KEY == "AIzaSyBBf5IBLKE8pVBSCy6CU8_QRP5l6glicxc":
        print("[Agente] Llave API no configurada o por defecto. Activando protocolo Fallback inmediato.")
        return _generate_fallback_response(crop, prediction_result, confidence, local_context)

    prompt = _build_expert_prompt(user_query, crop, prediction_result, confidence, local_context)

    last_error = None
    for model_name in GEMINI_MODELS:
        for attempt in range(max_retries):
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        temperature=0.4,
                        max_output_tokens=600,
                        top_p=0.85,
                    )
                )

                if response.text and len(response.text.strip()) > 50:
                    print(f"[Agente] OK con {model_name} (intento {attempt+1})")
                    return response.text.strip()

            except Exception as e:
                last_error = str(e)
                print(f"[Agente] Error con {model_name} intento {attempt+1}: {e}")
                if attempt < max_retries - 1:
                    time.sleep(1.5)

    print(f"[Agente] Todos los modelos fallaron. Usando fallback local. Último error: {last_error}")
    return _generate_fallback_response(crop, prediction_result, confidence, local_context)


# ============================================================
# AUXILIARES BLINDADOS
# ============================================================
def _get_local_context(crop: str, prediction_result: str) -> dict:
    crop_lower = crop.lower()
    # Limpieza estricta para asegurar que haga match
    pred_lower = prediction_result.lower().replace(" ", "_").replace("corn_", "").replace("tomato_", "").replace("apple_", "")
    
    crop_data = AGRONOMIC_CONTEXT.get(crop_lower, {})

    # Match exacto
    if pred_lower in crop_data:
        return crop_data[pred_lower]
        
    # Match difuso (Fuzzy Matching)
    for key in crop_data:
        if key in pred_lower or pred_lower in key:
            return crop_data[key]

    return {
        "sintomas": "Síntomas variables según la condición detectada.",
        "tratamiento": "Consultar con agrónomo local o aplicar medidas preventivas de amplio espectro.",
        "prevencion": "Monitoreo regular y buenas prácticas culturales.",
        "urgencia": "CONSULTAR"
    }


def _build_expert_prompt(user_query, crop, prediction_result, confidence, context):
    crop_es = CROP_TRANSLATIONS.get(crop.lower(), crop.capitalize())
    return f"""Eres un Agrónomo Senior especialista en patología vegetal.

=== DIAGNÓSTICO IA ===
- Cultivo: {crop_es.upper()}
- Condición detectada: {prediction_result}
- Confianza: {confidence:.1f}%
- Urgencia estimada: {context.get('urgencia', 'MEDIA')}
- Referencia técnica: {context.get('sintomas', '')}

=== CONSULTA ===
"{user_query}"

=== INSTRUCCIONES ===
1. Saluda amablemente.
2. Explica en 1-2 oraciones qué significa para su cultivo de {crop_es}.
3. Da exactamente 3 acciones concretas con viñetas (•).
4. Si confianza < 70%, añade nota de precaución.
5. Cierra con frase motivadora. Máximo 250 palabras. En español."""


def _generate_fallback_response(crop, prediction_result, confidence, context):
    urgencia_icons = {"MUY ALTA": "🔴", "ALTA": "🟠", "MEDIA": "🟡", "NINGUNA": "🟢", "CONSULTAR": "🔵"}
    icono = urgencia_icons.get(context.get("urgencia", "CONSULTAR"), "🔵")
    
    # Traducción del cultivo para el usuario
    crop_es = CROP_TRANSLATIONS.get(crop.lower(), crop.capitalize())

    nota = ""
    if confidence < 70:
        nota = f"\n\n⚠️ **Nota:** Confianza del {confidence:.1f}%. Por favor, confirma con una segunda foto o un especialista."

    return f"""Hola, analizamos tu cultivo de **{crop_es}**.

{icono} **Diagnóstico IA:** {prediction_result} — Nivel de Urgencia: {context.get('urgencia', 'MEDIA')}

{context.get('sintomas', '')}

**Acciones recomendadas (Protocolo Técnico):**
• {context.get('tratamiento', 'Consulta con un especialista.')}
• Revisa plantas vecinas para detectar propagación temprana.
• {context.get('prevencion', 'Mantén buenas prácticas culturales y de ventilación.')}{nota}

¡La atención temprana es clave! Contacta a tu extensionista agrícola si los síntomas persisten."""