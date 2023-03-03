<div class="row justify-content-center mt-5">
  <div class="col-12">
    <div class="card shadow  text-white bg-dark">
      <div class="card-header">Coding Challenge - Network connections</div>
      <div class="card-body">
        <div class="btn-group w-100 mb-3" role="group" aria-label="Basic radio toggle button group">
          <input type="radio" class="btn-check" name="btnradio" id="btnradio1" autocomplete="off" checked>
          <label class="btn btn-outline-primary" for="btnradio1" id="get_suggestions_btn" onClick="getSuggestions()">Suggestions (<span id="suggestion-count">0</span>)</label>

          <input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off">
          <label class="btn btn-outline-primary" for="btnradio2" id="get_sent_requests_btn" onClick="getRequests('sent')">Sent Requests (<span id="request-sent-count">0</span>)</label>

          <input type="radio" class="btn-check" name="btnradio" id="btnradio3" autocomplete="off">
          <label class="btn btn-outline-primary" for="btnradio3" id="get_received_requests_btn" onClick="getRequests('received')">Received Requests (<span id="request-received-count">0</span>)</label>

          <input type="radio" class="btn-check" name="btnradio" id="btnradio4" autocomplete="off">
          <label class="btn btn-outline-primary" for="btnradio4" id="get_connections_btn" onclick="getConnections()">Connections (<span id="connection-count">0</span>)</label>
        </div>
        <hr>
        <div id="content">
            <div class="my-2 shadow  text-white bg-dark p-1" id="">
                <div class="d-flex justify-content-between">
                    <table class="ms-1 user-listing-table">
                        <tbody class="user-listing-table-body">

                        </tbody>
                    </table>
                </div>
            </div>
            <div id="skeleton" class="d-none">
                @for ($i = 0; $i < 10; $i++)
                    <x-skeleton />
                @endfor
            </div>
            <div class="d-flex justify-content-center mt-2 py-3" id="load_more_btn_parent" style="display: none">
{{--                <button type="button" class="btn btn-primary" id="load-more" data-page="2">Load more</button>--}}
            </div>
        </div>
      </div>
    </div>
  </div>
</div>

