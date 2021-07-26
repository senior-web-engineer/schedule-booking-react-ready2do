import React from "react";
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
} from "react-google-maps";
import { compose, withProps } from "recompose";
import Config from "../../config";

// const StrutturaMap = withGoogleMap((props)=>{
//     const lat = props.lat ;
//     const lng = props.lng ;

//     const coordinateSpecificate = ()=>{
//         return (lat && lng);
//     }

//     return (
//         coordinateSpecificate ?
//         <GoogleMap
//             defaultZoom={8}
//             defaultCenter={{lat, lng}}
//             >
//             <Marker position={{lat, lng}}></Marker>
//         </GoogleMap>
//         : ""
//     )
//     });

const StrutturaMap = compose(
  withProps({
    /**
     * Note: create and replace your own key in the Google console.
     * https://console.developers.google.com/apis/dashboard
     * The key "AIzaSyBkNaAGLEVq0YLQMi-PYEMabFeREadYe1Q" can be ONLY used in this sandbox (no forked).
     */
    googleMapURL: `https://maps.googleapis.com/maps/api/js?libraries=places&key=${Config.GoogleAPI.MapsKey}&language=it`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px`, width: `672px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withScriptjs,
  withGoogleMap
)((props) => (
  <GoogleMap
    defaultZoom={16}
    defaultCenter={{ lat: props.lat, lng: props.lng }}
  >
    {/* {props.isMarkerShown && ( */}
    <Marker position={{ lat: props.lat, lng: props.lng }} />
    {/* )}  */}
  </GoogleMap>
));

export default StrutturaMap;
