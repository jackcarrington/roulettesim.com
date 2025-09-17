// CSP-safe behavior for SupportResourceFinder component
(function initSupportResourceFinder() {
  if (typeof window === 'undefined') return;
  const doc = document;

  function findResources() {
    const locationInput = doc.getElementById('location-input');
    const typeSelect = doc.getElementById('resource-type');
    if (!locationInput || !typeSelect) return;

    const location = locationInput.value.trim();
    const resourceType = typeSelect.value;

    const resourceCards = doc.querySelectorAll('.resource-card');
    let visibleCount = 0;

    resourceCards.forEach((el) => {
      const card = el;
      const cardType = card.dataset.resourceType;
      const typeMatches = !resourceType || cardType === resourceType;
      if (typeMatches) {
        card.style.display = 'block';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    const resultsInfo = doc.querySelector('.results-info span');
    if (resultsInfo) {
      resultsInfo.textContent = `${visibleCount} resources found${location ? ` near ${location}` : ''}`;
    }
  }

  function enableGeolocation() {
    const locationInput = doc.getElementById('location-input');
    const geoButton = doc.querySelector('.search-actions .color-secondary');

    if (!('geolocation' in navigator)) {
      window.alert('Geolocation is not supported by your browser');
      return;
    }

    if (geoButton) {
      geoButton.textContent = 'Getting location...';
      geoButton.disabled = true;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        if (locationInput) {
          locationInput.value = 'Current Location';
          locationInput.placeholder = `Lat: ${lat.toFixed(2)}, Lng: ${lng.toFixed(2)}`;
        }
        if (geoButton) {
          geoButton.textContent = 'Location Found';
          setTimeout(() => {
            geoButton.textContent = 'Use My Location';
            geoButton.disabled = false;
          }, 2000);
        }
        findResources();
      },
      (error) => {
        console.error('Geolocation error:', error);
        window.alert('Unable to get your location. Please enter it manually.');
        if (geoButton) {
          geoButton.textContent = 'Use My Location';
          geoButton.disabled = false;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  }

  // Wire up buttons via data-action attributes
  const findBtn = doc.querySelector('[data-action="find-resources"]');
  if (findBtn) {
    findBtn.addEventListener('click', findResources);
  }

  const geoBtn = doc.querySelector('[data-action="enable-geolocation"]');
  if (geoBtn) {
    geoBtn.addEventListener('click', enableGeolocation);
  }
})();
