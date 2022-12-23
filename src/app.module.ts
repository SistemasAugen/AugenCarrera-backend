import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { AuthModule } from './components/auth/auth.module';
import { UserController } from './components/user/user.controller';
import { UserService } from './components/user/user.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailSenderService } from './utils/email-sender/email-sender.service';
import { Laboratory } from './database/entities/lab.entity';
import { Facturation } from './database/entities/facturation.entity';
import { Branch } from './database/entities/Pdv.entity';
import { AccountController } from './components/account/account.controller';
import { PasswordResets } from './database/entities/password-request.entity';
import { DocumentsService } from './components/documents/documents.service';
import { DocumentsController } from './components/documents/documents.controller';

const dotenv = require('dotenv')
dotenv.config();

const SMTP_SECURE_BOOLEAN_VALUE = process.env.SMTP_SECURE_VALUE === 'true';
const SMTP_BOOLEAN_PREVIEW = process.env.SMTP_PREVIEW == 'true';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '107.180.46.186',
      username: 'system_user',
      password: '%^Ue_vtx&*,G',
      database: 'augen_test',
      autoLoadEntities: true,
      synchronize: false, // como no queremos que las entidades de este proyecto modifiquen a la base de datos y solo consultemos informacion se dejara en false
      migrationsRun: false,
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: SMTP_SECURE_BOOLEAN_VALUE,
        auth: process.env.SMTP_USER_NAME
          ? {
            user: process.env.SMTP_USER_NAME,
            pass: process.env.SMTP_PASSWORD,
          }
          : null,
        tls: {
          rejectUnauthorized: false,
        },
      },
      preview: {
        open: SMTP_BOOLEAN_PREVIEW
      },
      defaults: {
        from: process.env.SMTP_DISPLAY_NAME
      },
      template: {
        dir: './src/utils/email-sender/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
    TypeOrmModule.forFeature([User, Laboratory, Facturation, Branch, PasswordResets]),
    AuthModule
  ],
  providers: [
    UserService,
    EmailSenderService,
    DocumentsService
  ],
  controllers: [
    UserController,
    AccountController,
    DocumentsController
  ],
  exports: [JwtModule]
})
export class AppModule { }
