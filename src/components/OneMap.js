import React, { Component } from 'react';

import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import { withStyles } from '@material-ui/core/styles';

import LocateControl from './LocateControl';

const drawerWidth = 240;

const styles = theme => ({
  toolbar: theme.mixins.toolbar,
  map: {
    [theme.breakpoints.down('sm')]: {
      width: '100vw'
    },
    height: '90vh',
    width: window.screen.width - drawerWidth
  }
});

class OneMap extends Component {
  constructor(props) {
    super(props);
    this.state = this.props.mapOptions;
    this.markers = {}
    this.props.foodList.forEach(place => {
      place.locations.forEach((location, index) => {
        this.markers[place.name + index] = React.createRef();
      });
    });
  }

  componentDidMount() {
    this.props.onRef(this);
    this.map = this.mapInstance.leafletElement;
  }

  openPopup(selectedMarker) {
    this.markers[selectedMarker[0] + selectedMarker[1]].current.leafletElement.openPopup();
  }

  render() {
    const { classes } = this.props;

    let mapCenter = this.props.selectedPlace === null ?
      this.state.position
      :
      this.props.selectedPlace[2];

    let tileUrl = 'https://maps-{s}.onemap.sg/v3/' + this.state.selectedTile + '/{z}/{x}/{y}.png';

    // Setup LocateControl options
    const locateOptions = {
      position: 'topleft',
      strings: {
        title: 'View my location'
      },
      onActivate: () => { } // callback before engine starts retrieving locations
    }

    return (
      <div ref={(ref) => { this.ref = ref }}>
        <div className={classes.toolbar} />
        <Map
          ref={e => { this.mapInstance = e }}
          className={classes.map}
          center={mapCenter}
          zoom={this.state.zoom}
          minZoom={11}
          maxZoom={19}
        >
          <TileLayer
            attribution='<img src="https://docs.onemap.sg/maps/images/oneMap64-01.png" style="height:20px;width:20px;"/> OneMap | Map data © contributors, <a href="http://SLA.gov.sg">Singapore Land Authority</a>'
            url={tileUrl}
          />
          <LocateControl options={locateOptions} />

          {/* Enumerate marker positions */}
          {this.props.foodList.map(place => (
            place.locations.map((location, index) => {
              // console.log(place.name);
              return (
                <Marker
                  ref={this.markers[place.name + index]}
                  key={place.name + location.position.join(',')}
                  position={location.position}>
                  <Popup>
                    <strong>{place.name}</strong>
                    <br />
                    {location.address}
                  </Popup>
                </Marker>
              );
            })
          ))}
        </Map>
      </div>
    );
  }
}

export default withStyles(styles)(OneMap);
