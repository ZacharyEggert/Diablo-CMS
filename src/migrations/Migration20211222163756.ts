import { Migration } from '@mikro-orm/migrations';

export class Migration20211222163756 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "listing" add column "reverb_self_link" varchar(255) null, add column "reverb_images_imported" bool null default false;');
  }

}
