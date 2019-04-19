import React, { Component } from 'react';
import './App.css';

import { withStyles } from '@material-ui/core/styles';

import MyAppBar from './components/MyAppBar';
import FoodDrawer from './components/FoodDrawer';
import OneMap from './components/OneMap';

import FoodList from './foodlist';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  toolbar: theme.mixins.toolbar,
});

// Sort food list
FoodList.sort((a, b) => {
  return a.name.toUpperCase().localeCompare(b.name.toUpperCase());
});

class App extends Component {
  constructor(props) {
    super(props);
    this.oneMapRef = React.createRef();

    this.state = {
      foodList: FoodList,
      foodDrawerOpen: false,
      selectedPlace: null,
      mapOptions: {
        position: [1.3521, 103.8198],
        zoom: 12,
        selectedTile: 'Default'
      }
    };
  }

  onTileChange = event => {
    if (event.target.value !== "") {
      let newState = this.state;
      newState.mapOptions.selectedTile = event.target.value;
      this.setState(newState);
    }
  }

  toggleFoodDrawer = () => {
    let newState = this.state;
    newState.foodDrawerOpen = !newState.foodDrawerOpen;
    this.setState(newState);
  }

  normaliseString(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
  }

  filterFood = event => {
    let newState = this.state;

    // Filter by name and address
    newState.foodList = FoodList.map(place => {
      let name = event.target.value.toLowerCase().trim();
      if (name === '') {
        return place;
      } else if (this.normaliseString(place.name).toLowerCase().indexOf(name) !== -1) {
        return place;
      } else {
        let subLocations = place.locations.filter(location => {
          return location.address.toLowerCase().indexOf(name) !== -1;
        });

        if (subLocations.length > 0) {
          let subPlace = {
            name: place.name,
            locations: subLocations
          };

          return subPlace;
        }

        return undefined;
      }
    });

    // Remove undefined values
    newState.foodList = newState.foodList.filter(place => place !== undefined);

    this.setState(newState);
  }

  setSelectedPlace = (place) => {
    let newState = this.state;
    newState.foodDrawerOpen = false;
    newState.selectedPlace = place;
    if (newState.mapOptions.zoom === 12) { newState.mapOptions.zoom = 17 }
    this.setState(newState);
    this.openPopup(place)
  }

  openPopup(name) {
    this.oneMapRef.openPopup(name);
  }

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <MyAppBar
          toggleFoodDrawer={this.toggleFoodDrawer}
          selectedTile={this.state.mapOptions.selectedTile}
          onTileChange={this.onTileChange}
        />
        <FoodDrawer
          foodList={this.state.foodList}
          foodDrawerOpen={this.state.foodDrawerOpen}
          toggleFoodDrawer={this.toggleFoodDrawer}
          filterFood={this.filterFood}
          setSelectedPlace={this.setSelectedPlace}
        />
        <OneMap
          onRef={ref => (this.oneMapRef = ref)}
          mapOptions={this.state.mapOptions}
          foodList={this.state.foodList}
          selectedPlace={this.state.selectedPlace}
        />
      </div>
    );
  }
}

export default withStyles(styles)(App);
