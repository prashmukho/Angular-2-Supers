module.exports = function(lat, lng, crises, zoom) {
  // remove old event listeners
  if (window.onCrisisDelete) window.removeEventListener('message', onCrisisDelete);
  if (window.onGeocode) window.removeEventListener('message', onGeocode);
  if (window.onMapMarkerDragEnd) window.removeEventListener('mapmarkerdragend', onMapMarkerDragEnd);

  function deleteMarker(crisisId) {
    var index = myMapMarkers.map(function (markerWrapper) { 
      return markerWrapper.crisisId; 
    }).indexOf(crisisId);
    myMapMarkers[index].marker.setMap(null);
    myMapMarkers.splice(index, 1);
  }

  window.onCrisisDelete = function (e) {
    if (e.data.type === 'deletecrisis') deleteMarker(e.data.crisisId);
  };
  window.addEventListener("message", onCrisisDelete, false);

  function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
      center: new google.maps.LatLng(lat,lng),
      zoom: (zoom || 8)
    });

    function setMapOnAll(map) {
      var markers = myMapMarkers.map(function (markerWrapper) { return markerWrapper.marker; });
      for (var i = 0; i < markers.length; i++)
        markers[i].setMap(map);
    }

    function showMarkers() {
      setMapOnAll(map);
    }

    function clearMarkers() {
      setMapOnAll(null);
    }

    function deleteMarkers() {
      clearMarkers();
      myMapMarkers = [];
    }

    function attachInfoWindows() {
      myMapMarkers.forEach(function (markerWrapper, index) {
        var infowindow = new google.maps.InfoWindow({
          content: '<h3>'+markerWrapper.marker.getTitle()+'</h3>'
        });
        markerWrapper.marker.addListener('click', function() {
          infowindow.open(map, markerWrapper.marker);
        });
      });
    }

    function attachDragEndHandlers() {
      myMapMarkers.forEach(function (markerWrapper, index) {
        markerWrapper.marker.addListener('dragend', function() {
          dragData.crisisId = markerWrapper.crisisId;
          dragData.newLat = markerWrapper.marker.getPosition().lat();
          dragData.newLng = markerWrapper.marker.getPosition().lng();
          window.dispatchEvent(mapMarkerDragEndevent);
        });
      });
    }

    window.myMapMarkers = window.myMapMarkers || [];
    deleteMarkers(); // remove old map marker references 

    crises.forEach(function (crisis, index) {
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(crisis.epicenter[1], crisis.epicenter[0]),
        title: crisis.title,
        draggable: true
      });
      myMapMarkers.push({ 
        marker: marker, 
        crisisId: crisis['_id']
      });
    });
    
    var dragData = { crisisId: null, newLat: null, newLng: null };
    var mapMarkerDragEndevent = new CustomEvent('mapmarkerdragend', { 'detail': dragData });
    attachDragEndHandlers();
    if (myMapMarkers[0].crisisId) attachInfoWindows();
    showMarkers();

    window.onGeocode = function (e) {
      if (e.data.type === 'geocoderequest') {
        var coords = e.data.coords;
        var newLatLng = new google.maps.LatLng(coords.lat, coords.lng);
        myMapMarkers[0].marker.setPosition(newLatLng);
        map.setCenter(newLatLng);
      }
    };
    window.addEventListener('message', onGeocode, false);

    window.onMapMarkerDragEnd = function (e) {
      var lng = e.detail.newLng, 
          lat = e.detail.newLat, 
          crisisId = e.detail.crisisId;

      var updatedCrisis = crises.filter(function(crisis) {
        return crisisId && crisis['_id'] === crisisId;
      })[0];
      if (updatedCrisis) {
        updatedCrisis.epicenter = [lng, lat];
        $.ajax('http://localhost:8080/api/v1/crises/'+crisisId, {
          type: 'PUT',
          dataType: 'json',
          data: { crisis: updatedCrisis },
          success: function(resp) { console.log('updated', resp.data); },
          error: function(error) { console.error(error); }
        });
      }

      // for new/edit crisis views
      var $address = $('#formatted-address');
      if ($address.length) {
        $.ajax('/api/v1/getAddress?lat='+lat+'&lng='+lng, {
          dataType: 'json',
          success: function(resp) { 
            var results = resp.data.results;
            var newLocation = ( results.length ? results[0].formatted_address : 'Unknown location' );
            $address.val(newLocation);
          },
          failure: function(error) { console.error(error); }
        });
      }
    };
    window.addEventListener('mapmarkerdragend', onMapMarkerDragEnd, false);
  }

  var js = document.createElement('script');
  js.id = 'google-maps-jssdk';
  js.src = 'https://maps.googleapis.com/maps/api/js?key='+process.env.GOOGLE_MAPS_API_KEY;
  js.setAttribute('async', 'async');
  js.setAttribute('defer', 'defer');
  js.onload = initMap;

  // if you come back to new/edit crisis view 'window.google' exists
  if (window.google)
    initMap();
  else
    if (!document.getElementById('google-maps-jssdk')) document.body.appendChild(js);
};