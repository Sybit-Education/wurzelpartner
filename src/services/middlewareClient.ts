import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'

/**
 * Konfiguration für den Middleware-Client
 */
export interface MiddlewareClientConfig {
  baseURL: string
  timeout?: number
}

/**
 * Basis-HTTP-Client für die öffentliche NocoDB-Middleware.
 * Sendet bewusst keinen NocoDB-API-Key.
 */
export class MiddlewareClient {
  private client: AxiosInstance

  constructor(config?: MiddlewareClientConfig) {
    this.client = axios.create({
      baseURL:
        config?.baseURL || import.meta.env.VITE_MIDDLEWARE_API_URL || 'http://localhost:3000',
      timeout: config?.timeout ?? 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  /**
   * GET-Anfrage an die Middleware
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.get<T>(url, config)
      return response.data
    } catch (error) {
      this.handleError(error)
      throw error
    }
  }

  /**
   * Fehlerbehandlung für Middleware-Anfragen
   */
  private handleError(error: unknown): void {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Middleware-Fehler:', error.response.status, error.response.data)
    } else if (axios.isAxiosError(error) && error.request) {
      console.error('Keine Antwort von der Middleware:', error.request)
    } else {
      console.error(
        'Anfragefehler an die Middleware:',
        error instanceof Error ? error.message : error,
      )
    }
  }
}

export default MiddlewareClient
