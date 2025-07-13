import { generateObject } from "ai"
import { google } from "@ai-sdk/google"
import { z } from "zod"

const predictionSchema = z.object({
  disease: z.string().describe("Clear, concise name of the predicted condition"),
  description: z
    .string()
    .describe("Comprehensive description with proper formatting using **bold** for important terms"),
  severity: z.enum(["Mild", "Moderate", "Severe"]).describe("Severity level of the condition"),
  precautions: z.array(z.string()).describe("5-7 specific safety precautions with **bold** formatting for key terms"),
  medications: z
    .array(z.string())
    .describe("Modern medications available in India with **bold** formatting for drug names"),
  traditionalMedicines: z
    .array(z.string())
    .describe(
      "Traditional Indian medicines and herbs with **bold** formatting for medicine names and preparation methods",
    ),
  homeRemedies: z
    .array(z.string())
    .describe("Detailed home remedies with **bold** formatting for ingredients and methods"),
  diet: z.string().describe("Comprehensive dietary plan with **bold** formatting for important foods and nutrients"),
  workouts: z
    .array(z.string())
    .describe("Specific exercises and practices with **bold** formatting for exercise names"),
  consultationAdvice: z
    .string()
    .describe("When and what type of medical consultation is recommended with **bold** formatting"),
})

export async function POST(req: Request) {
  try {
    const { symptoms } = await req.json()

    if (!symptoms || typeof symptoms !== "string") {
      return Response.json({ error: "Please provide valid symptoms" }, { status: 400 })
    }

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error("Google AI API key is missing")
      return Response.json({
        disease: "Service Configuration Error",
        description:
          "The AI medical service is currently unavailable. Please try again later or consult a healthcare professional directly.",
        severity: "Moderate" as const,
        precautions: [
          "Consult with a **qualified healthcare professional** immediately",
          "Monitor your symptoms closely and note any **changes or worsening**",
          "Stay **well-hydrated** and maintain proper rest",
          "Avoid **self-medication** without professional guidance",
          "Seek **emergency care** if symptoms worsen rapidly",
        ],
        medications: ["Consult a **doctor** before taking any medications"],
        traditionalMedicines: ["Consult a **traditional medicine practitioner** for herbal treatments"],
        homeRemedies: ["Stay **hydrated** with warm water", "Get **adequate rest**", "Maintain **proper hygiene**"],
        diet: "Follow a **light, easily digestible diet** with plenty of fluids until you can consult a healthcare provider.",
        workouts: [
          "**Light walking** if comfortable",
          "**Deep breathing exercises**",
          "**Adequate rest** is most important",
        ],
        consultationAdvice: "**Immediate medical consultation** recommended due to service unavailability",
      })
    }

    const result = await generateObject({
      model: google("gemini-2.0-flash-exp", {
        apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      }),
      system: `You are an expert medical AI assistant specializing in Indian healthcare systems. You have comprehensive knowledge of:

- Modern medical diagnosis and treatment protocols
- Traditional Indian medicine, herbs, and healing practices
- Home remedies using common Indian household ingredients
- Indian dietary practices and therapeutic foods
- Practical treatment options suitable for Indian patients
- Yoga, pranayama, and traditional healing practices
- Indian pharmaceutical market and medicine availability

IMPORTANT FORMATTING RULES:
- Use **bold formatting** (double asterisks) for all important terms, medicine names, ingredients, and key concepts
- Format medicine names like **Triphala**, **Tulsi**, **Ashwagandha**
- Bold important instructions and dosages
- Bold key dietary recommendations and foods
- Bold exercise names and important precautions

Your responses should be:
- Culturally appropriate for Indian patients
- Practical and accessible
- Include both modern and traditional treatment approaches
- Emphasize prevention and holistic wellness
- Consider accessibility of treatments in Indian context
- Properly formatted with bold text for clarity

Always prioritize patient safety and recommend professional medical consultation when necessary.`,

      prompt: `Patient presents with these symptoms: ${symptoms}

Provide a comprehensive medical analysis with proper **bold formatting** for all important terms:

1. **Disease/Condition**: Most likely diagnosis based on symptoms
2. **Description**: Detailed explanation with **bold formatting** for key medical terms and concepts
3. **Severity Assessment**: Classify as Mild, Moderate, or Severe
4. **Safety Precautions**: 5-7 specific preventive measures with **bold formatting** for critical actions
5. **Modern Medications**: List medicines available in Indian pharmacies with **bold formatting** for drug names
6. **Traditional Indian Medicines**: Specific treatments including:
   - Traditional formulations with **bold names** like **Triphala**, **Ashwagandha**
   - Medicinal herbs with **bold names** and usage (e.g., "**Tulsi leaves**: Boil 10-12 leaves in water, drink **twice daily**")
   - Traditional remedies with **bold preparation methods**
7. **Home Remedies**: Detailed remedies with **bold formatting** for:
   - **Ingredient names** and quantities
   - **Preparation methods** and usage instructions
   - **Timing and frequency** of application
8. **Dietary Recommendations**: Comprehensive Indian diet plan with **bold formatting** for:
   - **Beneficial foods** and **spices**
   - **Meal timing** and portion suggestions
   - **Foods to avoid** and why
   - **Therapeutic recipes** if applicable
9. **Exercise & Activities**: Specific activities with **bold formatting** for exercise names and yoga poses
10. **Consultation Advice**: When to seek medical help with **bold formatting** for urgency levels

Focus on:
- Practical, accessible solutions for Indian families
- Using locally available ingredients and medicines
- Both immediate relief and long-term management strategies
- Prevention and lifestyle modifications
- Integration of modern and traditional approaches
- Proper **bold formatting** throughout for clarity

Important: If symptoms indicate a serious condition, emphasize urgent medical consultation while still providing helpful guidance.`,

      schema: predictionSchema,
    })

    return Response.json(result.object)
  } catch (error) {
    console.error("Prediction API error:", error)

    return Response.json({
      disease: "Analysis Unavailable",
      description:
        "Unable to process the symptoms at this time. The symptoms may require **professional medical evaluation** for accurate diagnosis.",
      severity: "Moderate" as const,
      precautions: [
        "Consult with a **qualified healthcare professional** promptly",
        "Keep a **detailed record** of all symptoms and their progression",
        "Stay **well-hydrated** with clean, boiled water",
        "Maintain **proper hygiene** and wash hands frequently",
        "Get **adequate rest** and avoid strenuous activities",
        "Monitor **body temperature** and vital signs if possible",
        "Avoid **self-medication** without professional guidance",
      ],
      medications: [
        "Do not take any medications without consulting a **doctor**",
        "If fever persists, **Paracetamol** may be considered under medical guidance",
        "Complete any **prescribed medication courses** as directed",
      ],
      traditionalMedicines: [
        "**Tulsi** (Holy Basil) tea: Boil **8-10 fresh leaves** in water, drink **twice daily** for immunity",
        "**Ginger-turmeric** milk: Add **1/2 tsp each** to warm milk before bedtime",
        "**Triphala** powder: **1 tsp** with warm water at night for digestive health",
        "Consult an experienced **traditional medicine practitioner** for personalized treatment",
      ],
      homeRemedies: [
        "**Warm salt water** gargling: Mix **1/2 tsp salt** in warm water, gargle **3-4 times daily**",
        "**Steam inhalation**: Add few drops of **eucalyptus oil** to hot water and inhale",
        "**Honey-lemon** water: Mix **1 tsp honey** with **half lemon juice** in warm water, drink on **empty stomach**",
        "Apply **warm compress** to affected areas for pain relief",
      ],
      diet: "Follow a **light, easily digestible diet** with plenty of fluids. Include fresh fruits like **oranges and pomegranates**, vegetables, **whole grains**, and avoid **spicy, oily, or processed foods**. Drink **herbal teas** and maintain **regular meal times**. Include immunity-boosting spices like **turmeric**, **ginger**, and **garlic** in cooking.",
      workouts: [
        "**Light walking** for 15-20 minutes if feeling well enough",
        "**Gentle stretching exercises** to maintain flexibility",
        "**Deep breathing exercises** (Pranayama) for relaxation",
        "Avoid **intense physical activity** until symptoms improve",
      ],
      consultationAdvice:
        "Seek **medical consultation within 24-48 hours** if symptoms persist or worsen. Visit a **general physician** first, and consider **specialist referral** if needed.",
    })
  }
}
