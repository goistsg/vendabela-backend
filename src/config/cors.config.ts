/**
 * Configuração de CORS para a aplicação
 * Permite controle de acesso cross-origin entre frontend e backend
 */

export interface CorsConfig {
  origin: string[] | boolean;
  methods: string[];
  allowedHeaders: string[];
  exposedHeaders: string[];
  credentials: boolean;
  preflightContinue: boolean;
  optionsSuccessStatus: number;
}

/**
 * Obtém as origins permitidas a partir de variáveis de ambiente ou valores padrão
 */
function getAllowedOrigins(): string[] {
  if (process.env.CORS_ORIGINS) {
    return process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim());
  }

  return [
    'https://cakecup-web-app.onrender.com',
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:8080',
  ];
}

/**
 * Configuração de CORS para desenvolvimento
 * Permite todas as origins para facilitar o desenvolvimento local
 */
export function getDevelopmentCorsConfig(): CorsConfig {
  return {
    origin: true, // Permite todas as origins em desenvolvimento
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'company-id',
      'X-Requested-With',
      'Accept',
    ],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };
}

/**
 * Configuração de CORS para produção
 * Restringe acesso apenas às origins permitidas
 */
export function getProductionCorsConfig(): CorsConfig {
  return {
    origin: getAllowedOrigins(),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'company-id',
      'X-Requested-With',
      'Accept',
    ],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };
}

/**
 * Obtém a configuração de CORS baseada no ambiente
 */
export function getCorsConfig(): CorsConfig {
  const isDevelopment = process.env.NODE_ENV === 'development';
  return isDevelopment ? getDevelopmentCorsConfig() : getProductionCorsConfig();
}

