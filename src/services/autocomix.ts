/**
 * AutoComix Backend Service
 * Comunica com o servidor Python do AutoComix para detecção de painéis
 */

const BACKEND_URL = 'http://localhost:5000';

export interface Panel {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
}

export interface DetectionResult {
  panels: Panel[];
  processing_time: number;
  image_size?: { width: number; height: number };
}

export interface RotationResult {
  should_rotate: boolean;
  rotation_angle: number;
  improvement_factor: number;
}

export interface HealthStatus {
  status: string;
  autocomix_available: boolean;
  version: string;
}

class AutoComixService {
  private baseUrl: string;
  private available: boolean = false;

  constructor(baseUrl: string = BACKEND_URL) {
    this.baseUrl = baseUrl;
    this.checkHealth();
  }

  /**
   * Verifica se o backend está disponível
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const data: HealthStatus = await response.json();
        this.available = data.status === 'ok';
        return this.available;
      }
      return false;
    } catch (error) {
      this.available = false;
      return false;
    }
  }

  /**
   * Retorna se o backend está disponível
   */
  isAvailable(): boolean {
    return this.available;
  }

  /**
   * Detecta painéis em uma imagem
   */
  async detectPanels(
    imageBase64: string,
    useGpu: boolean = true,
    confidenceThreshold: number = 0.5
  ): Promise<DetectionResult> {
    if (!this.available) {
      throw new Error('AutoComix backend is not available');
    }

    try {
      const response = await fetch(`${this.baseUrl}/detect-panels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_base64: imageBase64,
          use_gpu: useGpu,
          confidence_threshold: confidenceThreshold
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Detection failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Error detecting panels:', error);
      throw error;
    }
  }

  /**
   * Determina se um painel deve ser rotacionado
   */
  async shouldRotatePanel(
    panel: Panel,
    screenAspectRatio: number = 1.78,
    threshold: number = 1.3
  ): Promise<RotationResult> {
    if (!this.available) {
      // Fallback: cálculo simples
      const panelAspect = panel.width / panel.height;
      const currentFill = Math.min(panelAspect / screenAspectRatio, screenAspectRatio / panelAspect);
      const rotatedFill = Math.min((1/panelAspect) / screenAspectRatio, screenAspectRatio / (1/panelAspect));
      const improvement = rotatedFill / currentFill;
      
      return {
        should_rotate: improvement >= threshold,
        rotation_angle: improvement >= threshold ? 90 : 0,
        improvement_factor: improvement
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/auto-rotate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          panel,
          screen_aspect_ratio: screenAspectRatio,
          threshold
        })
      });

      if (!response.ok) {
        throw new Error('Rotation check failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking rotation:', error);
      throw error;
    }
  }

  /**
   * Processa um livro completo
   */
  async processBook(
    filePath: string,
    useGpu: boolean = true
  ): Promise<any> {
    if (!this.available) {
      throw new Error('AutoComix backend is not available');
    }

    try {
      const response = await fetch(`${this.baseUrl}/process-book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file_path: filePath,
          use_gpu: useGpu
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Processing failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Error processing book:', error);
      throw error;
    }
  }
}

// Instância singleton
export const autoComixService = new AutoComixService();
