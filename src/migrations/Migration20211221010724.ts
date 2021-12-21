import { Migration } from '@mikro-orm/migrations';

export class Migration20211221010724 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "listing" ("id" serial primary key, "reverb_id" varchar(255) null, "reverb_sku" varchar(255) null, "title" varchar(255) not null, "make" varchar(255) not null, "model" varchar(255) not null, "submodel" varchar(255) null, "year" varchar(255) null, "finish" varchar(255) null, "description" text not null, "condition" varchar(255) null, "categories" text[] null, "price" int4 not null, "cost" int4 not null, "photos" jsonb not null, "slug" varchar(255) not null);');

    this.addSql('create table "user" ("id" serial primary key, "username" varchar(255) not null, "password" varchar(255) not null, "access_revoked" bool not null default false, "email" varchar(255) not null);');
    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');
  }

}
