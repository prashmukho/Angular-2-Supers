module.exports = function(lat, lng, crises, zoom) {
  // remove old event listeners
  if (window.onCrisisDelete) window.removeEventListener('message', onCrisisDelete);
  if (window.onGeocode) window.removeEventListener('message', onGeocode);
  if (window.onMapMarkerDragEnd) window.removeEventListener('mapmarkerdragend', onMapMarkerDragEnd);

  function deleteMarker(crisisId) {
    var index = myMapMarkers.map(function (markerWrapper) { 
      return markerWrapper.crisisId; 
    }).indexOf(crisisId);

    if (index === -1) {
      index = crises.map(function (crisis) { 
        return crisis['_id']; 
      }).indexOf(crisisId);
      crises.splice(index, 1);
    } else {
      myMapMarkers[index].marker.setMap(null);
      myMapMarkers.splice(index, 1);
    }
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
      myMapMarkers.forEach(function (markerWrapper) { 
        markerWrapper.marker.setMap(map); 
      });
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

    function attachInfoWindow(markerWrapper) {
      var infowindow = new google.maps.InfoWindow({
        content: '<h4>'+markerWrapper.marker.getTitle()+'</h4>'+
                 '<p>Location:</p>'+
                 'lat:'+markerWrapper.marker.getPosition().lat()+'<br/>'+
                 'lng:'+markerWrapper.marker.getPosition().lng()+'<br/>'
      });
      markerWrapper.marker.addListener('click', function() {
        infowindow.open(map, markerWrapper.marker);
      });
      markerWrapper.infoWindow = infowindow;
    }

    function attachDragEndHandler(markerWrapper) {
      markerWrapper.marker.addListener('dragend', function() {
        dragData.crisisId = markerWrapper.crisisId;
        dragData.newLat = markerWrapper.marker.getPosition().lat();
        dragData.newLng = markerWrapper.marker.getPosition().lng();
        
        markerWrapper.infoWindow.setContent(
          '<h4>'+markerWrapper.marker.getTitle()+'</h4>'+
          '<p>Location:</p>'+
          'lat:'+dragData.newLat+'<br/>'+
          'lng:'+dragData.newLng+'<br/>'
        );
        
        window.dispatchEvent(mapMarkerDragEndEvent);
      });
    }

    function positionCircle() {}

    window.myMapMarkers = window.myMapMarkers || [];
    deleteMarkers(); // remove old map marker references 

    crises.forEach(function (crisis, index) {
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(crisis.epicenter[1], crisis.epicenter[0]),
        title: crisis.title,
        draggable: true
      });
      
      var mapMarker = { 
        marker: marker, 
        crisisId: crisis['_id']
      };
      attachInfoWindow(mapMarker);
      attachDragEndHandler(mapMarker);
      myMapMarkers.push(mapMarker);
    });
    
    var dragData = { crisisId: null, newLat: null, newLng: null };
    var mapMarkerDragEndEvent = new CustomEvent('mapmarkerdragend', { 'detail': dragData });
    // if not displaying a new crisis
    // if (myMapMarkers[0] && myMapMarkers[0].crisisId) attachInfoWindows();
    // attachDragEndHandlers();
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

      if (crises.length > 1) {
        var updatedCrisis = crises.filter(function(crisis) {
          return crisis['_id'] === crisisId;
        })[0];
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

            window.postMessage({ 
              type: 'newepicenter', 
              epicenter: [lng, lat]
            }, '*');
          },
          failure: function(error) { console.error(error); }
        });
      }

      map.setCenter(new google.maps.LatLng(lat,lng));
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