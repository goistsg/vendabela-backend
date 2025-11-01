import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { AppModule } from '../src/app.module';
import { CommerceModule } from '../src/commerce.module';

interface GenerateOptions {
  module: 'app' | 'commerce' | 'both';
  format: 'json' | 'yaml' | 'both';
  output?: string;
}

async function generateSwaggerDoc(options: GenerateOptions = { module: 'both', format: 'both' }) {
  const { module = 'both', format = 'both', output } = options;

  try {
    if (module === 'app' || module === 'both') {
      await generateForModule('app', AppModule, format, output);
    }

    if (module === 'commerce' || module === 'both') {
      await generateForModule('commerce', CommerceModule, format, output);
    }

    console.log('\n✅ Documentação Swagger gerada com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao gerar documentação:', error);
    process.exit(1);
  }
}

async function generateForModule(
  moduleName: string,
  ModuleClass: any,
  format: 'json' | 'yaml' | 'both',
  outputDir?: string
) {
  console.log(`\n📝 Gerando documentação para módulo: ${moduleName}...`);

  // Criar aplicação sem iniciar o servidor
  const app = await NestFactory.create(ModuleClass, {
    logger: false, // Desabilitar logs durante a geração
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('app');

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle(moduleName === 'app' ? 'Vendabela Backend API' : 'Vendabela Commerce API')
    .setDescription(
      moduleName === 'app'
        ? 'API completa para gestão de vendas, produtos, clientes e pedidos'
        : 'API para o serviço de comércio da plataforma Vendabela'
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Diretório de saída
  const docsDir = outputDir || path.join(process.cwd(), 'docs');
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  // Salvar JSON
  if (format === 'json' || format === 'both') {
    const jsonPath = path.join(docsDir, `swagger-${moduleName}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(document, null, 2));
    console.log(`  ✓ JSON salvo em: ${jsonPath}`);
  }

  // Salvar YAML (requer js-yaml)
  if (format === 'yaml' || format === 'both') {
    try {
      // Tentar importar js-yaml se disponível
      const yaml = require('js-yaml');
      const yamlPath = path.join(docsDir, `swagger-${moduleName}.yaml`);
      const yamlContent = yaml.dump(document, { indent: 2 });
      fs.writeFileSync(yamlPath, yamlContent);
      console.log(`  ✓ YAML salvo em: ${yamlPath}`);
    } catch (error) {
      if (format === 'yaml') {
        console.error(`  ❌ Erro: js-yaml não está instalado. Execute: npm install --save-dev js-yaml @types/js-yaml`);
        throw error;
      } else {
        console.warn(`  ⚠ YAML não gerado (js-yaml não instalado). Para habilitar: npm install --save-dev js-yaml @types/js-yaml`);
      }
    }
  }

  await app.close();
}

// Ler argumentos da linha de comando
const args = process.argv.slice(2);
const options: GenerateOptions = {
  module: 'both',
  format: 'both',
};

args.forEach((arg, index) => {
  if (arg === '--module' || arg === '-m') {
    const moduleValue = args[index + 1];
    if (moduleValue === 'app' || moduleValue === 'commerce') {
      options.module = moduleValue as 'app' | 'commerce';
    }
  } else if (arg === '--format' || arg === '-f') {
    const formatValue = args[index + 1];
    if (formatValue === 'json' || formatValue === 'yaml') {
      options.format = formatValue as 'json' | 'yaml';
    }
  } else if (arg === '--output' || arg === '-o') {
    options.output = args[index + 1];
  } else if (arg === '--help' || arg === '-h') {
    console.log(`
📚 Gerador de Documentação Swagger

Uso:
  tsx scripts/generate-swagger-doc.ts [opções]

Opções:
  --module, -m <app|commerce|both>   Módulo a documentar (padrão: both)
  --format, -f <json|yaml|both>     Formato de saída (padrão: both)
  --output, -o <diretório>           Diretório de saída (padrão: ./docs)
  --help, -h                         Mostrar esta ajuda

Exemplos:
  tsx scripts/generate-swagger-doc.ts
  tsx scripts/generate-swagger-doc.ts --module app --format json
  tsx scripts/generate-swagger-doc.ts --module commerce --format yaml
  tsx scripts/generate-swagger-doc.ts --output ./api-docs
    `);
    process.exit(0);
  }
});

generateSwaggerDoc(options);

