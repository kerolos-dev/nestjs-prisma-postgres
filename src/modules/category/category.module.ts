import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { RoleMiddleware } from 'src/Custom/middelwiare/role.middleware';
import { AuthenticationMiddleware } from 'src/Custom/middelwiare/authenticationId';
import { PrismaModule } from 'src/prisma/prisma.Module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [CategoryController],
  providers: [
    CategoryService,
    {
      provide: 'ROLES', // Define a token for the dependency
      useValue: ['ADMIN'], // Example values for the dependency
    },
    RoleMiddleware, // Add RoleMiddleware to the providers
  ],
})
export class CategoryModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthenticationMiddleware) // تطبيق الميدل وير
      .forRoutes(CategoryController) // تطبيقه على جميع مسارات الكنترولر
      .apply(RoleMiddleware) // تطبيق ميدل وير آخر إذا لزم الأمر
      .forRoutes(CategoryController);
  }
}
