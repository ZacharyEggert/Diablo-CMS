import { Migration } from '@mikro-orm/migrations';

export class Migration20211210181716 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "username" varchar(255) not null, "password" varchar(255) not null, "access_revoked" bool not null default false);');
    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');
  }

}
