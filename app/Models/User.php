<?php

namespace App\Models;

use http\Env\Request;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    const ACCEPT_STATUS = 1;

    const PENDING_STATUS = 0;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function requests()
    {
        return $this->belongsToMany(User::class, 'requests', 'sender_id', 'receiver_id')
            ->withPivot('status');
    }

    public function invitations()
    {
        return $this->belongsToMany(User::class, 'requests', 'receiver_id', 'sender_id')
            ->withPivot('status')->wherePivot('status', self::PENDING_STATUS);
    }

    public function pendingRequests()
    {
        return $this->requests()->wherePivot('status',self::PENDING_STATUS);
    }

    public function friends()
    {
        return $this->belongsToMany(User::class, 'requests', 'receiver_id', 'sender_id')
            ->withPivot('status');
    }

    public function acceptedRequests()
    {
        return $this->friends()->wherePivot('status',self::ACCEPT_STATUS);
    }
}
