import React from 'react';
import { GoogleApiWrapper, Map, Marker } from 'google-maps-react';

import mqtt from 'mqtt';

export class MapContainer extends React.Component {
    state = {lat: 40.854885,
         lng: -88.081807,
         altitude: 0,
         speed: 0,
         course: 0
        
        }

    updateMap(message){
        var [lat, lng, altitude, speed, course] = message.toString().split(',');
        this.setState({
            lat,
            lng,
            altitude,
            speed,
            course
        })
    }

    componentDidMount(){
        
        var client = mqtt.connect('ws://0.0.0.0:3000');

			client.subscribe('LOCATION');

			client.on('connect', function() {
				console.log('connected!');
			});

			client.on('message', (topic, message) => {
				console.log(topic, ' : ', message.toString());
				switch (topic) {
					case 'LOCATION':
						this.updateMap(message);
						break;
				}
			});
    }

    render() {
        const {lat, lng, altitude, speed, course } = this.state;
        return (
            <div style={{ width: '100%', height: '100%' }}>
                <Map
                    google={this.props.google}
                    initialCenter={{
                        lat,
                        lng
                    }}
                    center={{
                        lat,
                        lng
                    }}
                    zoom={18}
                >
                    <Marker
                        icon={{
                            path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                            fillColor: 'cyan',
                            fillOpacity: 0.9,
                            strokeWeight: 3,
                            scale: 8,
                            rotation: parseFloat(course),

                        }}
                        position={{ lat, lng }}

                    />
                </Map>
                <div id="info">
                    <h2>{speed} km/h</h2>
                    <h4>{altitude} msl</h4>
                </div>
            </div>
        )
    }
}

export default GoogleApiWrapper({
    apiKey: ("-------")
})(MapContainer)


