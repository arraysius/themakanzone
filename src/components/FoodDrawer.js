import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import TextField from '@material-ui/core/TextField';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
// import Chip from '@material-ui/core/Chip';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { withStyles } from '@material-ui/core/styles';

const drawerWidth = 240;

const styles = theme => ({
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    maxWidth: drawerWidth
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
  filterSearch: {
    margin: '0 auto'
  },
  filterNummberText: {
    fontSize: 16
  },
  // chipTag: {
  //   margin: 2
  // }
});

class ResponsiveDrawer extends Component {
  constructor(props) {
    super(props);

    this.totalPlaces = this.props.foodList.length;

    // Insert multi-location dropdown state
    let multiOpenStates = {}
    this.props.foodList.forEach(place => {
      if (place.locations.length > 1) {
        multiOpenStates[place.name] = false;
      }
    });

    this.state = multiOpenStates;
  }

  handleOpenChange(name) {
    let newState = this.state;
    newState[name] = !newState[name];
    this.setState(newState);
  }

  render() {
    const { classes } = this.props;

    const foodFilter = (
      <div className={classes.filterSearch}>
        <TextField
          id="foodFilter"
          label="Filter"
          type="search"
          margin="normal"
          variant="outlined"
          autoComplete='off'
          onChange={event => this.props.filterFood(event)}
        />

        <Typography
          className={classes.filterNummberText}
          variant="body1"
        >
          Showing {this.props.foodList.length} of {this.totalPlaces}
        </Typography>
      </div>
    );

    const foodDrawer = (
      <div>
        <List>
          {/* Enumerate food places */}
          {this.props.foodList.map(place => {
            if (place.locations.length === 1) {
              // Single location
              return (place.locations.map((location, index) =>
                <ListItem
                  button
                  key={place.name + '0'}
                  divider
                  onClick={() => this.props.setSelectedPlace([place.name, index, location.position])}>
                  {/* <Grid direction="column"> */}
                  <ListItemText
                    primary={place.name}
                    secondary={location.address}
                  />

                  {/* TODO: Chip tags */}
                  {/* <Chip className={classes.chipTag} variant="outlined" label="TAG" /> */}
                  {/* </Grid> */}
                </ListItem>
              ))
            } else {
              // Multiple locations
              return (
                <div key={place.name}>
                  <ListItem
                    button
                    divider
                    onClick={() => this.handleOpenChange(place.name)}
                  >
                    <ListItemText
                      primary={place.name}
                      secondary={'Multiple Locations'}
                    />
                    {this.state[place.name] ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse in={this.state[place.name]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {place.locations.map((location, index) => (
                        <ListItem
                          button
                          key={place.name + index}
                          divider
                          dense
                          onClick={() => this.props.setSelectedPlace([place.name, index, location.position])}>
                          <ListItemText inset primary={location.address} />
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </div>
              )
            }
          })}
        </List>
      </div>
    );

    return (
      <div className={classes.drawer}>
        {/* Mobile Drawer */}
        <Hidden smUp>
          <Drawer
            variant="temporary"
            open={this.props.foodDrawerOpen}
            onClose={this.props.toggleFoodDrawer}
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <div className={classes.drawerHeader}>
              <IconButton onClick={this.props.toggleFoodDrawer}>
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <Divider />
            {foodFilter}
            {foodDrawer}
          </Drawer>
        </Hidden>

        {/* Desktop Side Panel */}
        <Hidden xsDown>
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            <div className={classes.toolbar} />
            {foodFilter}
            {foodDrawer}
          </Drawer>
        </Hidden>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ResponsiveDrawer);
