<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RequestsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $requestReceived = 15;
        $requestSend=30;
        $requestAccepted=70;
        $authUser=1;



        //for request received
        for ($i = 2; $i <= $requestReceived; $i++) {
            DB::table('requests')->insert([
                'sender_id' => $i,
                'receiver_id' => $authUser,
            ]);
        }

        //for request send
        for ($i = 16; $i <= $requestSend; $i++) {
            DB::table('requests')->insert([
                'sender_id' => $authUser,
                'receiver_id' => $i,
            ]);
        }

        //for request acccepted
        for ($i = 30; $i <= $requestAccepted; $i++) {
            DB::table('requests')->insert([
                'sender_id' => $i,
                'receiver_id' => $authUser,
                'status'=>1
            ]);
        }
    }
}
