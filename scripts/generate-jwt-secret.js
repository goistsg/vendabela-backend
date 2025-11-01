#!/usr/bin/env node

/**
 * Script para gerar chaves JWT seguras para desenvolvimento e produção
 * 
 * Uso:
 *   node scripts/generate-jwt-secret.js
 *   node scripts/generate-jwt-secret.js --prod
 *   node scripts/generate-jwt-secret.js --env dev
 */

const crypto = require('crypto');

function generateJwtSecret(length = 64) {
  // Gera uma string aleatória segura usando crypto
  return crypto.randomBytes(length).toString('hex');
}

function generateBase64Secret(length = 64) {
  // Gera uma chave base64 (alternativa)
  return crypto.randomBytes(length).toString('base64');
}

function main() {
  const args = process.argv.slice(2);
  const isProd = args.includes('--prod') || args.includes('--production');
  const envArg = args.find(arg => arg.startsWith('--env='));
  const env = envArg ? envArg.split('=')[1] : (isProd ? 'production' : 'development');
  
  console.log('\n🔐 Gerador de Chave JWT Segura\n');
  console.log('=' .repeat(60));
  
  // Gerar chave hexadecimal (recomendado)
  const hexSecret = generateJwtSecret(64);
  console.log(`\n📋 Chave JWT (Hexadecimal - ${env}):`);
  console.log(`JWT_SECRET=${hexSecret}`);
  
  // Gerar chave base64 (alternativa)
  const base64Secret = generateBase64Secret(64);
  console.log(`\n📋 Chave JWT (Base64 - ${env}):`);
  console.log(`JWT_SECRET=${base64Secret}`);
  
  console.log('\n' + '='.repeat(60));
  console.log('\n💡 Instruções:');
  console.log('1. Copie a chave gerada acima');
  console.log('2. Adicione ao seu arquivo .env:');
  console.log(`   JWT_SECRET=${hexSecret}`);
  console.log('\n3. Para produção, use uma chave diferente e armazene com segurança');
  console.log('4. NUNCA compartilhe ou commite a chave em repositórios públicos\n');
  
  if (isProd) {
    console.log('⚠️  ATENÇÃO: Esta é uma chave para PRODUÇÃO');
    console.log('   - Armazene em variáveis de ambiente seguras');
    console.log('   - Use um gerenciador de segredos (AWS Secrets Manager, etc.)');
    console.log('   - Não commite em repositórios\n');
  }
}

main();

