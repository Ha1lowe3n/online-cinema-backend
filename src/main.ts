import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('api');
	app.useGlobalPipes(new ValidationPipe());

	const options = new DocumentBuilder()
		.setTitle('Online cinema API')
		.setDescription('some description')
		.setVersion('1.0.0')
		.addBearerAuth({ type: 'http', scheme: 'Bearer', bearerFormat: 'token' }, 'access-token')
		.build();
	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup('api', app, document, {
		swaggerOptions: { defaultModelsExpandDepth: -1 },
	});

	await app.listen(8000);
}
bootstrap();
