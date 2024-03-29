import React from 'react';
import { useEffect, useState } from 'react';
import {useJsApiLoader, GoogleMap, Marker} from '@react-google-maps/api'
import './Maps.css'


const Maps = ({GMapKey, property}) => {


  const [result, setResult] = useState({lat: 0, lng: 0})

  useEffect(() => {
    const lat = parseFloat(property.lat)
    const long = parseFloat(property.long)
    setResult({lat: lat, lng: long})
  }, [property]);

  const containerStyle = {
    height: '100%',
    width: '100%'
  };

  // mapContainerStyle={containerStyle}

  const center = {lat: result.lat, lng: result.lng}

  const {isLoaded} = useJsApiLoader ({
    googleMapsApiKey: GMapKey,
    id: 'google-map-script'
  });

  return (
    <div>
      {isLoaded && (
        <div className='MapsMain'>
          <GoogleMap center={center} zoom={16} mapContainerStyle={containerStyle}>
            <Marker position={center} />
          </GoogleMap>
        </div>
      )}
    </div>
  );
};

export default Maps;
