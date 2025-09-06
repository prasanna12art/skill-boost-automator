import { GoogleGenAI, Type } from "@google/genai";
import { Lab, LabStep } from "../types";

// FIX: Implement the Gemini service to interact with the Google GenAI API.
// Per coding guidelines, initialize with API_KEY from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const model = 'gemini-2.5-flash';

/**
 * Generates a list of steps for a given lab using the Gemini API.
 * @param labTitle - The title of the lab.
 * @param labDescription - The description of the lab.
 * @returns A promise that resolves to an array of lab steps.
 */
export const generateLabSteps = async (labTitle: string, labDescription:string): Promise<Omit<LabStep, 'id' | 'isCompleted'>[]> => {
    const prompt = `
    Based on the following Google Cloud Platform lab title and description, generate a concise list of 4-5 high-level steps to complete the lab.
    Each step must have a 'title' and 'instructions'.
    The instructions should be brief, clear, and actionable (1-2 sentences).

    Lab Title: "${labTitle}"
    Lab Description: "${labDescription}"

    Return the output as a JSON array of objects.
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: {
                                type: Type.STRING,
                                description: "The title of the lab step.",
                            },
                            instructions: {
                                type: Type.STRING,
                                description: "The instructions for completing the lab step.",
                            },
                        },
                        required: ["title", "instructions"],
                    },
                },
            },
        });
        
        const jsonText = response.text.trim();
        const steps = JSON.parse(jsonText);
        
        // Basic validation of the returned data
        if (!Array.isArray(steps) || steps.some(s => typeof s.title !== 'string' || typeof s.instructions !== 'string')) {
            throw new Error("Invalid format for lab steps received from API.");
        }

        return steps;
    } catch (error) {
        console.error("Error generating lab steps:", error);
        throw new Error("Failed to generate lab steps using the Gemini API.");
    }
};

/**
 * Generates learning insights based on the user's lab history.
 * @param labs - The list of all labs.
 * @returns A promise that resolves to a markdown string with insights.
 */
export const generateInsights = async (labs: Lab[]): Promise<string> => {
    const simplifiedLabs = labs.map(lab => ({
        title: lab.title,
        status: lab.status,
        difficulty: lab.difficulty,
        gcpServices: lab.gcpServices,
        estimatedTime: lab.estimatedTime,
    }));

    const prompt = `
    As an expert Google Cloud learning advisor, analyze the following user's lab progress data.
    Provide brief, actionable insights to guide their learning journey.
    The response must be in Markdown format.

    ### Analysis Summary
    Start with a one-sentence encouraging summary of their progress.

    ### Key Patterns
    - Identify the top 2-3 most frequently used GCP services.
    - Briefly comment on their preferred lab difficulty level.

    ### Recommended Next Step
    - Suggest one specific lab from their "Not Started" list to tackle next. Explain why it's a good choice based on their history (e.g., builds on skills, introduces a new, relevant service).

    ### Pro Tip
    - Offer one specific, actionable tip for improvement or a concept to explore further based on the data.

    User's Lab Data:
    ${JSON.stringify(simplifiedLabs, null, 2)}
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error generating insights:", error);
        throw new Error("Failed to generate insights using the Gemini API.");
    }
};
