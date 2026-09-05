
export class GeminiService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async optimizePrompt(prompt: string): Promise<string> {
    const requestBody = {
      contents: [{
        parts: [{
          text: `Sebagai expert prompt engineer untuk Google VEO 3, optimisasi prompt video berikut agar menghasilkan video berkualitas tinggi yang sinematik dan profesional. 

Prompt asli: "${prompt}"

Buat prompt yang dioptimasi dengan:
1. Detail visual yang spesifik dan vivid
2. Instruksi kamera yang profesional
3. Pencahayaan yang dramatis
4. Gerakan yang smooth dan natural
5. Komposisi yang menarik
6. Durasi dan timing yang tepat

Berikan hanya prompt yang dioptimasi tanpa penjelasan tambahan.`
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw new Error('Failed to optimize prompt with Gemini AI');
    }
  }

  async generateCreativePrompt(formData: any): Promise<string> {
    const requestBody = {
      contents: [{
        parts: [{
          text: `Buatkan prompt video kreatif untuk Google VEO 3 berdasarkan data berikut:

Subjek: ${formData.basicSettings?.subject || 'Tidak disebutkan'}
Rasio Aspek: ${formData.basicSettings?.aspectRatio || '16:9'}
Usia: ${formData.characterDescription?.age || 'Tidak disebutkan'}
Etnis: ${formData.characterDescription?.ethnicity || 'Tidak disebutkan'}
Jenis Kelamin: ${formData.characterDescription?.gender || 'Tidak disebutkan'}
Pakaian: ${formData.characterDescription?.clothing || 'Tidak disebutkan'}
Aksi Karakter: ${formData.characterDescription?.action || 'Tidak disebutkan'}
Lokasi: ${formData.locationSetting?.description || 'Tidak disebutkan'}
Fitur Lokasi: ${formData.locationSetting?.features || 'Tidak disebutkan'}
Ekspresi: ${formData.expressionAction?.expression || 'Tidak disebutkan'}
Emosi: ${formData.expressionAction?.emotion || 'Tidak disebutkan'}
Tindakan: ${formData.expressionAction?.action || 'Tidak disebutkan'}
Aktivitas Latar: ${formData.environment?.backgroundActivity || 'Tidak disebutkan'}
Pencahayaan: ${formData.lightingCamera?.lighting || 'Tidak disebutkan'}
Gaya Kamera: ${formData.lightingCamera?.cameraStyle || 'Tidak disebutkan'}
Suasana: ${formData.moodAtmosphere?.mood || 'Tidak disebutkan'}
Skenario: ${formData.moodAtmosphere?.scenario || 'Tidak disebutkan'}

Buatkan prompt video yang detail, sinematik, dan menarik dalam bahasa Indonesia yang akan menghasilkan video berkualitas tinggi dengan Google VEO 3. Fokus pada detail visual, gerakan kamera, dan atmosfer yang kuat.`
        }]
      }],
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    };

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Invalid response format from Gemini API');
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw new Error('Failed to generate creative prompt with Gemini AI');
    }
  }
}
