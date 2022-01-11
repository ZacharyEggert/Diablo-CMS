import { Migration } from '@mikro-orm/migrations';

export class Migration20220110165005 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "listing" add column "is_sold" bool not null default false, add column "is_featured" bool not null default false, add column "created_at" date not null, add column "updated_at" date not null;');
  }

}
