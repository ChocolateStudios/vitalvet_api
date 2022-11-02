import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions, SequelizeOptionsFactory } from '@nestjs/sequelize';

@Injectable()
export class DatabaseConfigService implements SequelizeOptionsFactory {
    constructor(private configService: ConfigService) {}

    createSequelizeOptions(): SequelizeModuleOptions {
      return {
        dialect: 'mysql',
        host: this.configService.get('DATABASE_HOST'),
        port: 3306,
        username: this.configService.get('DATABASE_USERNAME'),
        password: this.configService.get('DATABASE_PASSWORD'),
        database: this.configService.get('DATABASE_NAME'),
        autoLoadModels: true,
        synchronize: true,
      };
    }
  }
