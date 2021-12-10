import { Migration } from '@mikro-orm/migrations';

export class Migration20211210183847 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" add column "email" varchar(255) not null;');
  }

}
