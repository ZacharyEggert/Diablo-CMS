import { Migration } from '@mikro-orm/migrations';

export class Migration20211210214522 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "listing" ("id" serial primary key, "title" varchar(255) not null, "make" varchar(255) not null, "model" varchar(255) not null, "submodel" varchar(255) null, "year" int4 null, "finish" varchar(255) null, "description" varchar(255) not null, "price" int4 not null, "cost" int4 not null, "image_urls" jsonb not null);');
  }

}
