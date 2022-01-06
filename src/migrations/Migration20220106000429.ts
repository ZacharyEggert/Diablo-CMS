import { Migration } from '@mikro-orm/migrations';

export class Migration20220106000429 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "listing" add column "sale_price" int4 null;');
  }

}
