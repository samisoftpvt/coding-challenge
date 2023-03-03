var skeletonId = '#skeleton';
var contentId = 'content';
var userListingTable = '.user-listing-table-body'
var skipCounter = 0;
var takeAmount = 10;

$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

function getRequests(mode) {
   $.ajax({
       url: `requests?mode=${mode}`,
       method: 'GET',
       dataType: 'JSON',
       success: function (response) {
           if (response.data && response.data.length) {
               $(userListingTable).empty();
               let html = '';
               response.data.forEach( function (item, index) {
                   if (mode === 'sent') {
                       html += makeSentRequestRow(item);
                   } else {
                       html += makeReceivedRequestRow(item);
                   }
               });
               const loadMoreBtnParent = $('#load_more_btn_parent');
               if (response.current_page !== response.last_page) {
                   loadMoreBtnParent.empty();
                   loadMoreBtnParent.show();
                   loadMoreBtnParent.append('<button type="button" class="btn btn-primary" id="load-more" data-page="'+ (response.current_page + 1) +'" onClick="getMoreRequests('+ `'${mode}'` +')">Load More</button>')
               }
               $(skeletonId).toggleClass("d-none");
               setTimeout(function() {
                   $(skeletonId).toggleClass("d-none");
                   $(`#request-${mode}-count`).text(response.data.length)
                   $(userListingTable).append(html);
               }, 200);

           }
       },
       error: function (error) {
           alert('Something went wrong, while getting sent request')
       }
   })
}

function makeSentRequestRow(item) {
    return '<tr class="suggestion-row-'+ item.id +'">\n' +
        '       <td class="align-middle">'+ item.name +'</td>\n' +
        '       <td class="align-middle"> -</td>\n' +
        '       <td class="align-middle">'+ item.email +'</td>\n' +
        '       <td class="align-middle"></td>\n' +
        '       <td class="align-middle">\n' +
        '          <button id="'+ item.id +'" onclick="withDrawalRequest('+ item.id +')" class="btn btn-danger me-1">Withdraw Request</button>\n' +
        '       </td>\n' +
        '    </tr>';
}

function makeReceivedRequestRow(item) {
    return '<tr class="suggestion-row-'+ item.id +'">\n' +
        '       <td class="align-middle">'+ item.name +'</td>\n' +
        '       <td class="align-middle"> -</td>\n' +
        '       <td class="align-middle">'+ item.email +'</td>\n' +
        '       <td class="align-middle"></td>\n' +
        '       <td class="align-middle">\n' +
        '          <button id="'+ item.id +'" onclick="acceptRequest('+ item.id +')" class="btn btn-primary me-1">Accept</button>\n' +
        '       </td>\n' +
        '    </tr>';
}

function getMoreRequests(mode) {
    const page = $("#load-more").data('page');
    $.ajax({
        url: `/requests?page=${page}&mode=${mode}`,
        method: 'GET',
        dataType: 'JSON',
        success: function (response) {
            if (response.data && response.data.length) {
                const requestsCountSpan = $(`#request-${mode}-count`)
                let oldCount = requestsCountSpan.text();
                let html = '';
                response.data.forEach( function (item, index) {
                    if (mode === 'sent') {
                        html += makeSentRequestRow(item);
                    } else {
                        html += makeReceivedRequestRow(item);
                    }
                });
                const loadMoreBtnParent = $('#load_more_btn_parent');

                if (response.current_page !== response.last_page) {
                    loadMoreBtnParent.empty();
                    loadMoreBtnParent.show();
                    loadMoreBtnParent.append('<button type="button" class="btn btn-primary" id="load-more" data-page="'+ (response.current_page + 1) +'" onClick="getMoreRequests('+ `'${mode}'` +')">Load More</button>')
                } else {
                    loadMoreBtnParent.hide();
                }
                $(skeletonId).toggleClass("d-none");
                setTimeout(function() {
                    $(skeletonId).toggleClass("d-none");
                    requestsCountSpan.text(parseInt(oldCount) + response.data.length)
                    $(userListingTable).append(html);
                }, 200);

            }
        },
        error: function (error) {
            alert("Something went wrong while getting suggestions")
        }
    })
}

function getConnections() {
    $.ajax({
        url: '/connections',
        method: 'GET',
        dataType: 'JSON',
        success: function (response) {
            if (response.data && response.data.length) {
                $(userListingTable).empty();
                let html = '';

                response.data.forEach( function (item, index) {
                    html += makeConnectionsRow(item);
                });
                const loadMoreBtnParent = $('#load_more_btn_parent');
                if (response.current_page !== response.last_page) {
                    loadMoreBtnParent.empty();
                    loadMoreBtnParent.show();
                    loadMoreBtnParent.append('<button type="button" class="btn btn-primary" id="load-more" data-page="'+ (response.current_page + 1) +'" onClick="getMoreConnections()">Load More</button>')
                }
                $(skeletonId).toggleClass("d-none");
                setTimeout(function() {
                    $(skeletonId).toggleClass("d-none");
                    $("#connection-count").text(response.data.length)
                    $(userListingTable).append(html);
                }, 200);

            }
        },
        error: function (error) {
            alert("Something went wrong while getting suggestions")
        }
    })
}

function makeConnectionsRow(item) {
    return '<tr class="suggestion-row-'+ item.id +'">\n' +
        '       <td class="align-middle">'+ item.name +'</td>\n' +
        '       <td class="align-middle"> -</td>\n' +
        '       <td class="align-middle">'+ item.email +'</td>\n' +
        '       <td class="align-middle">' +
        '           <button style="width: 220px" id="get_connections_in_common_" class="btn btn-primary" type="button"\n' +
        '               data-bs-toggle="collapse" data-bs-target="#collapse_'+ item.id +'" aria-expanded="false" aria-controls="collapseExample">\n' +
        '               Connections in common\n' +
        '           </button>' +
        '       </td>\n' +
        '       <td class="align-middle">\n' +
        '          <button id="'+ item.id +'" onclick="removeConnection('+ item.id +')" class="btn btn-danger me-1">Remove Connection</button>\n' +
        '       </td>\n' +
        '    </tr>';
}

function removeConnection(userId) {
    $.ajax({
        url: '/remove-connection',
        method: 'POST',
        dataType: 'JSON',
        data: {user_id: userId},
        success: function (response) {
            const count = $("#connection-count");
            debugger;
            if (response.status === 'success') {
                let oldCount = count.text()
                count.text(parseInt(oldCount) - 1)
                $(`.suggestion-row-${userId}`).remove()
            }
        },
        error: function (error) {
            alert('Something went wrong, while accepting the invitation')
        }
    })
}
function getMoreConnections() {
    const page = $("#load-more").data('page')
    $.ajax({
        url: `/connections?page=${page}`,
        method: 'GET',
        dataType: 'JSON',
        success: function (response) {
            if (response.data && response.data.length) {
                let html = '';
                response.data.forEach( function (item, index) {
                    html += makeConnectionsRow(item);
                });
                const loadMoreBtnParent = $('#load_more_btn_parent');
                if (response.current_page !== response.last_page) {
                    loadMoreBtnParent.empty();
                    loadMoreBtnParent.show();
                    loadMoreBtnParent.append('<button type="button" class="btn btn-primary" id="load-more" data-page="'+ (response.current_page + 1) +'" onClick="getMoreConnections()">Load More</button>')
                } else {
                    loadMoreBtnParent.hide();
                }
                $(skeletonId).toggleClass("d-none");
                setTimeout(function() {
                    $(skeletonId).toggleClass("d-none");
                    $("#connection-count").text(response.data.length)
                    $(userListingTable).append(html);
                }, 200);

            }
        },
        error: function (error) {
            alert("Something went wrong while getting suggestions")
        }
    })
}

function getConnectionsInCommon(userId) {
  $.ajax({
      url: `/common-connections?friend_id=${userId}`,
      method: 'GET',
      dataType: 'JSON',
      success: function (response) {
          if (response.data && response.data.length) {
              let html = '';
              response.data.forEach( function (item, index) {
                 html += makeCommonConnectionRow(item);
              });

              $(`.suggestion-row-${userId}`).append(html);
          }
      },
      error: function (error) {
          alert('Something went wrong, while getting common connections')
      }
  })
}

function makeCommonConnectionRow(item) {
    return '<tr class="suggestion-row-'+ item.id +'">\n' +
        '       <td class="align-middle">'+ item.name +'</td>\n' +
        '       <td class="align-middle"> -</td>\n' +
        '       <td class="align-middle">'+ item.email +'</td>\n' +
        '    </tr>';
}


function getSuggestions() {
    $.ajax({
        url: '/suggestions',
        method: 'GET',
        dataType: 'JSON',
        success: function (response) {
            if (response.data && response.data.length) {
                $(userListingTable).empty();
                let html = '';
                response.data.forEach( function (item, index) {
                    html += makeSuggestionRow(item);
                });
                const loadMoreBtnParent = $('#load_more_btn_parent');
                if (response.current_page !== response.last_page) {
                    loadMoreBtnParent.empty();
                    loadMoreBtnParent.show();
                    loadMoreBtnParent.append('<button type="button" class="btn btn-primary" id="load-more" data-page="'+ (response.current_page + 1) +'" onClick="getMoreSuggestions()">Load More</button>')
                }
                $(skeletonId).toggleClass("d-none");
                setTimeout(function() {
                    $(skeletonId).toggleClass("d-none");
                    $("#suggestion-count").text(response.data.length)
                    $(userListingTable).append(html);
                }, 200);

            }
        },
        error: function (error) {
            alert("Something went wrong while getting suggestions")
        }
    })
}

function makeSuggestionRow(item) {
    return '<tr class="suggestion-row-'+ item.id +'">\n' +
        '       <td class="align-middle">'+ item.name +'</td>\n' +
        '       <td class="align-middle"> -</td>\n' +
        '       <td class="align-middle">'+ item.email +'</td>\n' +
        '       <td class="align-middle"></td>\n' +
        '       <td class="align-middle">\n' +
        '          <button id="'+ item.id +'" onclick="sendRequest('+ item.id +')" class="btn btn-primary me-1">Connect</button>\n' +
        '       </td>\n' +
        '    </tr>';
}

function getMoreSuggestions() {
    const page = $("#load-more").data('page')
    $.ajax({
        url: `/suggestions?page=${page}`,
        method: 'GET',
        dataType: 'JSON',
        success: function (response) {
            if (response.data && response.data.length) {
                let oldSuggestionCount = $("#suggestion-count").text();
                let html = '';
                response.data.forEach( function (item, index) {
                    html += makeSuggestionRow(item);
                });
                const loadMoreBtnParent = $('#load_more_btn_parent');
                if (response.current_page !== response.last_page) {
                    loadMoreBtnParent.empty();
                    loadMoreBtnParent.show();
                    loadMoreBtnParent.append('<button type="button" class="btn btn-primary" id="load-more" data-page="'+ (response.current_page + 1) +'" onClick="getMoreSuggestions()">Load More</button>')
                } else {
                    loadMoreBtnParent.hide();
                }
                $(skeletonId).toggleClass("d-none");
                setTimeout(function() {
                    $(skeletonId).toggleClass("d-none");
                    $("#suggestion-count").text(parseInt(oldSuggestionCount) + response.data.length)
                    $(userListingTable).append(html);
                }, 200);

            }
        },
        error: function (error) {
            alert("Something went wrong while getting suggestions")
        }
    })
}

function sendRequest(userId) {
  $.ajax({
      url: '/connect',
      method: 'POST',
      data: {user_id: userId},
      dataType: 'JSON',
      success: function (response) {
          const suggestionCount = $("#suggestion-count");
          if (response.status && response.status === 'success') {
              let oldSuggestionCount = suggestionCount.text()
              suggestionCount.text(parseInt(oldSuggestionCount) - 1)
              $(`.suggestion-row-${userId}`).remove()
          }
      },
      error: function (error) {
          alert('Something went wrong, while sending request to user.')
      }
  })
}

function acceptRequest(userId) {

  $.ajax({
      url: '/accept',
      method: 'POST',
      dataType: 'JSON',
      data: {user_id: userId},
      success: function (response) {
          debugger;
          const count = $("#request-received-count");
          if (response.status === 'success') {
              let oldCount = count.text()
              count.text(parseInt(oldCount) - 1)
              $(`.suggestion-row-${userId}`).remove()
          }
      },
      error: function (error) {
          alert('Something went wrong, while accepting the invitation')
      }
  })
}

function withDrawalRequest(userId) {
    $.ajax({
        url: '/withdrawal',
        method: 'POST',
        dataType: 'JSON',
        data: {user_id: userId},
        success: function (response) {
            const count = $("#request-received-count");
            if (response.status === 'success') {
                let oldCount = count.text()
                count.text(parseInt(oldCount) - 1)
                $(`.suggestion-row-${userId}`).remove()
            }
        },
        error: function (error) {
            alert('Something went wrong, while accepting the invitation')
        }
    })
}

$(function () {
  //getSuggestions();
});
