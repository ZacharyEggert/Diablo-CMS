import { Migration } from '@mikro-orm/migrations';

export class Migration20211221012717 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "listing" drop constraint if exists "listing_reverb_id_check";');
    this.addSql('alter table "listing" alter column "reverb_id" type int4 using ("reverb_id"::int4);');

    this.addSql('create index "listing_id_index" on "listing" ("id");');
  }

}
