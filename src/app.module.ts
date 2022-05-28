import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { App2Service } from './app2/app2.service';

@Module({
  imports: [AuthModule, UsersModule,TypeOrmModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, App2Service],
})
export class AppModule {
}
