
export interface BasicSettings {
  aspectRatio: string;
  subject: string;
}

export interface CharacterDescription {
  age: string;
  ethnicity: string;
  gender: string;
  clothing: string;
  action: string;
}

export interface LocationSetting {
  description: string;
  features: string;
}

export interface ExpressionAction {
  expression: string;
  emotion: string;
  action: string;
}

export interface Environment {
  backgroundActivity: string;
}

export interface LightingCamera {
  lighting: string;
  cameraStyle: string;
}

export interface MoodAtmosphere {
  mood: string;
  scenario: string;
}

export interface VEOPrompt {
  basicSettings: BasicSettings;
  characterDescription: CharacterDescription;
  locationSetting: LocationSetting;
  expressionAction: ExpressionAction;
  environment: Environment;
  lightingCamera: LightingCamera;
  moodAtmosphere: MoodAtmosphere;
}

export interface GeneratedPrompt {
  originalPrompt: string;
  optimizedPrompt: string;
  timestamp: string;
}
