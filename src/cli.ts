// src/cli.ts
import { CommandFactory } from 'nest-commander';
import { CLIAppModule } from './cli.app.module';

async function bootstrap() {
  await CommandFactory.run(CLIAppModule, ['log', 'warn', 'error']);
}
bootstrap();
