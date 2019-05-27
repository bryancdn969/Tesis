<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class AddTableAppFriend extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('app_friend', function (Blueprint $table) {
            $table->increments('id_friend');

			$table->integer('id_user')->nullable();
            $table->string('name_user')->nullable();
			$table->string('telefono_user')->nullable();
			$table->string('telefono_friend')->nullable();
			$table->string('nombre_friend')->nullable();
			$table->string('email_friend')->nullable();
			$table->integer('count_friend')->nullable();
            $table->string('status_friend')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('app_friend');
    }
}
