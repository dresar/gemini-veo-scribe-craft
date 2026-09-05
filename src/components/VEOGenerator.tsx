
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, Sparkles, Copy, Download, Settings, Video, Users, MapPin, Heart, Sun, Palette } from 'lucide-react';
import { toast } from 'sonner';
import { VEOPrompt, GeneratedPrompt } from '@/types/veo';
import { GeminiService } from '@/services/geminiService';

const VEOGenerator = () => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);
  const [formData, setFormData] = useState<VEOPrompt>({
    basicSettings: { aspectRatio: '', subject: '' },
    characterDescription: { age: '', ethnicity: '', gender: '', clothing: '', action: '' },
    locationSetting: { description: '', features: '' },
    expressionAction: { expression: '', emotion: '', action: '' },
    environment: { backgroundActivity: '' },
    lightingCamera: { lighting: '', cameraStyle: '' },
    moodAtmosphere: { mood: '', scenario: '' }
  });
  const [generatedPrompts, setGeneratedPrompts] = useState<GeneratedPrompt[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const aspectRatios = ['16:9', '9:16', '1:1', '21:9', '4:3'];
  const ages = ['Anak-anak (5-12)', 'Remaja (13-19)', 'Dewasa Muda (20-35)', 'Dewasa (36-55)', 'Lansia (55+)'];
  const ethnicities = ['Asia', 'Eropa', 'Afrika', 'Amerika Latin', 'Timur Tengah', 'Campuran'];
  const genders = ['Pria', 'Wanita', 'Non-biner'];
  const expressions = ['Senang', 'Sedih', 'Marah', 'Terkejut', 'Takut', 'Netral', 'Bingung', 'Antusias'];
  const emotions = ['Bahagia', 'Melankolis', 'Energik', 'Tenang', 'Dramatis', 'Romantis', 'Misterius'];
  const cameraStyles = ['Close-up', 'Medium shot', 'Wide shot', 'Low angle', 'High angle', 'Dutch angle', 'Tracking shot'];
  const moods = ['Cinematic', 'Dokumenter', 'Komersial', 'Artistik', 'Vintage', 'Modern', 'Futuristik'];

  const updateFormData = (section: keyof VEOPrompt, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const generatePromptFromForm = (): string => {
    const parts = [];
    
    if (formData.basicSettings.subject) {
      parts.push(`Subjek: ${formData.basicSettings.subject}`);
    }
    
    if (formData.characterDescription.age || formData.characterDescription.gender || formData.characterDescription.ethnicity) {
      const charParts = [];
      if (formData.characterDescription.age) charParts.push(formData.characterDescription.age);
      if (formData.characterDescription.gender) charParts.push(formData.characterDescription.gender);
      if (formData.characterDescription.ethnicity) charParts.push(`etnis ${formData.characterDescription.ethnicity}`);
      parts.push(`Karakter: ${charParts.join(', ')}`);
    }
    
    if (formData.characterDescription.clothing) {
      parts.push(`Pakaian: ${formData.characterDescription.clothing}`);
    }
    
    if (formData.characterDescription.action) {
      parts.push(`Aksi: ${formData.characterDescription.action}`);
    }
    
    if (formData.locationSetting.description) {
      parts.push(`Lokasi: ${formData.locationSetting.description}`);
    }
    
    if (formData.locationSetting.features) {
      parts.push(`Detail lokasi: ${formData.locationSetting.features}`);
    }
    
    if (formData.expressionAction.expression) {
      parts.push(`Ekspresi: ${formData.expressionAction.expression}`);
    }
    
    if (formData.expressionAction.emotion) {
      parts.push(`Emosi: ${formData.expressionAction.emotion}`);
    }
    
    if (formData.expressionAction.action) {
      parts.push(`Tindakan: ${formData.expressionAction.action}`);
    }
    
    if (formData.environment.backgroundActivity) {
      parts.push(`Aktivitas latar: ${formData.environment.backgroundActivity}`);
    }
    
    if (formData.lightingCamera.lighting) {
      parts.push(`Pencahayaan: ${formData.lightingCamera.lighting}`);
    }
    
    if (formData.lightingCamera.cameraStyle) {
      parts.push(`Gaya kamera: ${formData.lightingCamera.cameraStyle}`);
    }
    
    if (formData.moodAtmosphere.mood) {
      parts.push(`Suasana: ${formData.moodAtmosphere.mood}`);
    }
    
    if (formData.moodAtmosphere.scenario) {
      parts.push(`Skenario: ${formData.moodAtmosphere.scenario}`);
    }
    
    if (formData.basicSettings.aspectRatio) {
      parts.push(`Rasio aspek: ${formData.basicSettings.aspectRatio}`);
    }
    
    return parts.join('. ');
  };

  const generateCreativePrompt = async () => {
    if (!apiKey) {
      toast.error('Masukkan API Key Gemini terlebih dahulu!');
      return;
    }

    setIsGenerating(true);
    try {
      const geminiService = new GeminiService(apiKey);
      const creativePrompt = await geminiService.generateCreativePrompt(formData);
      
      const newPrompt: GeneratedPrompt = {
        originalPrompt: generatePromptFromForm(),
        optimizedPrompt: creativePrompt,
        timestamp: new Date().toLocaleString('id-ID')
      };
      
      setGeneratedPrompts(prev => [newPrompt, ...prev]);
      toast.success('Prompt kreatif berhasil dibuat!');
    } catch (error) {
      console.error('Error generating creative prompt:', error);
      toast.error('Gagal membuat prompt kreatif. Periksa API Key Anda.');
    } finally {
      setIsGenerating(false);
    }
  };

  const optimizePrompt = async (prompt: string) => {
    if (!apiKey) {
      toast.error('Masukkan API Key Gemini terlebih dahulu!');
      return;
    }

    setIsOptimizing(true);
    try {
      const geminiService = new GeminiService(apiKey);
      const optimizedPrompt = await geminiService.optimizePrompt(prompt);
      
      const newPrompt: GeneratedPrompt = {
        originalPrompt: prompt,
        optimizedPrompt: optimizedPrompt,
        timestamp: new Date().toLocaleString('id-ID')
      };
      
      setGeneratedPrompts(prev => [newPrompt, ...prev]);
      toast.success('Prompt berhasil dioptimasi!');
    } catch (error) {
      console.error('Error optimizing prompt:', error);
      toast.error('Gagal mengoptimasi prompt. Periksa API Key Anda.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Prompt disalin ke clipboard!');
  };

  const downloadPrompts = () => {
    const content = generatedPrompts.map(prompt => 
      `=== Prompt ${prompt.timestamp} ===\n\nPrompt Asli:\n${prompt.originalPrompt}\n\nPrompt Dioptimasi:\n${prompt.optimizedPrompt}\n\n`
    ).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `veo3-prompts-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Prompt berhasil diunduh!');
  };

  if (showApiKeyInput) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-16 h-16 flex items-center justify-center">
              <Camera className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold">VEO 3 Generator</CardTitle>
            <p className="text-gray-600">Pembuat Prompt Video AI</p>
            <Badge className="mx-auto bg-green-100 text-green-700">Didukung Google VEO 3</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key Gemini</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Masukkan API Key Gemini Anda"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            <Button 
              onClick={() => {
                if (!apiKey) {
                  toast.error('Masukkan API Key Gemini terlebih dahulu!');
                  return;
                }
                setShowApiKeyInput(false);
                toast.success('API Key berhasil disimpan!');
              }}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Mulai Membuat Prompt
            </Button>
            <Alert>
              <AlertDescription>
                Dapatkan API Key Gemini gratis di Google AI Studio. API Key disimpan lokal dan tidak dikirim ke server.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Camera className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">VEO 3 Generator</h1>
                <p className="text-sm text-gray-600">Pembuat Prompt Video AI</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-700">Didukung Google VEO 3</Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowApiKeyInput(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Pengaturan
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 text-green-600" />
                  <span>1. Pengaturan Dasar</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Rasio Aspek</Label>
                    <Select 
                      value={formData.basicSettings.aspectRatio} 
                      onValueChange={(value) => updateFormData('basicSettings', 'aspectRatio', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih rasio aspek" />
                      </SelectTrigger>
                      <SelectContent>
                        {aspectRatios.map(ratio => (
                          <SelectItem key={ratio} value={ratio}>{ratio}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Subjek/Karakter <span className="text-red-500">*</span></Label>
                    <Input
                      placeholder="contoh: wanita muda Indonesia yang cantik"
                      value={formData.basicSettings.subject}
                      onChange={(e) => updateFormData('basicSettings', 'subject', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Character Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>2. Deskripsi Karakter</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Usia/Penampilan</Label>
                    <Select 
                      value={formData.characterDescription.age} 
                      onValueChange={(value) => updateFormData('characterDescription', 'age', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih usia" />
                      </SelectTrigger>
                      <SelectContent>
                        {ages.map(age => (
                          <SelectItem key={age} value={age}>{age}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Etnis/Kebangsaan</Label>
                    <Select 
                      value={formData.characterDescription.ethnicity} 
                      onValueChange={(value) => updateFormData('characterDescription', 'ethnicity', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih etnis" />
                      </SelectTrigger>
                      <SelectContent>
                        {ethnicities.map(ethnicity => (
                          <SelectItem key={ethnicity} value={ethnicity}>{ethnicity}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Jenis Kelamin</Label>
                    <Select 
                      value={formData.characterDescription.gender} 
                      onValueChange={(value) => updateFormData('characterDescription', 'gender', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis kelamin" />
                      </SelectTrigger>
                      <SelectContent>
                        {genders.map(gender => (
                          <SelectItem key={gender} value={gender}>{gender}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Pakaian/Gaya</Label>
                    <Input
                      placeholder="contoh: dress putih elegant"
                      value={formData.characterDescription.clothing}
                      onChange={(e) => updateFormData('characterDescription', 'clothing', e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Aksi/Gerakan</Label>
                  <Textarea
                    placeholder="contoh: memegang ponsel, melambai tangan"
                    value={formData.characterDescription.action}
                    onChange={(e) => updateFormData('characterDescription', 'action', e.target.value)}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Location & Setting */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-purple-600" />
                  <span>3. Lokasi & Setting</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Deskripsi Lokasi</Label>
                  <Textarea
                    placeholder="contoh: jalanan Jakarta yang ramai"
                    value={formData.locationSetting.description}
                    onChange={(e) => updateFormData('locationSetting', 'description', e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fitur Menonjol</Label>
                  <Textarea
                    placeholder="contoh: bus TransJakarta, gedung pencakar langit"
                    value={formData.locationSetting.features}
                    onChange={(e) => updateFormData('locationSetting', 'features', e.target.value)}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Expression & Action */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  <span>4. Ekspresi & Aksi</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Ekspresi/Gesture</Label>
                    <Select 
                      value={formData.expressionAction.expression} 
                      onValueChange={(value) => updateFormData('expressionAction', 'expression', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih ekspresi" />
                      </SelectTrigger>
                      <SelectContent>
                        {expressions.map(expression => (
                          <SelectItem key={expression} value={expression}>{expression}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Emosi</Label>
                    <Select 
                      value={formData.expressionAction.emotion} 
                      onValueChange={(value) => updateFormData('expressionAction', 'emotion', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih emosi" />
                      </SelectTrigger>
                      <SelectContent>
                        {emotions.map(emotion => (
                          <SelectItem key={emotion} value={emotion}>{emotion}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Tindakan</Label>
                  <Textarea
                    placeholder="contoh: berbicara, menari"
                    value={formData.expressionAction.action}
                    onChange={(e) => updateFormData('expressionAction', 'action', e.target.value)}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Environment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="h-5 w-5 text-orange-600" />
                  <span>5. Lingkungan & Detail Gerakan</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Aktivitas Latar Belakang</Label>
                  <Textarea
                    placeholder="contoh: motor yang lewat dengan efek blur"
                    value={formData.environment.backgroundActivity}
                    onChange={(e) => updateFormData('environment', 'backgroundActivity', e.target.value)}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Lighting & Camera */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sun className="h-5 w-5 text-yellow-600" />
                  <span>6. Pencahayaan & Gaya Kamera</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Deskripsi Pencahayaan</Label>
                  <Textarea
                    placeholder="contoh: cahaya natural sore hari, golden hour"
                    value={formData.lightingCamera.lighting}
                    onChange={(e) => updateFormData('lightingCamera', 'lighting', e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gaya Kamera</Label>
                  <Select 
                    value={formData.lightingCamera.cameraStyle} 
                    onValueChange={(value) => updateFormData('lightingCamera', 'cameraStyle', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih gaya kamera" />
                    </SelectTrigger>
                    <SelectContent>
                      {cameraStyles.map(style => (
                        <SelectItem key={style} value={style}>{style}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Mood & Atmosphere */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Video className="h-5 w-5 text-indigo-600" />
                  <span>7. Suasana / Mood</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Suasana</Label>
                  <Select 
                    value={formData.moodAtmosphere.mood} 
                    onValueChange={(value) => updateFormData('moodAtmosphere', 'mood', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih suasana" />
                    </SelectTrigger>
                    <SelectContent>
                      {moods.map(mood => (
                        <SelectItem key={mood} value={mood}>{mood}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Skenario/Tujuan</Label>
                  <Textarea
                    placeholder="contoh: sedang vlog di jalanan"
                    value={formData.moodAtmosphere.scenario}
                    onChange={(e) => updateFormData('moodAtmosphere', 'scenario', e.target.value)}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={generateCreativePrompt}
                disabled={isGenerating || !formData.basicSettings.subject}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isGenerating ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Membuat Prompt...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-4 w-4" />
                    <span>Buat Prompt VEO 3</span>
                  </div>
                )}
              </Button>
              
              <Button 
                onClick={() => optimizePrompt(generatePromptFromForm())}
                disabled={isOptimizing || !formData.basicSettings.subject}
                variant="outline"
                className="flex-1"
              >
                {isOptimizing ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                    <span>Mengoptimasi...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-4 w-4" />
                    <span>Tingkatkan dengan Gemini AI</span>
                  </div>
                )}
              </Button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Prompt VEO 3 yang Dibuat</CardTitle>
                  {generatedPrompts.length > 0 && (
                    <Button onClick={downloadPrompts} size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Unduh
                    </Button>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  Salin prompt yang sesuai dan gunakan di Google VEO 3, atau edit jika diperlukan.
                </p>
              </CardHeader>
              <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                {generatedPrompts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Belum ada prompt yang dibuat.</p>
                    <p className="text-sm">Isi form dan klik "Buat Prompt VEO 3"</p>
                  </div>
                ) : (
                  generatedPrompts.map((prompt, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {prompt.timestamp}
                        </Badge>
                        <Button
                          onClick={() => copyToClipboard(prompt.optimizedPrompt)}
                          size="sm"
                          variant="ghost"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      {prompt.originalPrompt && (
                        <div>
                          <Label className="text-xs font-semibold text-gray-600">Prompt Asli:</Label>
                          <p className="text-sm bg-gray-50 p-2 rounded text-gray-700 mt-1">
                            {prompt.originalPrompt}
                          </p>
                        </div>
                      )}
                      
                      <div>
                        <Label className="text-xs font-semibold text-green-600">Prompt Dioptimasi:</Label>
                        <p className="text-sm bg-green-50 p-2 rounded text-gray-800 mt-1 font-medium">
                          {prompt.optimizedPrompt}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">💡 Tips Penggunaan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="space-y-2">
                  <p><strong>Kualitas Sinematik:</strong> Gunakan detail lighting dan camera movement.</p>
                  <p><strong>Format 16:9:</strong> Ideal untuk video landscape dan YouTube.</p>
                  <p><strong>Bertenaga AI:</strong> Gemini AI mengoptimalkan prompt Anda otomatis.</p>
                  <p><strong>Mobile Friendly:</strong> Format 9:16 cocok untuk TikTok dan Instagram.</p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Badge variant="outline" className="justify-center">Kualitas Sinematik</Badge>
                  <Badge variant="outline" className="justify-center">Format 16:9</Badge>
                  <Badge variant="outline" className="justify-center">Bertenaga AI</Badge>
                  <Badge variant="outline" className="justify-center">Mobile Friendly</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VEOGenerator;
