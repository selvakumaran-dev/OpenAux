/**
 * Get user's current location using browser Geolocation API
 * Uses cached location (up to 10 seconds old) for better performance
 * No permission popup after initial grant - silent background fetch
 * @returns {Promise<{lat: number, lng: number}>}
 */
export const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            },
            (error) => {
                let errorMessage = 'Unable to retrieve location';

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location permission denied. Please enable location access in your browser settings.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information unavailable. Please check your GPS/WiFi.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out. Please try again or check your GPS settings.';
                        break;
                }

                reject(new Error(errorMessage));
            },
            {
                enableHighAccuracy: false, // Faster response, good enough accuracy
                timeout: 5000,             // Quick timeout (5 seconds)
                maximumAge: 10000          // Use cached location up to 10 seconds old (instant!)
            }
        );
    });
};

/**
 * Watch user's location for continuous updates
 * @param {Function} callback - Called with {lat, lng} on location update
 * @returns {number} Watch ID for clearing
 */
export const watchLocation = (callback) => {
    if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported');
    }

    return navigator.geolocation.watchPosition(
        (position) => {
            callback({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
        },
        (error) => {
            console.error('Location watch error:', error);
        },
        {
            enableHighAccuracy: true,
            maximumAge: 5000
        }
    );
};

/**
 * Clear location watch
 * @param {number} watchId
 */
export const clearLocationWatch = (watchId) => {
    if (navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
    }
};
