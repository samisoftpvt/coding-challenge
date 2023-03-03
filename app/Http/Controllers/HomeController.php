<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    CONST SUGGESTION_PAGINATION_LIMIT = 10;
    CONST REQUESTS_PAGINATION_LIMIT = 10;
    CONST CONNECTIONS_PAGINATION_LIMIT = 10;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        return view('home');
    }

    public function suggestions(Request $request)
    {
        $user = Auth::user();
        $user->load('requests');
        $requesterIds = [$user->id];
        if (!empty($user->requests)) {
            foreach ($user->requests as $requestedUser) {
                $requesterIds[] = $requestedUser->id;
            }
        }
        $suggestions = User::whereNotIn('id', $requesterIds)->paginate(self::SUGGESTION_PAGINATION_LIMIT);

        return response()->json($suggestions);
    }

    public function connect(Request $request)
    {
        $receiverId = $request->user_id;
        /** @var User $user */
        $user = Auth::user();
        $user->load('requests');
        $user->requests()->attach([$receiverId]);

        return response()->json(['status' => 'success']);
    }

    public function requests(Request $request)
    {
        $mode = $request->get('mode', 'sent');
        $user = Auth::user();
        if ($mode === 'sent') {
            $user->load('pendingRequests');
            $requests = $user->pendingRequests()->paginate(self::REQUESTS_PAGINATION_LIMIT);

        } else {
            $user->load('invitations');
            $requests = $user->invitations()->paginate(self::REQUESTS_PAGINATION_LIMIT);
        }

        return response()->json($requests);
    }

    public function accept(Request $request)
    {
        $user = Auth::user();
        $user->load('invitations');
        $user->invitations()->where('sender_id', $request->user_id)->update([
            'status' => User::ACCEPT_STATUS
        ]);

        return response()->json(['status' => 'success']);
    }

    public function withdrawal(Request $request)
    {
        $user = Auth::user();
        $user->load('requests');
        $user->requests()->detach([$request->user_id]);

        return response()->json(['status' => 'success']);
    }

    public function connections(Request $request)
    {
        $user = Auth::user();
        $user->load('acceptedRequests');
        $acceptedRequests = $user->acceptedRequests()->paginate(10);

        return response()->json($acceptedRequests);
    }

    public function commonConnections(Request $request) {
        $user = Auth::user();
        $userFriends = $user->acceptedRequests->pluck('id');
        $friendId = $request->friend_id;
        $friend = User::with(['acceptedRequests' => function ($query) use ($userFriends) {
            $query->whereIn('receiver_id', $userFriends);
        }])
            ->where('id', $friendId)
            ->first();

        $commonConnections = $friend->acceptedRequests()->paginate(10);

        return response()->json($commonConnections);
    }

    public function removeConnection(Request $request)
    {

        $user = Auth::user();
        $user->load('friends');
        $user->friends()->detach([$request->user_id]);
        return response()->json(['status' => 'success']);
    }
}
